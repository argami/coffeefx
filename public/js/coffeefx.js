(function() {
  var Coffeefx, current, map;
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
  window.Coffeefx = Coffeefx = (function() {
    function Coffeefx(selector) {
      if (selector == null) {
        selector = "";
      }
      if (selector === "") {
        throw new Error("SelectorEmpty");
      }
      this.el = this.select(selector);
      this._fx = {};
      this._context = void 0;
      if (this.el !== void 0) {
        this.transitionDuration();
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
        context = null;
      }
      if (context !== null) {
        if (this._baseContext[context] === void 0) {
          this._baseContext[context] = {};
        }
        return this._baseContext[context];
      }
      return this._baseContext();
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
    Coffeefx.prototype._prepare = function(context) {
      var text;
      if (context == null) {
        context = null;
      }
      context = context != null ? context : this._context;
      text = JSON.stringify(this._fx[this._context]);
      text = text.replace(/","/gi, "; ").replace(/"/gi, "").replace(/"}"/gi, "; }").replace(/}/gi, "; }");
      return text = "." + this._context + " " + text;
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
      cssAnimation.id = className;
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
        end add the context as a css
        class and execute
    
        @return {String}
        @api private
      ---------------------------------
      */
    Coffeefx.prototype.end = function(context) {
      var self;
      if (context == null) {
        context = null;
      }
      self = this;
      this._addCssClass(this._context, this._prepare(context));
      return this.el.className += " " + this._context;
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
      return this.translateY(y);
    };
    Coffeefx.prototype.translateY = function(n) {
      return this.transform("translateY(" + n + "px)");
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
      n = 'string' === typeof n ? parseFloat(n) * 1000 : n;
      return this._setBrowser('transition-duration', "" + n + "ms", false);
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
    return Coffeefx;
  })();
}).call(this);
