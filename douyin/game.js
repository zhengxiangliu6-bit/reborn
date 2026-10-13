const { LifeEngine, content } = require('./engine');
const ads = require('./ads');
const { CanvasGame } = require('./ui');

const storage = {
  get(key) { return tt.getStorageSync(key); },
  set(key, value) { tt.setStorageSync(key, value); },
};
const engine = new LifeEngine(storage);
const canvas = tt.createCanvas();
const game = new CanvasGame(canvas, engine, content, ads);
game.start();
