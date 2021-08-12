class Bullet {
  constructor(config, x, y) {
    this.img = config.img;
    this.width = config.width;
    this.height = config.height;
    this.x = x;
    this.y = y;
    this.destory=false;
  }
  paint(context) {
    context.drawImage(this.img, this.x, this.y);
  }
  move() {
    this.y -= 2;
  }
  collide(){
    this.destory=true;
  }
  outOfBounds() {
    return this.y < -this.height;
  }
}