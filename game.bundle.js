(() => {
  // lib/kontra.min.mjs
  var noop = () => {
  };
  var srOnlyStyle = "position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);";
  function addToDom(t, e) {
    let i = e.parentNode;
    if (t.setAttribute("data-kontra", ""), i) {
      let s = i.querySelector("[data-kontra]:last-of-type") || e;
      i.insertBefore(t, s.nextSibling);
    } else
      document.body.appendChild(t);
  }
  function removeFromArray(t, e) {
    let i = t.indexOf(e);
    if (i != -1)
      return t.splice(i, 1), true;
  }
  var canvasEl;
  var context;
  var callbacks$2 = {};
  function on(t, e) {
    callbacks$2[t] = callbacks$2[t] || [], callbacks$2[t].push(e);
  }
  function off(t, e) {
    callbacks$2[t] = (callbacks$2[t] || []).filter((t2) => t2 != e);
  }
  function emit(t, ...e) {
    (callbacks$2[t] || []).map((t2) => t2(...e));
  }
  var handler$1 = { get: (t, e) => e == "_proxy" || noop };
  function getCanvas() {
    return canvasEl;
  }
  function getContext() {
    return context;
  }
  function init$1(t, { contextless: e = false } = {}) {
    if (canvasEl = document.getElementById(t) || t || document.querySelector("canvas"), e && (canvasEl = canvasEl || new Proxy({}, handler$1)), !canvasEl)
      throw Error("You must provide a canvas element for the game");
    return context = canvasEl.getContext("2d") || new Proxy({}, handler$1), context.imageSmoothingEnabled = false, emit("init"), { canvas: canvasEl, context };
  }
  var imageRegex = /(jpeg|jpg|gif|png|webp)$/;
  var audioRegex = /(wav|mp3|ogg|aac)$/;
  var leadingSlash = /^\//;
  var trailingSlash = /\/$/;
  var dataMap = /* @__PURE__ */ new WeakMap();
  var imagePath = "";
  var audioPath = "";
  var dataPath = "";
  function getUrl(t, e) {
    return new URL(t, e).href;
  }
  function joinPath(t, e) {
    return [t.replace(trailingSlash, ""), t ? e.replace(leadingSlash, "") : e].filter((t2) => t2).join("/");
  }
  function getExtension(t) {
    return t.split(".").pop();
  }
  function getName(t) {
    let e = t.replace("." + getExtension(t), "");
    return e.split("/").length == 2 ? e.replace(leadingSlash, "") : e;
  }
  function getCanPlay(t) {
    return { wav: t.canPlayType('audio/wav; codecs="1"'), mp3: t.canPlayType("audio/mpeg;"), ogg: t.canPlayType('audio/ogg; codecs="vorbis"'), aac: t.canPlayType("audio/aac;") };
  }
  var imageAssets = {};
  var audioAssets = {};
  var dataAssets = {};
  function addGlobal() {
    window.__k || (window.__k = { dm: dataMap, u: getUrl, d: dataAssets, i: imageAssets });
  }
  function loadImage(t) {
    return addGlobal(), new Promise((e, i) => {
      let s, a, n;
      if (s = joinPath(imagePath, t), imageAssets[s])
        return e(imageAssets[s]);
      a = new Image(), a.onload = function() {
        n = getUrl(s, window.location.href), imageAssets[getName(t)] = imageAssets[s] = imageAssets[n] = this, emit("assetLoaded", this, t), e(this);
      }, a.onerror = function() {
        i("Unable to load image " + s);
      }, a.src = s;
    });
  }
  function loadAudio(t) {
    return new Promise((e, i) => {
      let s, a, n, o, r = t;
      return s = new Audio(), a = getCanPlay(s), (t = [].concat(t).reduce((t2, e2) => t2 || (a[getExtension(e2)] ? e2 : null), 0)) ? (n = joinPath(audioPath, t), audioAssets[n] ? e(audioAssets[n]) : (s.addEventListener("canplay", function() {
        o = getUrl(n, window.location.href), audioAssets[getName(t)] = audioAssets[n] = audioAssets[o] = this, emit("assetLoaded", this, t), e(this);
      }), s.onerror = function() {
        i("Unable to load audio " + n);
      }, s.src = n, void s.load())) : i("cannot play any of the audio formats provided " + r);
    });
  }
  function loadData(t) {
    let e, i;
    return addGlobal(), e = joinPath(dataPath, t), dataAssets[e] ? Promise.resolve(dataAssets[e]) : fetch(e).then((t2) => {
      if (!t2.ok)
        throw t2;
      return t2.clone().json().catch(() => t2.text());
    }).then((s) => (i = getUrl(e, window.location.href), typeof s == "object" && dataMap.set(s, i), dataAssets[getName(t)] = dataAssets[e] = dataAssets[i] = s, emit("assetLoaded", s, t), s));
  }
  function load(...t) {
    return addGlobal(), Promise.all(t.map((t2) => {
      let e = getExtension([].concat(t2)[0]);
      return e.match(imageRegex) ? loadImage(t2) : e.match(audioRegex) ? loadAudio(t2) : loadData(t2);
    }));
  }
  function angleToTarget(t, e) {
    return Math.atan2(e.y - t.y, e.x - t.x);
  }
  function rotatePoint(t, e) {
    let i = Math.sin(e), s = Math.cos(e);
    return { x: t.x * s - t.y * i, y: t.x * i + t.y * s };
  }
  function clamp(t, e, i) {
    return Math.min(Math.max(t, i), e);
  }
  function collides(t, e) {
    return [t, e] = [t, e].map((t2) => getWorldRect(t2)), t.x < e.x + e.width && t.x + t.width > e.x && t.y < e.y + e.height && t.y + t.height > e.y;
  }
  function getWorldRect(t) {
    let { x: e = 0, y: i = 0, width: s, height: a } = t.world || t;
    return t.mapwidth && (s = t.mapwidth, a = t.mapheight), t.anchor && (e -= s * t.anchor.x, i -= a * t.anchor.y), s < 0 && (e += s, s *= -1), a < 0 && (i += a, a *= -1), { x: e, y: i, width: s, height: a };
  }
  var Vector = class {
    constructor(t = 0, e = 0, i = {}) {
      t.x != null ? (this.x = t.x, this.y = t.y) : (this.x = t, this.y = e), i._c && (this.clamp(i._a, i._b, i._d, i._e), this.x = t, this.y = e);
    }
    set(t) {
      this.x = t.x, this.y = t.y;
    }
    add(t) {
      return new Vector(this.x + t.x, this.y + t.y, this);
    }
    subtract(t) {
      return new Vector(this.x - t.x, this.y - t.y, this);
    }
    scale(t) {
      return new Vector(this.x * t, this.y * t);
    }
    normalize(t = this.length() || 1) {
      return new Vector(this.x / t, this.y / t);
    }
    dot(t) {
      return this.x * t.x + this.y * t.y;
    }
    length() {
      return Math.hypot(this.x, this.y);
    }
    distance(t) {
      return Math.hypot(this.x - t.x, this.y - t.y);
    }
    angle(t) {
      return Math.acos(this.dot(t) / (this.length() * t.length()));
    }
    direction() {
      return Math.atan2(this.y, this.x);
    }
    clamp(t, e, i, s) {
      this._c = true, this._a = t, this._b = e, this._d = i, this._e = s;
    }
    get x() {
      return this._x;
    }
    get y() {
      return this._y;
    }
    set x(t) {
      this._x = this._c ? clamp(this._a, this._d, t) : t;
    }
    set y(t) {
      this._y = this._c ? clamp(this._b, this._e, t) : t;
    }
  };
  function factory$a() {
    return new Vector(...arguments);
  }
  var Updatable = class {
    constructor(t) {
      return this.init(t);
    }
    init(t = {}) {
      this.position = factory$a(), this.velocity = factory$a(), this.acceleration = factory$a(), this.ttl = 1 / 0, Object.assign(this, t);
    }
    update(t) {
      this.advance(t);
    }
    advance(t) {
      let e = this.acceleration;
      t && (e = e.scale(t)), this.velocity = this.velocity.add(e);
      let i = this.velocity;
      t && (i = i.scale(t)), this.position = this.position.add(i), this._pc(), this.ttl--;
    }
    get dx() {
      return this.velocity.x;
    }
    get dy() {
      return this.velocity.y;
    }
    set dx(t) {
      this.velocity.x = t;
    }
    set dy(t) {
      this.velocity.y = t;
    }
    get ddx() {
      return this.acceleration.x;
    }
    get ddy() {
      return this.acceleration.y;
    }
    set ddx(t) {
      this.acceleration.x = t;
    }
    set ddy(t) {
      this.acceleration.y = t;
    }
    isAlive() {
      return this.ttl > 0;
    }
    _pc() {
    }
  };
  var GameObject = class extends Updatable {
    init({ width: t = 0, height: e = 0, context: i = getContext(), render: s = this.draw, update: a = this.advance, children: n = [], anchor: o = { x: 0, y: 0 }, opacity: r = 1, rotation: h = 0, scaleX: l = 1, scaleY: d = 1, ...c } = {}) {
      this._c = [], super.init({ width: t, height: e, context: i, anchor: o, opacity: r, rotation: h, scaleX: l, scaleY: d, ...c }), this._di = true, this._uw(), this.addChild(n), this._rf = s, this._uf = a, on("init", () => {
        this.context ??= getContext();
      });
    }
    update(t) {
      this._uf(t), this.children.map((e) => e.update && e.update(t));
    }
    render() {
      let t = this.context;
      t.save(), (this.x || this.y) && t.translate(this.x, this.y), this.rotation && t.rotate(this.rotation), this.scaleX == 1 && this.scaleY == 1 || t.scale(this.scaleX, this.scaleY);
      let e = -this.width * this.anchor.x, i = -this.height * this.anchor.y;
      (e || i) && t.translate(e, i), this.context.globalAlpha = this.opacity, this._rf(), (e || i) && t.translate(-e, -i), this.children.map((t2) => t2.render && t2.render()), t.restore();
    }
    draw() {
    }
    _pc() {
      this._uw(), this.children.map((t) => t._pc());
    }
    get x() {
      return this.position.x;
    }
    get y() {
      return this.position.y;
    }
    set x(t) {
      this.position.x = t, this._pc();
    }
    set y(t) {
      this.position.y = t, this._pc();
    }
    get width() {
      return this._w;
    }
    set width(t) {
      this._w = t, this._pc();
    }
    get height() {
      return this._h;
    }
    set height(t) {
      this._h = t, this._pc();
    }
    _uw() {
      if (!this._di)
        return;
      let { _wx: t = 0, _wy: e = 0, _wo: i = 1, _wr: s = 0, _wsx: a = 1, _wsy: n = 1 } = this.parent || {};
      this._wx = this.x, this._wy = this.y, this._ww = this.width, this._wh = this.height, this._wo = i * this.opacity, this._wsx = a * this.scaleX, this._wsy = n * this.scaleY, this._wx = this._wx * a, this._wy = this._wy * n, this._ww = this.width * this._wsx, this._wh = this.height * this._wsy, this._wr = s + this.rotation;
      let { x: o, y: r } = rotatePoint({ x: this._wx, y: this._wy }, s);
      this._wx = o, this._wy = r, this._wx += t, this._wy += e;
    }
    get world() {
      return { x: this._wx, y: this._wy, width: this._ww, height: this._wh, opacity: this._wo, rotation: this._wr, scaleX: this._wsx, scaleY: this._wsy };
    }
    set children(t) {
      this.removeChild(this._c), this.addChild(t);
    }
    get children() {
      return this._c;
    }
    addChild(...t) {
      t.flat().map((t2) => {
        this.children.push(t2), t2.parent = this, t2._pc = t2._pc || noop, t2._pc();
      });
    }
    removeChild(...t) {
      t.flat().map((t2) => {
        removeFromArray(this.children, t2) && (t2.parent = null, t2._pc());
      });
    }
    get opacity() {
      return this._opa;
    }
    set opacity(t) {
      this._opa = clamp(0, 1, t), this._pc();
    }
    get rotation() {
      return this._rot;
    }
    set rotation(t) {
      this._rot = t, this._pc();
    }
    setScale(t, e = t) {
      this.scaleX = t, this.scaleY = e;
    }
    get scaleX() {
      return this._scx;
    }
    set scaleX(t) {
      this._scx = t, this._pc();
    }
    get scaleY() {
      return this._scy;
    }
    set scaleY(t) {
      this._scy = t, this._pc();
    }
  };
  var Sprite = class extends GameObject {
    init({ image: t, width: e = t ? t.width : void 0, height: i = t ? t.height : void 0, ...s } = {}) {
      super.init({ image: t, width: e, height: i, ...s });
    }
    get animations() {
      return this._a;
    }
    set animations(t) {
      let e, i;
      for (e in this._a = {}, t)
        this._a[e] = t[e].clone(), i = i || this._a[e];
      this.currentAnimation = i, this.width = this.width || i.width, this.height = this.height || i.height;
    }
    playAnimation(t) {
      this.currentAnimation?.stop(), this.currentAnimation = this.animations[t], this.currentAnimation.start();
    }
    advance(t) {
      super.advance(t), this.currentAnimation?.update(t);
    }
    draw() {
      this.image && this.context.drawImage(this.image, 0, 0, this.image.width, this.image.height), this.currentAnimation && this.currentAnimation.render({ x: 0, y: 0, width: this.width, height: this.height, context: this.context }), this.color && (this.context.fillStyle = this.color, this.context.fillRect(0, 0, this.width, this.height));
    }
  };
  function factory$8() {
    return new Sprite(...arguments);
  }
  var pointers = /* @__PURE__ */ new WeakMap();
  var callbacks$1 = {};
  var pressedButtons = {};
  var pointerMap = { 0: "left", 1: "middle", 2: "right" };
  function getPointer(t = getCanvas()) {
    return pointers.get(t);
  }
  function circleRectCollision(t, e) {
    let { x: i, y: s, width: a, height: n } = getWorldRect(t);
    do {
      i -= t.sx || 0, s -= t.sy || 0;
    } while (t = t.parent);
    let o = e.x - Math.max(i, Math.min(e.x, i + a)), r = e.y - Math.max(s, Math.min(e.y, s + n));
    return o * o + r * r < e.radius * e.radius;
  }
  function getCurrentObject(t) {
    let e = t._lf.length ? t._lf : t._cf;
    for (let i = e.length - 1; i >= 0; i--) {
      let s = e[i];
      if (s.collidesWithPointer ? s.collidesWithPointer(t) : circleRectCollision(s, t))
        return s;
    }
  }
  function getPropValue(t, e) {
    return parseFloat(t.getPropertyValue(e)) || 0;
  }
  function getCanvasOffset(t) {
    let { canvas: e, _s: i } = t, s = e.getBoundingClientRect(), a = i.transform != "none" ? i.transform.replace("matrix(", "").split(",") : [1, 1, 1, 1], n = parseFloat(a[0]), o = parseFloat(a[3]), r = (getPropValue(i, "border-left-width") + getPropValue(i, "border-right-width")) * n, h = (getPropValue(i, "border-top-width") + getPropValue(i, "border-bottom-width")) * o, l = (getPropValue(i, "padding-left") + getPropValue(i, "padding-right")) * n, d = (getPropValue(i, "padding-top") + getPropValue(i, "padding-bottom")) * o;
    return { scaleX: (s.width - r - l) / e.width, scaleY: (s.height - h - d) / e.height, offsetX: s.left + (getPropValue(i, "border-left-width") + getPropValue(i, "padding-left")) * n, offsetY: s.top + (getPropValue(i, "border-top-width") + getPropValue(i, "padding-top")) * o };
  }
  function pointerDownHandler(t) {
    let e = t.button != null ? pointerMap[t.button] : "left";
    pressedButtons[e] = true, pointerHandler(t, "onDown");
  }
  function pointerUpHandler(t) {
    let e = t.button != null ? pointerMap[t.button] : "left";
    pressedButtons[e] = false, pointerHandler(t, "onUp");
  }
  function mouseMoveHandler(t) {
    pointerHandler(t, "onOver");
  }
  function blurEventHandler$2(t) {
    pointers.get(t.target)._oo = null, pressedButtons = {};
  }
  function callCallback(t, e, i) {
    let s = getCurrentObject(t);
    s && s[e] && s[e](i), callbacks$1[e] && callbacks$1[e](i, s), e == "onOver" && (s != t._oo && t._oo && t._oo.onOut && t._oo.onOut(i), t._oo = s);
  }
  function pointerHandler(t, e) {
    t.preventDefault();
    let i = t.target, s = pointers.get(i), { scaleX: a, scaleY: n, offsetX: o, offsetY: r } = getCanvasOffset(s);
    t.type.includes("touch") ? (Array.from(t.touches).map(({ clientX: t2, clientY: e2, identifier: i2 }) => {
      let h = s.touches[i2];
      h || (h = s.touches[i2] = { start: { x: (t2 - o) / a, y: (e2 - r) / n } }, s.touches.length++), h.changed = false;
    }), Array.from(t.changedTouches).map(({ clientX: i2, clientY: h, identifier: l }) => {
      let d = s.touches[l];
      d.changed = true, d.x = s.x = (i2 - o) / a, d.y = s.y = (h - r) / n, callCallback(s, e, t), emit("touchChanged", t, s.touches), e == "onUp" && (delete s.touches[l], s.touches.length--, s.touches.length || emit("touchEnd"));
    })) : (s.x = (t.clientX - o) / a, s.y = (t.clientY - r) / n, callCallback(s, e, t));
  }
  function initPointer({ radius: t = 5, canvas: e = getCanvas() } = {}) {
    let i = pointers.get(e);
    if (!i) {
      let s = window.getComputedStyle(e);
      i = { x: 0, y: 0, radius: t, touches: { length: 0 }, canvas: e, _cf: [], _lf: [], _o: [], _oo: null, _s: s }, pointers.set(e, i);
    }
    return e.addEventListener("mousedown", pointerDownHandler), e.addEventListener("touchstart", pointerDownHandler), e.addEventListener("mouseup", pointerUpHandler), e.addEventListener("touchend", pointerUpHandler), e.addEventListener("touchcancel", pointerUpHandler), e.addEventListener("blur", blurEventHandler$2), e.addEventListener("mousemove", mouseMoveHandler), e.addEventListener("touchmove", mouseMoveHandler), i._t || (i._t = true, on("tick", () => {
      i._lf.length = 0, i._cf.map((t2) => {
        i._lf.push(t2);
      }), i._cf.length = 0;
    })), i;
  }
  function pointerPressed(t) {
    return !!pressedButtons[t];
  }
  function clear(t) {
    let e = t.canvas;
    t.clearRect(0, 0, e.width, e.height);
  }
  function GameLoop({ fps: t = 60, clearCanvas: e = true, update: i = noop, render: s, context: a = getContext(), blur: n = false } = {}) {
    if (!s)
      throw Error("You must provide a render() function");
    let o, r, h, l, d, c = 0, u = 1e3 / t, p = 1 / t, g = e ? clear : noop, f = true;
    function m() {
      if (r = requestAnimationFrame(m), f && (h = performance.now(), l = h - o, o = h, !(l > 1e3))) {
        for (emit("tick"), c += l; c >= u; )
          d.update(p), c -= u;
        g(d.context), d.render();
      }
    }
    return n || (window.addEventListener("focus", () => {
      f = true;
    }), window.addEventListener("blur", () => {
      f = false;
    })), on("init", () => {
      d.context ??= getContext();
    }), d = { update: i, render: s, isStopped: true, context: a, start() {
      o = performance.now(), this.isStopped = false, requestAnimationFrame(m);
    }, stop() {
      this.isStopped = true, cancelAnimationFrame(r);
    }, _frame: m, set _last(t2) {
      o = t2;
    } }, d;
  }
  var keydownCallbacks = {};
  var keyupCallbacks = {};
  var pressedKeys = {};
  var keyMap = { Enter: "enter", Escape: "esc", Space: "space", ArrowLeft: "arrowleft", ArrowUp: "arrowup", ArrowRight: "arrowright", ArrowDown: "arrowdown" };
  function call(t = noop, e) {
    t._pd && e.preventDefault(), t(e);
  }
  function keydownEventHandler(t) {
    let e = keyMap[t.code], i = keydownCallbacks[e];
    pressedKeys[e] = true, call(i, t);
  }
  function keyupEventHandler(t) {
    let e = keyMap[t.code], i = keyupCallbacks[e];
    pressedKeys[e] = false, call(i, t);
  }
  function blurEventHandler() {
    pressedKeys = {};
  }
  function initKeys() {
    let t;
    for (t = 0; t < 26; t++)
      keyMap["Key" + String.fromCharCode(t + 65)] = String.fromCharCode(t + 97);
    for (t = 0; t < 10; t++)
      keyMap["Digit" + t] = keyMap["Numpad" + t] = "" + t;
    window.addEventListener("keydown", keydownEventHandler), window.addEventListener("keyup", keyupEventHandler), window.addEventListener("blur", blurEventHandler);
  }
  function keyPressed(t) {
    return !![].concat(t).some((t2) => pressedKeys[t2]);
  }
  function getAllNodes(t) {
    let e = [];
    return t._dn ? e.push(t._dn) : t.children && t.children.map((t2) => {
      e = e.concat(getAllNodes(t2));
    }), e;
  }
  var Scene = class {
    constructor({ id: t, name: e = t, objects: i = [], context: s = getContext(), cullObjects: a = true, cullFunction: n = collides, sortFunction: o, ...r }) {
      this._o = [], Object.assign(this, { id: t, name: e, context: s, cullObjects: a, cullFunction: n, sortFunction: o, ...r });
      let h = this._dn = document.createElement("section");
      h.tabIndex = -1, h.style = srOnlyStyle, h.id = t, h.setAttribute("aria-label", e);
      let l = this;
      this.camera = new class extends GameObject {
        set x(t2) {
          l.sx = t2 - this.centerX, super.x = t2;
        }
        get x() {
          return super.x;
        }
        set y(t2) {
          l.sy = t2 - this.centerY, super.y = t2;
        }
        get y() {
          return super.y;
        }
      }({ context: s, anchor: { x: 0.5, y: 0.5 }, render: this._rf.bind(this) }), this.add(i), this._i = () => {
        this.context ??= getContext();
        let t2 = this.context.canvas, { width: e2, height: i2 } = t2, s2 = e2 / 2, a2 = i2 / 2;
        Object.assign(this.camera, { centerX: s2, centerY: a2, x: s2, y: a2, width: e2, height: i2 }), this._dn.isConnected || addToDom(this._dn, t2);
      }, this.context && this._i(), on("init", this._i);
    }
    set objects(t) {
      this.remove(this._o), this.add(t);
    }
    get objects() {
      return this._o;
    }
    add(...t) {
      t.flat().map((t2) => {
        this._o.push(t2), t2.parent = this, getAllNodes(t2).map((t3) => {
          this._dn.appendChild(t3);
        });
      });
    }
    remove(...t) {
      t.flat().map((t2) => {
        removeFromArray(this._o, t2), t2.parent = null, getAllNodes(t2).map((t3) => {
          addToDom(t3, this.context);
        });
      });
    }
    show() {
      this.hidden = this._dn.hidden = false;
      let t = this._o.find((t2) => t2.focus);
      t ? t.focus() : this._dn.focus(), this.onShow();
    }
    hide() {
      this.hidden = this._dn.hidden = true, this.onHide();
    }
    destroy() {
      off("init", this._i), this._dn.remove(), this._o.map((t) => t.destroy && t.destroy());
    }
    lookAt(t) {
      let { x: e, y: i } = t.world || t;
      this.camera.x = e, this.camera.y = i;
    }
    update(t) {
      this.hidden || this._o.map((e) => e.update && e.update(t));
    }
    _rf() {
      let { _o: t, context: e, _sx: i, _sy: s, camera: a, sortFunction: n, cullObjects: o, cullFunction: r } = this;
      e.translate(i, s);
      let h = t;
      o && (h = h.filter((t2) => r(a, t2))), n && h.sort(n), h.map((t2) => t2.render && t2.render());
    }
    render() {
      if (!this.hidden) {
        let { context: t, camera: e } = this, { x: i, y: s, centerX: a, centerY: n } = e;
        t.save(), this._sx = a - i, this._sy = n - s, t.translate(this._sx, this._sy), e.render(), t.restore();
      }
    }
    onShow() {
    }
    onHide() {
    }
  };
  function factory$2() {
    return new Scene(...arguments);
  }

  // src/game2.js
  var { canvas, context: context2 } = init$1();
  initKeys();
  initPointer();
  var customMap = false;
  var mapWidth = 576;
  var mapHeight = 576;
  var canvasCenter_x = canvas.width / 2;
  var canvasCenter_y = canvas.height / 2;
  var max_attack_delay_player1 = 0.5;
  var max_attack_delay_player2 = 0.7;
  var max_ray_delay = 0.15;
  var ray_time_alive = 0.1;
  var spec_speed = 2.5;
  var player_speed = 1.45;
  var enemy_speed = 0.8;
  var bullet_speed = 4.5;
  var ray_speed = 3.5;
  var bullet1;
  var bullet2;
  var ray_left;
  var ray_straight;
  var ray_right;
  var finish_tile = null;
  function generate_coords_from_map(map) {
    let coords = [[]];
    let k = 0;
    for (let i = 0; i < 17; i++) {
      for (let j = 0; j <= 17; j++) {
        if (map[i][j] == 1) {
          k++;
          coords.push([32 * j, 32 * i]);
        }
        if (map[i][j] == 2) {
          k++;
          coords.push(["w", [32 * j, 32 * i]]);
        }
      }
    }
    return coords;
  }
  function generate_walls_from_coords(coords) {
    let walls = [];
    for (let i = 0; i < coords.length; i++) {
      if (coords[i][0] <= mapWidth && coords[i][1] <= mapHeight && coords[i][0] >= 0 && coords[i][1] >= 0) {
        let wall = factory$8({
          x: coords[i][0],
          y: coords[i][1],
          width: 32,
          height: 32,
          color: "white"
        });
        walls.push(wall);
      } else if (coords[i][0] == "w") {
        finish_tile = factory$8({
          x: coords[i][1][0],
          y: coords[i][1][1],
          width: 32,
          height: 32,
          color: "yellow"
        });
      }
    }
    return walls;
  }
  function get_pointer_pos_relative_to_map(player_x, player_y, pointer_x, pointer_y) {
    pointer_x -= canvasCenter_x;
    pointer_y -= canvasCenter_y;
    return { relative_x: player_x + pointer_x, relative_y: player_y + pointer_y };
  }
  function get_distance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  }
  load("assets/images/player.png", "assets/images/map1.png", "assets/images/enemy.png", "assets/images/player2.png").then(function(assets) {
    let map = [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 1, 1, 0, 1],
      [1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1],
      [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1],
      [1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1],
      [1, 0, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1],
      [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
      [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1],
      [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 2, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ];
    let coords = generate_coords_from_map(map);
    console.log("coords ", coords);
    let walls = [];
    if (!customMap) {
      walls = generate_walls_from_coords(coords);
    } else {
      walls = generate_walls_from_coords(new_map_coords);
    }
    let player1 = factory$8({
      lives: 4,
      x: 52,
      y: 52,
      image: assets[0],
      attack_delay: max_attack_delay_player1,
      anchor: { x: 0.5, y: 0.5 },
      time_alive: 0,
      alive: function() {
        return this.lives > 0;
      },
      shoot: function(pointer_x, pointer_y) {
        if (this.attack_delay <= 0) {
          let angle = angleToTarget(this, { x: pointer_x, y: pointer_y });
          let x_speed = bullet_speed * Math.cos(angle);
          let y_speed = bullet_speed * Math.sin(angle);
          let x_offset = 15 * Math.cos(angle);
          let y_offset = 15 * Math.sin(angle);
          bullet1 = factory$8({
            x: this.x + x_offset,
            y: this.y + y_offset,
            dx: x_speed,
            dy: y_speed,
            width: 5,
            height: 10,
            anchor: { x: 0.5, y: 0.5 },
            rotation: angle + Math.PI / 2,
            color: "red"
          });
          scene.add(bullet1);
          this.attack_delay = max_attack_delay_player1;
        }
      }
    });
    let player2 = factory$8({
      lives: 4,
      direction: 2,
      dx: 1,
      dy: 0,
      x: 52,
      y: 52,
      image: assets[3],
      attack_delay: max_attack_delay_player2,
      ray_delay: max_ray_delay,
      anchor: { x: 0.5, y: 0.5 },
      time_alive: 0,
      alive: function() {
        return this.lives > 0;
      },
      shoot_rays: function() {
        let angle = this.direction * Math.PI / 2;
        let angle_left = angle - Math.PI / 2.5;
        let angle_right = angle + Math.PI / 2.5;
        ray_left = factory$8({
          x: this.x,
          y: this.y,
          dx: -ray_speed * Math.cos(angle_left) * 0.9,
          dy: -ray_speed * Math.sin(angle_left) * 0.9,
          color: "red",
          width: 5,
          height: 5,
          time_alive: 0,
          collided: false,
          changed: false
        });
        ray_straight = factory$8({
          x: this.x,
          y: this.y,
          dx: -ray_speed * Math.cos(angle) * 1,
          dy: -ray_speed * Math.sin(angle) * 1,
          color: "blue",
          width: 5,
          height: 5,
          time_alive: 0,
          collided: false,
          changed: false
        });
        ray_right = factory$8({
          x: this.x,
          y: this.y,
          dx: -ray_speed * Math.cos(angle_right) * 0.9,
          dy: -ray_speed * Math.sin(angle_right) * 0.9,
          color: "yellow",
          width: 5,
          height: 5,
          time_alive: 0,
          collided: false,
          changed: false
        });
        scene.add(ray_left);
        scene.add(ray_straight);
        scene.add(ray_right);
      },
      shoot: function() {
        if (this.attack_delay <= 0) {
          let angle = angleToTarget(this, { x: player1.x, y: player1.y });
          let x_speed = bullet_speed * Math.cos(angle);
          let y_speed = bullet_speed * Math.sin(angle);
          let x_offset = 15 * Math.cos(angle);
          let y_offset = 15 * Math.sin(angle);
          bullet2 = factory$8({
            x: this.x + x_offset,
            y: this.y + y_offset,
            dx: x_speed,
            dy: y_speed,
            width: 5,
            height: 10,
            anchor: { x: 0.5, y: 0.5 },
            rotation: angle + Math.PI / 2,
            color: "blue"
          });
          scene.add(bullet2);
          this.attack_delay = max_attack_delay_player2;
        }
      }
    });
    let background = factory$8({
      x: 0,
      y: 0,
      image: assets[1]
    });
    let scene = factory$2({
      id: "game",
      objects: [background, finish_tile, player1, player2, ...walls]
    });
    let tmpx1 = 0;
    let tmpy1 = 0;
    let tmpx2 = 0;
    let tmpy2 = 0;
    let new_map_coords = [];
    let sprites = [];
    for (let i = 0; i < 17; i++) {
      for (let j = 0; j < 17; j++) {
        let sprite = factory$8({
          x: 32 * j,
          y: 32 * i,
          width: 32,
          height: 32,
          toggle: false
        });
        sprites.push(sprite);
      }
    }
    let spectator = factory$8({
      x: 0,
      y: 0,
      anchor: { x: 0.5, y: 0.5 },
      color: "red",
      width: 8,
      height: 8
    });
    let mapScene = factory$2({
      id: "map",
      objects: [background, ...sprites, spectator]
    });
    mapScene.hide();
    let btnpressed = false;
    const loop2 = GameLoop({
      update: function(dt) {
        console.log("update 2");
        mapScene.lookAt(spectator);
        if (keyPressed("w")) {
          spectator.y -= spec_speed;
        }
        if (keyPressed("s")) {
          spectator.y += spec_speed;
        }
        if (keyPressed("a")) {
          spectator.x -= spec_speed;
        }
        if (keyPressed("d")) {
          spectator.x += spec_speed;
        }
        if (spectator.x > mapWidth - spectator.width) {
          spectator.x = mapWidth - spectator.width;
        }
        if (spectator.x < 0) {
          spectator.x = 0;
        }
        if (spectator.y > mapHeight - spectator.height) {
          spectator.y = mapHeight - spectator.height;
        }
        if (spectator.y < 0) {
          spectator.y = 0;
        }
        if (keyPressed("space")) {
          loop2.stop();
          sprites.forEach(function(sprite) {
            if (sprite.toggle) {
              new_map_coords.push([sprite.x, sprite.y]);
              console.log("sprite x", sprite.x);
              console.log("sprite y", sprite.y);
            } else if (sprite.toggle == "w") {
              new_map_coords.push(["w", [sprite.x, sprite.y]]);
            }
          });
          alert("Level created!");
          mapScene.hide();
          scene.show();
          walls = null;
          console.log("new map coords", new_map_coords);
          walls = generate_walls_from_coords(new_map_coords);
          loop1.start();
        }
        for (let i = 0; i < sprites.length; i++) {
          if (collides(spectator, sprites[i])) {
            if (keyPressed("j")) {
              sprites[i].toggle = true;
            }
            if (keyPressed("k")) {
              sprites[i].toggle = false;
            }
            if (keyPressed("l")) {
              sprites[i].toggle = "w";
            }
          }
          if (sprites[i].toggle) {
            sprites[i].color = "white";
          } else if (sprites[i].toggle == "w") {
            sprites[i].color = "yellow";
          } else {
            sprites[i].color = null;
          }
        }
        mapScene.update();
      },
      render: function() {
        mapScene.render();
      }
    });
    const loop1 = GameLoop({
      update: function(dt) {
        console.log("update 1");
        player1.attack_delay -= dt;
        player2.attack_delay -= dt;
        player2.ray_delay -= dt;
        player1.time_alive += dt;
        player2.time_alive += dt;
        if (ray_left) {
          ray_left.time_alive += dt;
        }
        if (ray_straight) {
          ray_straight.time_alive += dt;
        }
        if (ray_right) {
          ray_right.time_alive += dt;
        }
        scene.lookAt(player1);
        if (keyPressed("w")) {
          player1.y -= player_speed;
        }
        if (keyPressed("s")) {
          player1.y += player_speed;
        }
        if (keyPressed("a")) {
          player1.x -= player_speed;
        }
        if (keyPressed("d")) {
          player1.x += player_speed;
        }
        if (player1.x > background.width - player1.width) {
          player1.x = background.width - player1.width;
        }
        if (player1.x < 0) {
          player1.x = 0;
        }
        if (player1.y > background.height - player1.height) {
          player1.y = background.height - player1.height;
        }
        if (player1.y < 0) {
          player1.y = 0;
        }
        if (!player1.alive()) {
          loop1.stop();
          alert("You lost");
          window.location.reload();
        }
        if (collides(player1, finish_tile) || keyPressed("u")) {
          loop1.stop();
          player1.x = 0;
          player1.y = 0;
          alert("You won");
          walls.forEach(function(wall) {
            let index = scene.objects.indexOf(wall);
            if (index > -1) {
              scene.objects.splice(index, 1);
            }
          });
          scene.hide();
          mapScene.show();
          loop2.start();
        }
        walls.forEach(function(wall) {
          if (collides(player1, wall)) {
            if (player1.time_alive < 1) {
              console.log("1 collided");
              player1.x = Math.floor(Math.random() * mapWidth);
              player1.y = Math.floor(Math.random() * mapHeight);
              player1.time_alive = 0;
            }
            player1.x = tmpx1;
            player1.y = tmpy1;
          }
          if (collides(player2, wall)) {
            if (player2.time_alive < 1) {
              console.log("2 collided");
              player2.x = Math.floor(Math.random() * mapWidth);
              player2.y = Math.floor(Math.random() * mapHeight);
              player2.time_alive = 0;
            }
            player2.x = tmpx2;
            player2.y = tmpy2;
          }
          if (bullet1 && collides(bullet1, wall)) {
            let index = scene.objects.indexOf(bullet1);
            if (index > -1) {
              scene.objects.splice(index, 1);
            }
            bullet1 = null;
          }
          if (bullet2 && collides(bullet2, wall)) {
            let index = scene.objects.indexOf(bullet2);
            if (index > -1) {
              scene.objects.splice(index, 1);
            }
            bullet2 = null;
          }
          if (ray_left && collides(ray_left, wall)) {
            ray_left.collided = true;
          }
          if (ray_straight && collides(ray_straight, wall)) {
            ray_straight.collided = true;
          }
          if (ray_right && collides(ray_right, wall)) {
            ray_right.collided = true;
          }
        });
        tmpx1 = player1.x;
        tmpy1 = player1.y;
        tmpx2 = player2.x;
        tmpy2 = player2.y;
        if (player2.ray_delay <= 0 && player2.alive()) {
          player2.shoot_rays();
          player2.ray_delay = max_ray_delay;
        }
        if (ray_left && ray_left.time_alive >= ray_time_alive) {
          let index = scene.objects.indexOf(ray_left);
          if (index > -1) {
            scene.objects.splice(index, 1);
          }
        }
        if (ray_straight && ray_straight.time_alive >= ray_time_alive) {
          let index = scene.objects.indexOf(ray_straight);
          if (index > -1) {
            scene.objects.splice(index, 1);
          }
        }
        if (ray_right && ray_right.time_alive >= ray_time_alive) {
          let index = scene.objects.indexOf(ray_right);
          if (index > -1) {
            scene.objects.splice(index, 1);
          }
        }
        if (player2.alive()) {
          if (ray_left) {
          }
          if (ray_straight) {
          }
          if (ray_right) {
          }
          if (ray_left && ray_left.collided && !ray_left.changed) {
            ray_left.changed = true;
            if (ray_straight.collided && !ray_straight.changed) {
              ray_straight.changed = true;
              if (ray_right.collided) {
                player2.direction += 1;
                ray_left.changed = false;
                ray_straight.changed = false;
              } else if (!ray_right.collided) {
                player2.direction -= 1;
                ray_left.changed = false;
                ray_straight.changed = false;
              }
            }
          } else if (ray_left && !ray_left.collided && !ray_left.changed) {
            if (ray_straight.collided && !ray_straight.changed) {
              ray_straight.changed = true;
              if (ray_right.collided && !ray_right.changed) {
                ray_right.changed = true;
                player2.direction -= 1;
                ray_left.changed = false;
                ray_straight.changed = false;
              } else if (!ray_right.collided) {
                player2.direction += 1;
                ray_left.changed = false;
                ray_straight.changed = false;
              }
            }
          }
          if (player2.direction > 4) {
            player2.direction = 1;
          }
          if (player2.direction < 1) {
            player2.direction = 4;
          }
          switch (player2.direction) {
            case 1:
              player2.dx = 0;
              player2.dy = -enemy_speed;
              break;
            case 2:
              player2.dx = enemy_speed;
              player2.dy = 0;
              break;
            case 3:
              player2.dx = 0;
              player2.dy = enemy_speed;
              break;
            case 4:
              player2.dx = -enemy_speed;
              player2.dy = 0;
              break;
          }
          if (player2.attack_delay <= 0 && get_distance(player1.x, player1.y, player2.x, player2.y) < 90) {
            player2.shoot();
          }
        }
        if (pointerPressed("left") && player1.attack_delay <= 0) {
          const { x, y } = getPointer();
          const { relative_x, relative_y } = get_pointer_pos_relative_to_map(player1.x, player1.y, x, y);
          player1.shoot(relative_x, relative_y);
        }
        if (bullet1) {
          if (collides(bullet1, player2)) {
            if (!player2.alive()) {
              let index = scene.objects.indexOf(player2);
              if (index > -1) {
                scene.objects.splice(index, 1);
              }
            } else {
              player2.lives -= 1;
              let index = scene.objects.indexOf(bullet1);
              if (index > -1) {
                scene.objects.splice(index, 1);
              }
              bullet1 = null;
              if (!player2.alive()) {
                let index2 = scene.objects.indexOf(player2);
                if (index2 > -1) {
                  scene.objects.splice(index2, 1);
                }
              }
            }
          }
        }
        if (bullet2) {
          if (collides(bullet2, player1)) {
            player1.lives -= 1;
            let index = scene.objects.indexOf(bullet2);
            if (index > -1) {
              scene.objects.splice(index, 1);
            }
            bullet2 = null;
            if (!player1.alive()) {
              let index2 = scene.objects.indexOf(player1);
              if (index2 > -1) {
                scene.objects.splice(index2, 1);
              }
            }
          }
        }
        if (bullet1) {
          if (bullet1.y < 0 || bullet1.y > mapHeight || bullet1.x < 0 || bullet1.x > mapWidth) {
            let index = scene.objects.indexOf(bullet1);
            if (index > -1) {
              scene.objects.splice(index, 1);
            }
            bullet1 = null;
          }
        }
        if (bullet2) {
          if (bullet2.y < 0 || bullet2.y > mapHeight || bullet2.x < 0 || bullet2.x > mapWidth) {
            let index = scene.objects.indexOf(bullet2);
            if (index > -1) {
              scene.objects.splice(index, 1);
            }
            bullet2 = null;
          }
        }
        scene.update();
      },
      render: function() {
        scene.render();
      }
    });
    loop1.start();
  });
})();
/**
 * @preserve
 * Kontra.js v9.0.0
 */
