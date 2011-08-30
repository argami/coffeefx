(function() {
  var Coffea, Coffeefx, current, map;
  var __indexOf = Array.prototype.indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (this[i] === item) return i;
    }
    return -1;
  };
  window.browsers = ['-webkit-', '-moz-', '-ms-', '-o-'];
  window.coffeefx = function(selector) {
    return new Coffeefx(selector);
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
  window.coffeefx.ease = {
    'in': 'ease-in',
    'out': 'ease-out',
    'in-out': 'ease-in-out',
    'snap': 'cubic-bezier(0,1,.5,1)'
  };
  window.Coffeefx = Coffeefx = (function() {
    function Coffeefx(selector) {
      if (selector == null) {
        selector = "";
      }
      if (selector === "") {
        throw new Error("SelectorEmpty");
      }
      this._selector = selector;
      this.el = this.select(selector);
      this._fx = {};
      this._context = void 0;
      this._baseContext();
      this.callbacks = [];
      if (this.el !== void 0) {
        this.duration();
      }
    }
    Coffeefx.prototype.select = function(selector) {
      return document.getElementById(selector) || document.querySelectorAll(selector)[0];
    };
    /*
      ---------------------------------
        base context
    
        Return the actual context 
        and create a new one if not any
        defined context
        
        @return {contextname} 
        @api private
      ---------------------------------
      */
    Coffeefx.prototype._baseContext = function() {
      var randomName;
      randomName = Math.floor(Math.random() * 1000001);
      if (this._context === void 0) {
        this._context = "" + this.el.id + "_" + randomName;
      }
      if (this._fx[this._context] === void 0) {
        this._fx[this._context] = {};
      }
      return this._fx[this._context];
    };
    /*
      ---------------------------------
        context
    
        Return the actual context (base) 
        or a subcontext required
    
        @param {String}
        @return {contextname} 
        @api private
      ---------------------------------
      */
    Coffeefx.prototype.context = function(context) {
      if (context == null) {
        context = "class";
      }
      if (this._baseContext()[context] === void 0) {
        this._baseContext()[context] = {};
      }
      return this._baseContext()[context];
    };
    /*
      ---------------------------------
        Set
        inserts a transition, 
        transformation or property to 
        the actual context
    
        @param {String} key
        @param {String} value
        @return this to concatenate
        @api public
      ---------------------------------
      */
    Coffeefx.prototype.set = function(key, value) {
      if ('number' === typeof value && map[key]) {
        value += map[key];
      }
      this.context()[key] = value;
      return this;
    };
    /*
      ---------------------------------
        SetBrowser 
        inserts a transition, 
        transformation the actual context
        and sums transformations
        
        @param {String} action
        @param {String} transformation / transition
        @param {String} sum - concatenate  trans?
        @api private
      ---------------------------------
      */
    Coffeefx.prototype._deleteBrowserAction = function(action) {
      var brow;
      if ((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = browsers.length; _i < _len; _i++) {
          brow = browsers[_i];
          _results.push(this.context()[brow + action] !== void 0);
        }
        return _results;
      }).call(this)) {
        return delete this.context()[brow + action];
      }
    };
    Coffeefx.prototype._setBrowser = function(action, value, sum) {
      var brow, val, _i, _len;
      if (sum == null) {
        sum = true;
      }
      for (_i = 0, _len = browsers.length; _i < _len; _i++) {
        brow = browsers[_i];
        val = this.context()[brow + action] === void 0 ? "" : this.context()[brow + action];
        if (sum) {
          val += "" + value + " ";
        } else {
          val = value;
        }
        this.set(brow + action, val);
      }
      return this;
    };
    /*
      ---------------------------------
        Prepare generates the css class
        from the context JSON
    
        @return {String}
        @api private
      ---------------------------------
      */
    Coffeefx.prototype._prepare = function() {
      var key, keyframe, text, val, value, _i, _len, _ref;
      text = "";
      keyframe = "";
      _ref = this._baseContext();
      for (key in _ref) {
        value = _ref[key];
        val = JSON.stringify(value).replace(/"/gi, "").replace(/"}"/gi, ";").replace("{", "").replace("}", ";").replace(/,/g, "; ");
        if (key === "class") {
          text += "." + this._context + " { " + val + " }";
        } else {
          keyframe += "" + key + " { " + val + " }";
        }
      }
      if (keyframe !== "") {
        for (_i = 0, _len = browsers.length; _i < _len; _i++) {
          key = browsers[_i];
          text += " @" + key + "keyframes " + this._context + "  { " + keyframe + " } ";
        }
      }
      return text;
    };
    /*
      ---------------------------------
        Add the class to the html
        head element
    
        @param {String} class
        @param {String} className
        @api private
      ---------------------------------
      */
    Coffeefx.prototype._addCssClass = function(className, class_text) {
      var cssAnimation;
      cssAnimation = document.createElement('style');
      cssAnimation.id = "" + className + "_style";
      cssAnimation.type = 'text/css';
      cssAnimation.appendChild(document.createTextNode(class_text));
      return document.getElementsByTagName("head")[0].appendChild(cssAnimation);
    };
    /*
      ---------------------------------
        Get computed or "current" value of `prop`.
       
        @param {String} prop
        @return {String}
        @api public
      ---------------------------------
      */
    Coffeefx.prototype.current = function(prop) {
      return current(this.el).getPropertyValue(prop);
    };
    /*
      ---------------------------------
        In case of being a chlid return
        the parent if not return it self
    
        @param {Number|String} n
        @return {Move} for chaining
        @api public
      ---------------------------------
      */
    Coffeefx.prototype.pop = function() {
      if ((this.parent != null) && this.valid_step(this._context)) {
        this.parent._baseContext()[this._context] = this.context();
      }
      return this.parent || this;
    };
    /*
      ---------------------------------
        _child generate a clean copy of 
        self with self as parent
    
        @return {CoffeeFx} 
        @api public
      ---------------------------------
      */
    Coffeefx.prototype._child = function() {
      var clone, key, val, _ref;
      clone = new Coffeefx(this._selector);
      _ref = this.context();
      for (key in _ref) {
        val = _ref[key];
        clone.context()[key] = val;
      }
      clone.parent = this;
      return clone;
    };
    /*
      ---------------------------------
        Defer the given `fn` until the animation
        is complete. `fn` may be one of the following:
    
         - a function to invoke
         - an instanceof `Move` to call `.end()`
         - nothing, to return a clone of this `Move` instance for chaining
      
        @param {Function|Move} fn
        @return {Move} for chaining
        @api public
      ---------------------------------
      */
    Coffeefx.prototype.then = function(fn) {
      var child;
      if (fn == null) {
        fn = void 0;
      }
      switch (typeof fn) {
        case "function":
          this.callbacks.push(fn);
          break;
        case "object":
          if (fn instanceof Coffeefx) {
            this.callbacks.push(function() {
              return fn.end();
            });
          }
          break;
        case 'undefined':
          child = this._child();
          this.then(child);
          return child;
      }
      return this;
    };
    /*
      ---------------------------------
        end add the context as a css
        class and execute
    
        @return {String}
        @api private
      ---------------------------------
      */
    Coffeefx.prototype.end = function(event) {
      var prop, self, value, _ref;
      if (event == null) {
        event = void 0;
      }
      self = this;
      if (event) {
        this.then(event);
      }
      if (this.context()['-webkit-animation-name'] === void 0) {
        this.el.addEventListener('webkitTransitionEnd', (function() {
          var _results;
          _results = [];
          while (self.callbacks.length > 0) {
            _results.push(self.callbacks.shift().apply(self));
          }
          return _results;
        }), false);
        _ref = this.context();
        for (prop in _ref) {
          value = _ref[prop];
          this.el.style.setProperty(prop, value, '');
        }
      } else {
        this.el.addEventListener('webkitAnimationEnd', (function() {
          var _results;
          _results = [];
          while (self.callbacks.length > 0) {
            _results.push(self.callbacks.shift().apply(self));
          }
          return _results;
        }), false);
        this._addCssClass(this._context, this._prepare());
        this.el.style.webkitAnimationName = '';
        window.setTimeout((function() {
          return self.el.style.webkitAnimationName = self._context;
        }), 0);
        this.el.className = "" + this._context;
      }
      return this;
    };
    /*
      ---------------------------------
        transformStyle
        
        @param {String} n 
            [flat, preserve-3d]
        @return {Coffeefx} for chaining
        @api public
      ---------------------------------
      */
    Coffeefx.prototype.transformStyle = function(style) {
      if (style === 'flat' || style === 'preserve-3d') {
        return this._setBrowser('transform-style', style, false);
      }
    };
    /*
      ---------------------------------
        Perspective
      
        @param {Number} n
        @return {Coffeefx} for chaining
        @api public
      ---------------------------------
      */
    Coffeefx.prototype.perspective = function(n) {
      if (n == null) {
        n = 50;
      }
      return this._setBrowser('perspective', n, false);
    };
    /*
      ---------------------------------
        Perspective
      
        @param {Number} n
        @return {Coffeefx} for chaining
        @api public
      ---------------------------------
      */
    Coffeefx.prototype.origin = function(n) {
      if (n == null) {
        n = 50;
      }
      return this._setBrowser('transform-origin', "" + n + "%", false);
    };
    /*
      ---------------------------------
        Transform
    
        @param {String} transformation
        @return {Coffeefx} for chaining
        @api public
      ---------------------------------
      */
    Coffeefx.prototype.transform = function(transformation) {
      return this._setBrowser('transform', transformation);
    };
    /*
      ---------------------------------
        Skew `x` and `y`.
      
        @param {Number} x
        @param {Number} y   def: 0
        @return {Coffeefx} for chaining
        @api public
      ---------------------------------
      */
    Coffeefx.prototype.skew = function(x, y) {
      if (y == null) {
        y = 0;
      }
      return this.transform("skew(" + x + "deg, " + y + "deg)");
    };
    /*
      ---------------------------------
      #  * Skew x by `n`.
      #  *
      #  * @param {Number} n
      #  * @return {Move} for chaining
      #  * @api public
      ---------------------------------
      */
    Coffeefx.prototype.skewX = function(n) {
      return this.transform("skewX(" + n + "deg)");
    };
    /*
      ---------------------------------
      #  * Skew y by `n`.
      #  *
      #  * @param {Number} n
      #  * @return {Move} for chaining
      #  * @api public
      ---------------------------------
      */
    Coffeefx.prototype.skewY = function(n) {
      return this.transform("skewY(" + n + "deg)");
    };
    /*
      ---------------------------------
      #  * Translate and to `x` and `y` axis.
      #  *
      #  * @param {Number} x
      #  * @param {Number} y
      #  * @return {Move} for chaining
      #  * @api public
      ---------------------------------
      */
    Coffeefx.prototype.translate = function(x, y) {
      if (y == null) {
        y = 0;
      }
      return this.transform("translate(" + x + "px, " + y + "px)");
    };
    /*
      ---------------------------------
      # * Translate on the x axis to `n`.
      # *
      # * @param {Number} n
      # * @return {Move} for chaining
      # * @api public
      ---------------------------------
      */
    Coffeefx.prototype.x = function(n) {
      return this.translateX(n);
    };
    Coffeefx.prototype.translateX = function(n) {
      return this.transform("translateX(" + n + "px)");
    };
    /*
      ---------------------------------
      # * Translate on the y axis to `n`.
      # *
      # * @param {Number} n
      # * @return {Move} for chaining
      # * @api public
      ---------------------------------
      */
    Coffeefx.prototype.y = function(n) {
      return this.translateY(n);
    };
    Coffeefx.prototype.translateY = function(n) {
      this.transform("translateY(" + n + "px)");
      return this;
    };
    /*
      ---------------------------------
      #  * Scale the x and y axis by `x`, or 
      #  * individually scale `x` and `y`.
      #  *
      #  * @param {Number} x
      #  * @param {Number} y
      #  * @return {Move} for chaining
      #  * @api public
      ---------------------------------
      */
    Coffeefx.prototype.scale = function(x, y) {
      return this.transform("scale(" + x + ", " + (y != null ? y : x) + ")");
    };
    /*
      ---------------------------------
      #  * Scale x axis by `n`.
      #  *
      #  * @param {Number} n
      #  * @return {Move} for chaining
      #  * @api public
      ---------------------------------
      */
    Coffeefx.prototype.scaleX = function(n) {
      return this.transform("scaleX(" + n + ")");
    };
    /*
      ---------------------------------
      #  * Scale y axis by `n`.
      #  *
      #  * @param {Number} n
      #  * @return {Move} for chaining
      #  * @api public
      ---------------------------------
      */
    Coffeefx.prototype.scaleY = function(n) {
      return this.transform("scaleY(" + n + ")");
    };
    /*
      ---------------------------------
      #  * Rotate `n` degrees.
      #  *
      #  * @param {Number} n
      #  * @return {Move} for chaining
      #  * @api public
      ---------------------------------
      */
    Coffeefx.prototype.rotate = function(n) {
      return this.transform("rotate(" + n + "deg)");
    };
    /*
      ---------------------------------
        transitionDuration
        If is text is converted in ms (multiply by 1000)
        
        @param {Number|String} n def:500
        @return {Coffeefx} for chaining
        @api public
      ---------------------------------
      */
    Coffeefx.prototype.transitionDuration = function(n) {
      if (n == null) {
        n = 500;
      }
      if (n === -1) {
        return this._deleteBrowserAction("transition-duration");
      } else {
        n = 'string' === typeof n ? parseFloat(n) * 1000 : n;
        return this._setBrowser('transition-duration', "" + n + "ms", false);
      }
    };
    /*
      ---------------------------------
        Increment `prop` by `val`, deferred until `.end()` is invoked
        and adds the property to the list of transition props.
      
        @param {String} prop
        @param {Number} val
        @return {Move} for chaining
        @api public
      ---------------------------------
      */
    Coffeefx.prototype.add = function(prop, val) {
      return this.set(prop, parseInt(this.current(prop), 10) + val + 'px');
    };
    /*
      ---------------------------------
        Decrement `prop` by `val`, deferred until `.end()` is invoked
        and adds the property to the list of transition props.
    
        @param {String} prop
        @param {Number} val
        @return {Move} for chaining
        @api public
      ---------------------------------
      */
    Coffeefx.prototype.sub = function(prop, val) {
      return this.set(prop, parseInt(this.current(prop), 10) - val + 'px');
    };
    /*
      ---------------------------------
        Set transition easing function to to `fn` string.
    
        When:
    
          - null "ease" is used
          - "in" "ease-in" is used
          - "out" "ease-out" is used
          - "in-out" "ease-in-out" is used
    
        @param {String} fn
        @return {Move} for chaining
        @api public
      ---------------------------------
      */
    Coffeefx.prototype.ease = function(fn) {
      return this._setBrowser('transition-timing-function', coffeefx.ease[fn] || fn || 'ease');
    };
    /*
      ---------------------------------
      #  * Delay the animation by `n`.
      #  * If is text is converted in ms (multiply by 1000)
      #  *
      #  * @param {Number|String} n
      #  * @return {Move} for chaining
      #  * @api public
      ---------------------------------
      */
    Coffeefx.prototype.delay = function(n) {
      n = 'string' === typeof n ? parseFloat(n) * 1000 : n;
      return this._setBrowser('transition-delay', "" + n + "ms");
    };
    Coffeefx.prototype._clone = function(prop) {
      var child;
      child = new Coffeefx(this._selector);
      child._context = prop;
      child.parent = this;
      child._baseContext();
      return child;
    };
    Coffeefx.prototype.setAnimationName = function() {
      return this._setBrowser('animation-name', this._context, false);
    };
    /*
      % step has to be always declared as 50% in string form 
      */
    Coffeefx.prototype.valid_step = function(step) {
      return (step === 'from' || step === 'to') || __indexOf.call(step, '%') >= 0;
    };
    Coffeefx.prototype.step = function(step) {
      var child;
      this.setAnimationName();
      return child = this._clone(step);
    };
    Coffeefx.prototype.from = function() {
      return this.step('from');
    };
    Coffeefx.prototype.to = function() {
      return this.step('to');
    };
    Coffeefx.prototype.duration = function(n) {
      if (n == null) {
        n = 500;
      }
      this.transitionDuration(n);
      return this.animationDuration(n);
    };
    Coffeefx.prototype.animationDuration = function(n) {
      if (n == null) {
        n = 500;
      }
      if (n === -1) {
        return this._deleteBrowserAction("animation-duration");
      } else {
        n = 'string' === typeof n ? parseFloat(n) * 1000 : n;
        return this._setBrowser('animation-duration', "" + n + "ms", false);
      }
    };
    Coffeefx.prototype.iteration = function(n) {
      return this._setBrowser('animation-iteration-count', n, false);
    };
    Coffeefx.prototype.timing = function(fn) {
      if (fn == null) {
        fn = "linear";
      }
      return this._setBrowser('animation-timing-function', fn, false);
    };
    Coffeefx.prototype.fillmode = function(fn) {
      return this._setBrowser('animation-fill-mode', fn, false);
    };
    return Coffeefx;
  })();
  window.Coffea = Coffea = (function() {
    var css_values;
    function Coffea(objects) {
      this.objects = objects != null ? objects : [];
    }
    Coffea.prototype.execute = function() {
      var object, _i, _len, _ref, _results;
      _ref = this.objects;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        object = _ref[_i];
        this.cfx = coffeefx(object["id"]);
        if (object["init"] !== void 0) {
          this._init(object["id"], object["init"]);
        }
        if (object["transformation"] !== void 0) {
          this._transformation(object["transformation"]);
        }
        if (object["animation"] !== void 0) {
          this._animation(object["animation"]);
        }
        _results.push(this.cfx.end());
      }
      return _results;
    };
    Coffea.prototype._init = function(object, object_init) {
      var key, value;
      this.cfx._context = object;
      for (key in object_init) {
        value = object_init[key];
        this.cfx.set(key, value);
      }
      this.cfx.duration(-1);
      this.cfx._addCssClass(this.cfx._context, this.cfx._prepare().replace(/^./, ""));
      return this.cfx = coffeefx(object);
    };
    Coffea.prototype._set = function(cfx, key, value) {
      if ((__indexOf.call(css_values, key) >= 0)) {
        return cfx.set(key, value);
      } else {
        return cfx[key](value);
      }
    };
    Coffea.prototype._transformation = function(object_trans) {
      var key, value;
      for (key in object_trans) {
        value = object_trans[key];
        this._set(this.cfx, key, value);
      }
      return this.cfx;
    };
    Coffea.prototype._animation = function(object_animation) {
      var cfx, key, step, step_values, value, _results;
      _results = [];
      for (step in object_animation) {
        step_values = object_animation[step];
        _results.push((function() {
          if (this.cfx.valid_step(step)) {
            cfx = this.cfx[step]();
            for (key in step_values) {
              value = step_values[key];
              this._set(cfx, key, value);
            }
            return this.cfx = cfx.pop();
          } else {
            return this._set(this.cfx, step, step_values);
          }
        }).call(this));
      }
      return _results;
    };
    css_values = ['azimuth', 'background', 'background-attachment', 'background-color', 'background-image', 'background-position', 'background-repeat', 'border', 'border-bottom', 'border-bottom-color', 'border-bottom-style', 'border-bottom-width', 'border-collapse', 'border-color', 'border-left', 'border-left-color', 'border-left-style', 'border-left-width', 'border-right', 'border-right-color', 'border-right-style', 'border-right-width', 'border-spacing', 'border-style', 'border-top', 'border-top-color', 'border-top-style', 'border-top-width', 'border-width', 'bottom', 'caption-side', 'clear', 'clip', 'color', 'content', 'counter-increment', 'counter-reset', 'cue', 'cue-after', 'cue-before', 'cursor', 'direction', 'display', 'elevation', 'empty-cells', 'float', 'font', 'font-family', 'font-size', 'font-style', 'font-variant', 'font-weight', 'height', 'left', 'letter-spacing', 'line-height', 'list-style', 'list-style-image', 'list-style-position', 'list-style-type', 'margin', 'margin-bottom', 'margin-left', 'margin-right', 'margin-top', 'max-height', 'max-width', 'min-height', 'min-width', 'opacity', 'orphans', 'outline', 'outline-color', 'outline-style', 'outline-width', 'overflow', 'padding', 'padding-bottom', 'padding-left', 'padding-right', 'padding-top', 'page-break-after', 'page-break-before', 'page-break-inside', 'pause', 'pause-after', 'pause-before', 'pitch', 'pitch-range', 'play-during', 'position', 'quotes', 'richness', 'right', 'speak', 'speak-header', 'speak-numeral', 'speak-punctuation', 'speech-rate', 'stress', 'table-layout', 'text-align', 'text-decoration', 'text-indent', 'text-transform', 'top', 'unicode-bidi', 'vertical-align', 'visibility', 'voice-family', 'volume', 'white-space', 'widows', 'width', 'word-spacing', 'z-index'];
    return Coffea;
  })();
}).call(this);
