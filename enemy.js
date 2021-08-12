class Enemy {
  constructor(config) {
    this.type = config.type;
    this.width = config.width;
    this.height = config.height;
    this.x = Math.floor(Math.random() * (375 - config.width));
    this.y = -config.height;
    this.life = config.life;
    this.score = config.score;
    this.frame = config.frame;
    this.img = this.frame.live[0];
    this.live = true;
    this.minSpeed = config.minSpeed;
    this.maxSpeed = config.maxSpeed;
    this.speed =
      Math.floor(
        Math.random() * (config.minSpeed - config.maxSpeed + 1)
      ) + config.maxSpeed;
    this.lastTime = new Date().getTime();
    this.deathIndex=0;
    this.destory=false;
  }
  paint(context) {
    context.drawImage(this.img, this.x, this.y);
  }
  move() {
    const currentTime = new Date().getTime();
    if (currentTime - this.lastTime >= this.speed) {
      if(this.live){
        this.img = this.frame.live[0];
        this.y++;
      }else{
        this.img=this.frame.death[this.deathIndex++];
        if(this.deathIndex===this.frame.death.length){
          this.destory=true;
        }
      }
      this.lastTime = currentTime;            
    }
  }
  hit(o) {
    let ol = o.x;
    let or = o.x + o.width;
    let ot = o.y;
    let ob = o.y + o.height;
    let el = this.x;
    let er = this.x + this.width;
    let et = this.y;
    let eb = this.y + this.height;
    if (ol > er || or < el || ot > eb || ob <et) {
      return false;
    } else {
      return true;
    }
  }
  collide(){
    this.life--;
    if(this.life===0){
      this.live=false;
      score+=this.score
    }
  }
  outOfBounds(){
    if(this.y>pageH){
      return true;
    }
  }
}