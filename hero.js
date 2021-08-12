class Hero {
  constructor(config) {
    this.width = config.width;
    this.height = config.height;
    this.frame = config.frame;
    this.x = (375 - config.width) / 2;
    this.y = pageH - config.height;
    this.frameLiveIndex = 0;
    this.frameDeathIndex = 0;
    this.img = null;
    this.live = true;
    this.speed = config.speed;
    this.lastTime = new Date().getTime();
    this.lastShootTime = new Date().getTime();
    this.shootInterval = 200;
    this.bulletList = [];
    this.destory=false;
  }
  judge() {
    let currentTime = new Date().getTime();
    if (currentTime - this.lastTime > this.speed) {
      if(this.live){
        this.img =this.frame.live[this.frameLiveIndex++ % this.frame.live.length];
      }else{
        this.img=this.frame.death[this.frameDeathIndex++];
        if(this.frameDeathIndex===this.frame.death.length){
          this.destory=true;
        }
      }            
      this.lastTime = currentTime;
    }
  }
  paint(context) {
    context.drawImage(this.img, this.x, this.y, this.width, this.height);
  }
  shoot() {
    let currentTime = new Date().getTime();
    if (currentTime - this.lastShootTime > this.shootInterval) {
      let bullet = new Bullet(
        BULLET,
        this.x + this.width / 2 - BULLET.width / 2,
        this.y - BULLET.height
      );
      this.bulletList.push(bullet);
      bullet.paint(context);
      this.lastShootTime = currentTime;
    }
  }
  collide(){
    this.live=false;
  }
}