const START = 0;
      const STARTING = 1;
      const RUNNING = 2;
      const PAUSE = 3;
      const END = 4;
      let pageH = document.body.clientHeight;
      
      const IMAGES={
        bullet:"img/bullet1.png",
        bg:"img/bg.png",
        start:"img/start.png",
        pause:"img/game_pause_nor.png",
        loading_frame:["img/game_loading1.png","img/game_loading2.png","img/game_loading3.png","img/game_loading4.png"],
        hero_frame_live:["img/hero1.png","img/hero2.png"],
        hero_frame_death:["img/hero_blowup_n1.png","img/hero_blowup_n2.png","img/hero_blowup_n3.png","img/hero_blowup_n4.png"],
        e1_live:["img/enemy1.png"],
        e1_death:["img/enemy1_down1.png","img/enemy1_down2.png","img/enemy1_down3.png","img/enemy1_down4.png"],
        e2_live:["img/enemy2.png"],
        e2_death:["img/enemy2_down1.png","img/enemy2_down2.png","img/enemy2_down3.png","img/enemy2_down4.png"],
        e3_live:["img/enemy3_n1.png","img/enemy3_n2.png"],
        e3_death:["img/enemy3_down1.png","img/enemy3_down2.png","img/enemy3_down3.png","img/enemy3_down4.png","img/enemy3_down5.png","img/enemy3_down6.png"],
      }
      function createImage(src){
        let img
        if(typeof src==="string"){
          img = new Image();
          img.src = src;
        }else{
          img=[];
          for(let i=0;i<src.length;i++){
            img[i]=new Image();
            img[i].src=src[i];
          }
        }
        return img;
      }
      const bullet = createImage(IMAGES.bullet);
      const bg = createImage(IMAGES.bg);
      const start = createImage(IMAGES.start);
      const pause = createImage(IMAGES.pause);
      const loading_frame = createImage(IMAGES.loading_frame);
      const hero_frame = { live: createImage(IMAGES.hero_frame_live), death: createImage(IMAGES.hero_frame_death)};      
      const e1 = { live:createImage(IMAGES.e1_live) ,death:createImage(IMAGES.e1_death) };
      const e2 = { live:createImage(IMAGES.e2_live) ,death:createImage(IMAGES.e2_death) };
      const e3 = { live:createImage(IMAGES.e3_live) ,death:createImage(IMAGES.e3_death) };

      const SKY = {
        bg: bg,
        width: 375,
        height: pageH,
        speed: 10,
      };
      const LOADING = {
        frame: loading_frame,
        width: 186,
        height: 38,
        x: 0,
        y: pageH - 56,
        speed: 300,
      };
      const HERO = {
        frame: hero_frame,
        width: 99,
        height: 124,
        speed: 10,
      };
      const BULLET = {
        img: bullet,
        width: 9,
        height: 21,
      };
      const E1 = {
        type: 1,
        width: 57,
        height: 51,
        life: 1,
        score: 1,
        frame: e1,
        minSpeed: 20,
        maxSpeed: 10,
      };
      const E2 = {
        type: 2,
        width: 69,
        height: 95,
        life: 5,
        score: 5,
        frame: e2,
        minSpeed: 50,
        maxSpeed: 20,
      };
      const E3 = {
        type: 3,
        width: 169,
        height: 258,
        life: 20,
        score: 20,
        frame: e3,
        minSpeed: 100,
        maxSpeed: 100,
      };