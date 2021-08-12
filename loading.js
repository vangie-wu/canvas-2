class Loading {
  constructor(config) {
    this.frame = config.frame;
    this.frameIndex = 0;
    this.width = config.width;
    this.height = config.height;
    this.x = config.x;
    this.y = config.y;
    this.speed = config.speed;
    this.lastTime = new Date().getTime();
  }
  judge() {
    let currentTime = new Date().getTime();
    if (currentTime - this.lastTime > this.speed) {
      this.frameIndex++;
      if (this.frameIndex === 3) {
        state = RUNNING;
      }
      this.lastTime = currentTime;
    }
  }
  paint(context) {
    context.drawImage(this.frame[this.frameIndex], this.x, this.y);
  }
}