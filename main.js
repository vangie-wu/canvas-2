
const canvas = document.querySelector("#canvas");
const context = canvas.getContext("2d");
const sky = new Sky(SKY);
const loading = new Loading(LOADING);
let hero = new Hero(HERO);
let state = START;
canvas.addEventListener("click", () => {
  if (state === START) {
    state = STARTING;
  }
});
canvas.addEventListener("mousemove", (e) => {
  hero.x = e.offsetX - hero.width / 2;
  hero.y = e.offsetY - hero.height / 2;
});
canvas.addEventListener("mouseleave", () => {
  if (state === RUNNING) {
    state = PAUSE;
  }
});
canvas.addEventListener("mouseenter", () => {
  if (state === PAUSE) {
    state = RUNNING;
  }
});
function checkHit() {
  for (let i = 0; i < enemies.length; i++) {
    if (enemies[i].hit(hero)) {
      enemies[i].collide();
      hero.collide();
    }
    for (let j = 0; j < hero.bulletList.length; j++) {
      if (enemies[i].hit(hero.bulletList[j])) {
        enemies[i].collide();
        hero.bulletList[j].collide();
      }
    }
  }
}
let enemies = [];
let ENEMY_CREATE_INTERVAL = 800;
let ENEMY_LASTTIME = new Date().getTime();
function createComponent() {
  const currentTime = new Date().getTime();
  if (currentTime - ENEMY_LASTTIME >= ENEMY_CREATE_INTERVAL) {
    let ran = Math.floor(Math.random() * 100);
    if (ran < 60) {
      enemies.push(new Enemy(E1));
    } else if (ran < 90 && ran > 60) {
      enemies.push(new Enemy(E2));
    } else {
      enemies.push(new Enemy(E3));
    }
    ENEMY_LASTTIME = currentTime;
  }
}
function judgeComponent() {
  for (let i = 0; i < hero.bulletList.length; i++) {
    hero.bulletList[i].move();
  }
  for (let i = 0; i < enemies.length; i++) {
    enemies[i].move();
  }
}
let score = 0;
let life = 3;
function paintComponent() {
  for (let i = 0; i < hero.bulletList.length; i++) {
    hero.bulletList[i].paint(context);
  }
  for (let i = 0; i < enemies.length; i++) {
    enemies[i].paint(context);
  }
  context.font = "20px 微软雅黑";
  context.textAlign = "left";
  context.fillText("score:" + score, 10, 20);
  context.textAlign = "right";
  context.fillText("life:" + life, 375 - 10, 20);
}
function deleteComponent() {
  if (hero.destory) {
    life--;
    hero.destory = false;
    if (life === 0) {
      state = END;
    } else {
      hero = new Hero(HERO);
    }
  }
  for (let i = 0; i < hero.bulletList.length; i++) {
    if (hero.bulletList[i].outOfBounds() || hero.bulletList[i].destory) {
      hero.bulletList.splice(i, 1);
    }
  }
  for (let i = 0; i < enemies.length; i++) {
    if (enemies[i].outOfBounds() || enemies[i].destory) {
      enemies.splice(i, 1);
    }
  }
}
bg.addEventListener("load", () => {
  setInterval(() => {
    switch (state) {
      case START:
        sky.judge();
        sky.paint(context);
        let logo_x = (375 - start.naturalWidth) / 2;
        let logo_y = (pageH - start.naturalHeight) / 2;
        context.drawImage(start, logo_x, logo_y);
        break;
      case STARTING:
        sky.judge();
        sky.paint(context);
        loading.judge();
        loading.paint(context);
        break;
      case RUNNING:
        sky.judge();
        sky.paint(context);
        hero.judge();
        hero.paint(context);
        hero.shoot();
        createComponent();
        judgeComponent();
        deleteComponent();
        paintComponent();
        checkHit();
        break;
      case PAUSE:
        let pause_x = (375 - pause.naturalWidth) / 2;
        let pause_y = (pageH - pause.naturalHeight) / 2;
        context.drawImage(pause, pause_x, pause_y);
        break;
      case END:
        context.font = "bold 24px 微软雅黑";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText("GAME_OVER", 375 / 2, pageH / 2);
        break;
    }
  }, 10);
});
