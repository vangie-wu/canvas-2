// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"main.js":[function(require,module,exports) {
var canvas = document.querySelector("#canvas");
var context = canvas.getContext("2d");
var sky = new Sky(SKY);
var loading = new Loading(LOADING);
var hero = new Hero(HERO);
var state = START;
canvas.addEventListener("click", function () {
  if (state === START) {
    state = STARTING;
  }
});
canvas.addEventListener("mousemove", function (e) {
  hero.x = e.offsetX - hero.width / 2;
  hero.y = e.offsetY - hero.height / 2;
});
canvas.addEventListener("mouseleave", function () {
  if (state === RUNNING) {
    state = PAUSE;
  }
});
canvas.addEventListener("mouseenter", function () {
  if (state === PAUSE) {
    state = RUNNING;
  }
});

function checkHit() {
  for (var i = 0; i < enemies.length; i++) {
    if (enemies[i].hit(hero)) {
      enemies[i].collide();
      hero.collide();
    }

    for (var j = 0; j < hero.bulletList.length; j++) {
      if (enemies[i].hit(hero.bulletList[j])) {
        enemies[i].collide();
        hero.bulletList[j].collide();
      }
    }
  }
}

var enemies = [];
var ENEMY_CREATE_INTERVAL = 800;
var ENEMY_LASTTIME = new Date().getTime();

function createComponent() {
  var currentTime = new Date().getTime();

  if (currentTime - ENEMY_LASTTIME >= ENEMY_CREATE_INTERVAL) {
    var ran = Math.floor(Math.random() * 100);

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
  for (var i = 0; i < hero.bulletList.length; i++) {
    hero.bulletList[i].move();
  }

  for (var _i = 0; _i < enemies.length; _i++) {
    enemies[_i].move();
  }
}

var score = 0;
var life = 3;

function paintComponent() {
  for (var i = 0; i < hero.bulletList.length; i++) {
    hero.bulletList[i].paint(context);
  }

  for (var _i2 = 0; _i2 < enemies.length; _i2++) {
    enemies[_i2].paint(context);
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

  for (var i = 0; i < hero.bulletList.length; i++) {
    if (hero.bulletList[i].outOfBounds() || hero.bulletList[i].destory) {
      hero.bulletList.splice(i, 1);
    }
  }

  for (var _i3 = 0; _i3 < enemies.length; _i3++) {
    if (enemies[_i3].outOfBounds() || enemies[_i3].destory) {
      enemies.splice(_i3, 1);
    }
  }
}

bg.addEventListener("load", function () {
  setInterval(function () {
    switch (state) {
      case START:
        sky.judge();
        sky.paint(context);
        var logo_x = (375 - start.naturalWidth) / 2;
        var logo_y = (pageH - start.naturalHeight) / 2;
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
        var pause_x = (375 - pause.naturalWidth) / 2;
        var pause_y = (pageH - pause.naturalHeight) / 2;
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
},{}],"C:/Users/admin/AppData/Local/Yarn/Data/global/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "60584" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["C:/Users/admin/AppData/Local/Yarn/Data/global/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","main.js"], null)
//# sourceMappingURL=/main.1f19ae8e.js.map