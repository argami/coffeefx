(function() {
  var EventEmitter, Move, current, map;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  window.move = function(selector) {
    return new Move(move.select(selector));
  };
  window.move.defaults = {
    duration: 500
  };
  current = getComputedStyle || currentStyle;
  map = {
    'top': 'px',
    'bottom': 'px',
    'left': 'px',
    'right': 'px',
    'width': 'px',
    'height': 'px',
    'font-size': 'px',
    'margin': 'px',
    'margin-top': 'px',
    'margin-bottom': 'px',
    'margin-left': 'px',
    'margin-right': 'px',
    'padding': 'px',
    'padding-top': 'px',
    'padding-bottom': 'px',
    'padding-left': 'px',
    'padding-right': 'px'
  };
  window.move.ease = {
    'in': 'ease-in',
    'out': 'ease-out',
    'in-out': 'ease-in-out',
    'snap': 'cubic-bezier(0,1,.5,1)'
  };
  window.move.select = function(selector) {
    return document.getElementById(selector) || document.querySelectorAll(selector)[0];
  };
  EventEmitter = (function() {
    function EventEmitter() {
      this.callbacks = {};
    }
    EventEmitter.prototype.on = function(event, fn) {
      (this.callbacks[event] = this.callbacks[event] || []).push(fn);
      return this;
    };
    EventEmitter.prototype.emit = function(event) {
      var args, callback, callbacks, _i, _len, _ref;
      args = Array.prototype.slice.call(arguments, 1);
      callbacks = (_ref = this.callbacks[event]) != null ? _ref : [];
      for (_i = 0, _len = callbacks.length; _i < _len; _i++) {
        callback = callbacks[_i];
        callback.apply(this, args);
      }
      return this;
    };
    return EventEmitter;
  })();
  window.Move = Move = (function() {
    __extends(Move, EventEmitter);
    function Move(el) {
      if (!(this instanceof Move)) {
        return new Move(el);
      }
      EventEmitter.call(this);
      this.el = el;
      this._props = {};
      this._rotate = 0;
      this._transitionProps = [];
      this._transforms = [];
      this._animations = {};
      this.duration(move.defaults.duration);
      this.name = "" + this.el.id + "_" + (Math.floor(Math.random() * 1000001));
    }
    Move.prototype.name = function(name) {
      this.name = name;
      return this;
    };
    Move.prototype.transform = function(transform) {
      this._transforms.push(transform);
      return this;
    };
    Move.prototype.skew = function(x, y) {
      if (y == null) {
        y = 0;
      }
      return this.transform("skew(" + x + "deg, " + y + "deg)");
    };
    Move.prototype.skewX = function(n) {
      return this.transform("skewX(" + n + "deg)");
    };
    Move.prototype.skewY = function(n) {
      return this.transform("skewY(" + n + "deg)");
    };
    Move.prototype.translate = function(x, y) {
      if (y == null) {
        y = 0;
      }
      return this.to(x, y);
    };
    Move.prototype.to = function(x, y) {
      if (y == null) {
        y = 0;
      }
      return this.transform("translate(" + x + "px, " + y + "px)");
    };
    Move.prototype.translateX = function(n) {
      return this.x(n);
    };
    Move.prototype.x = function(n) {
      return this.transform("translateX(" + n + "px)");
    };
    Move.prototype.translateY = function(n) {
      return this.y(n);
    };
    Move.prototype.y = function(n) {
      return this.transform("translateY(" + n + "px)");
    };
    Move.prototype.scale = function(x, y) {
      return this.transform("scale(" + x + ", " + (y != null ? y : x) + ")");
    };
    Move.prototype.scaleX = function(n) {
      return this.transform("scaleX(" + n + ")");
    };
    Move.prototype.scaleY = function(n) {
      return this.transform("scaleY(" + n + ")");
    };
    Move.prototype.rotate = function(n) {
      return this.transform("rotate(" + n + "deg)");
    };
    Move.prototype.ease = function(fn) {
      return this.setVendorProperty('transition-timing-function', move.ease[fn] || fn || 'ease');
    };
    Move.prototype.duration = function(n) {
      this._duration = 'string' === typeof n ? parseFloat(n) * 1000 : n;
      this.setVendorProperty('transition-duration', "" + this._duration + "ms");
      return this.setAnimationProp('animation-duration', "" + this._duration + "ms");
    };
    Move.prototype.iteration = function(n) {
      return this.setAnimationProp('animation-iteration-count', n);
    };
    Move.prototype.delay = function(n) {
      n = 'string' === typeof n ? parseFloat(n) * 1000 : n;
      return this.setVendorProperty('transition-delay', "" + n + "ms");
    };
    Move.prototype.setProperty = function(prop, val) {
      this._props[prop] = val;
      return this;
    };
    Move.prototype.setVendorProperty = function(prop, val) {
      var brow, _i, _len, _ref;
      _ref = ['-webkit-', '-moz-', '-ms-', '-o-'];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        brow = _ref[_i];
        this.setProperty(brow + prop, val);
      }
      return this;
    };
    Move.prototype.setAnimationProp = function(prop, val) {
      var brow, _i, _len, _ref;
      _ref = ['-webkit-', '-moz-', '-ms-', '-o-'];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        brow = _ref[_i];
        this._animations[brow + prop] = val;
      }
      return this;
    };
    Move.prototype.set = function(prop, val) {
      this.transition(prop);
      if ('number' === typeof val && map[prop]) {
        val += map[prop];
      }
      this._props[prop] = val;
      return this;
    };
    Move.prototype.add = function(prop, val) {
      var self;
      self = this;
      return this.on('start', function() {
        return self.set(prop, parseInt(self.current(prop), 10) + val + 'px');
      });
    };
    Move.prototype.sub = function(prop, val) {
      var self;
      self = this;
      return this.on('start', function() {
        return self.set(prop, parseInt(self.current(prop), 10) - val + 'px');
      });
    };
    Move.prototype.current = function(prop) {
      return current(this.el).getPropertyValue(prop);
    };
    Move.prototype.transition = function(prop) {
      if (!this._transitionProps.indexOf(prop)) {
        return this;
      }
      this._transitionProps.push(prop);
      return this;
    };
    Move.prototype.applyProperties = function() {
      var cssAnimation, el, keyframe, prop, props, rules, self, value, _ref;
      props = this._props;
      el = this.el;
      cssAnimation = document.createElement('style');
      cssAnimation.id = "coffeeFxStyle";
      cssAnimation.type = 'text/css';
      rules = " -webkit-animation-name: animation_" + this.name + ";\n";
      _ref = this._animations;
      for (prop in _ref) {
        value = _ref[prop];
        rules += " " + prop + ": " + value + ";\n";
      }
      rules = ".animation_" + this.name + " { \n " + rules + " }";
      keyframe = "";
      for (prop in props) {
        if (props.hasOwnProperty(prop)) {
          keyframe += " " + prop + ": " + props[prop] + ";\n";
        }
      }
      keyframe = "@-webkit-keyframes animation_" + this.name + " {\n      from { " + keyframe + " }    }";
      self = this;
      cssAnimation.appendChild(document.createTextNode("" + rules + "\n " + keyframe));
      document.getElementsByTagName("head")[0].appendChild(cssAnimation);
      window.setTimeout((function() {
        return el.style.webkitAnimationName = "animation_" + self.name;
      }), 0);
      el.className = "animation_" + this.name;
      return this;
    };
    Move.prototype.move = function(selector) {
      return this.select(selector);
    };
    Move.prototype.select = function(selector) {
      this.el = move.select(selector);
      return this;
    };
    Move.prototype.then = function(fn) {
      var clone;
      if (fn instanceof Move) {
        this.on('end', function() {
          return fn.end();
        });
      } else if ('function' === typeof fn) {
        this.on('end', fn);
      } else {
        clone = new Move(this.el);
        clone._transforms = this._transforms.slice(0);
        this.then(clone);
        clone.parent = this;
        return clone;
      }
      return this;
    };
    Move.prototype.pop = function() {
      return this.parent;
    };
    Move.prototype.end = function(fn) {
      var self;
      self = this;
      this.emit('start');
      if (this._transforms.length) {
        this.setVendorProperty('transform', this._transforms.join(' '));
      }
      this.setVendorProperty('transition-properties', this._transitionProps.join(', '));
      this.applyProperties();
      return this;
    };
    return Move;
  })();
}).call(this);
