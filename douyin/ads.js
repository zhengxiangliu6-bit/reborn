// 填入在抖音开发者后台创建的真实广告位 ID 后才启用。
const REWARDED_AD_UNIT_ID = '';
let instance = null;
let pending = null;

function enabled() { return Boolean(REWARDED_AD_UNIT_ID && typeof tt !== 'undefined' && tt.createRewardedVideoAd); }
function showRewarded(onCompleted, onUnavailable) {
  if (!enabled() || pending) { onUnavailable('暂无可用广告'); return; }
  try {
    if (!instance) {
      instance = tt.createRewardedVideoAd({ adUnitId: REWARDED_AD_UNIT_ID });
      instance.onClose(result => {
        const callbacks = pending;
        pending = null;
        if (callbacks && result && result.isEnded) callbacks.completed();
        else if (callbacks) callbacks.unavailable('观看未完成，本次没有消耗机会');
      });
      instance.onError(() => {
        const callbacks = pending;
        pending = null;
        if (callbacks) callbacks.unavailable('广告暂时不可用');
      });
    }
    pending = { completed: onCompleted, unavailable: onUnavailable };
    instance.show().catch(() => instance.load().then(() => instance.show()).catch(() => {
      const callbacks = pending;
      pending = null;
      if (callbacks) callbacks.unavailable('广告暂时不可用');
    }));
  } catch (error) {
    pending = null;
    onUnavailable('广告暂时不可用');
  }
}
module.exports = { enabled, showRewarded };
