(function() {
  window.addTagToHtmlBody = function(new_tag) {
    return ($(new_tag)).appendTo('body');
  };
  describe("coffeefx", function() {
    beforeEach(function() {
      addTagToHtmlBody('<div id="test" class="ccsclassname"></div>');
      addTagToHtmlBody('<div class="classname_noid"></div>');
      return addTagToHtmlBody('<div id="test"><div class="classname_noid"></div></div>');
    });
    it("should be a coffeefx funtion", function() {
      return (expect(coffeefx)).toBeDefined;
    });
    it("should return a Coffeefx class", function() {
      return (expect(coffeefx("#test") instanceof Coffeefx)).toBeTruthy;
    });
    it("throw a exception if is not a selector", function() {
      return expect(function() {
        return coffeefx();
      }).toThrow(new Error("SelectorEmpty"));
    });
    it("should save the selector", function() {
      return (expect(coffeefx("#test")._selector)).toEqual("#test");
    });
    it("should exist a select function", function() {
      return (expect(typeof coffeefx("#test").select)).toEqual("function");
    });
    it("should find the object in the DOM by id name", function() {
      return (expect(coffeefx("#test").el.id)).toEqual("test");
    });
    it("should find the object in the DOM by classname", function() {
      return (expect(coffeefx(".ccsclassname").el.className)).toEqual("ccsclassname");
    });
    return describe("visual efects", function() {
      beforeEach(function() {
        return this.cfx = coffeefx("#test");
      });
      describe("management", function() {
        it("should be a variable for all the efects", function() {
          return (expect(this.cfx._fx)).toBeDefined;
        });
        it("should generate a context", function() {
          this.cfx.context;
          return (expect(this.cfx._context)).not.toEqual("");
        });
        it("should generate a context name using the id in case select by id", function() {
          this.cfx.context();
          return (expect(this.cfx._context.search(this.cfx.el.id))).toBeGreaterThan(-1);
        });
        it("should generate a context name using the classname in case select by id", function() {
          var cfx;
          cfx = coffeefx(".classname_noid");
          cfx.context();
          return (expect(cfx._context.search(cfx.el.className))).toBeGreaterThan(-1);
        });
        it("should return the same context", function() {
          this.cfx._context = "test_context";
          return (expect(this.cfx.context())).toEqual({});
        });
        it("setBrowser should push object in the context for each browser", function() {
          var brow, _i, _len, _results;
          this.cfx.set("test", 12);
          _results = [];
          for (_i = 0, _len = browsers.length; _i < _len; _i++) {
            brow = browsers[_i];
            _results.push((expect(this.cfx.context()["test"])).toEqual(12));
          }
          return _results;
        });
        it("setBrowser should push object in the context for each browser", function() {
          var brow, _i, _len, _results;
          this.cfx._setBrowser("test", 12);
          _results = [];
          for (_i = 0, _len = browsers.length; _i < _len; _i++) {
            brow = browsers[_i];
            _results.push((expect(this.cfx.context()["" + brow + "test"])).toEqual('12 '));
          }
          return _results;
        });
        it("setBrowser should push object in the context for each browser and sumarize", function() {
          var brow, _i, _len, _results;
          this.cfx._setBrowser("test", 12);
          this.cfx._setBrowser("test", 14);
          _results = [];
          for (_i = 0, _len = browsers.length; _i < _len; _i++) {
            brow = browsers[_i];
            _results.push((expect(this.cfx.context()["" + brow + "test"].trim())).toEqual('12 14'));
          }
          return _results;
        });
        it("setBrowser should push object in the context for each browser should not and sumarize", function() {
          var brow, _i, _len, _results;
          this.cfx._setBrowser("test", 12, false);
          this.cfx._setBrowser("test", 14, false);
          _results = [];
          for (_i = 0, _len = browsers.length; _i < _len; _i++) {
            brow = browsers[_i];
            _results.push((expect(this.cfx.context()["" + brow + "test"])).toEqual(14));
          }
          return _results;
        });
        it("prepare should generate the class from the JSON for the actual context", function() {
          this.cfx.skew(9, 0);
          return (expect(this.cfx._prepare())).toEqual("-webkit-transition-duration:500ms; -moz-transition-duration:500ms; -ms-transition-duration:500ms; -o-transition-duration:500ms; -webkit-transform:skew(9deg, 0deg) ; -moz-transform:skew(9deg, 0deg) ; -ms-transform:skew(9deg, 0deg) ; -o-transform:skew(9deg, 0deg) ;");
        });
        return it("prepare should generate the class from the JSON specifying the context", function() {
          this.cfx.skew(9, 0);
          return (expect(this.cfx._prepare(this.cfx._context))).toEqual("-webkit-transition-duration:500ms; -moz-transition-duration:500ms; -ms-transition-duration:500ms; -o-transition-duration:500ms; -webkit-transform:skew(9deg, 0deg) ; -moz-transform:skew(9deg, 0deg) ; -ms-transform:skew(9deg, 0deg) ; -o-transform:skew(9deg, 0deg) ;");
        });
      });
      return describe("transforms", function() {
        it("should exist all the transform functions", function() {
          (expect(this.cfx.skew)).not.toEqual(void 0);
          (expect(this.cfx.skewX)).not.toEqual(void 0);
          (expect(this.cfx.skewY)).not.toEqual(void 0);
          (expect(this.cfx.translate)).not.toEqual(void 0);
          (expect(this.cfx.translateX)).not.toEqual(void 0);
          (expect(this.cfx.translateY)).not.toEqual(void 0);
          (expect(this.cfx.scale)).not.toEqual(void 0);
          (expect(this.cfx.scaleX)).not.toEqual(void 0);
          (expect(this.cfx.scaleY)).not.toEqual(void 0);
          (expect(this.cfx.rotate)).not.toEqual(void 0);
          (expect(this.cfx.origin)).not.toEqual(void 0);
          (expect(this.cfx.perspective)).not.toEqual(void 0);
          (expect(this.cfx.transformStyle)).not.toEqual(void 0);
          return (expect(this.cfx.ease)).not.toEqual(void 0);
        });
        it("skew should exist in -{brow}-transform with the values 3, 5", function() {
          var brow, _i, _len, _results;
          this.cfx.skew(3, 5);
          _results = [];
          for (_i = 0, _len = browsers.length; _i < _len; _i++) {
            brow = browsers[_i];
            _results.push((expect(this.cfx.context()["" + brow + "transform"].trim())).toEqual('skew(3deg, 5deg)'));
          }
          return _results;
        });
        it("skew should exist in -{brow}-transform with the values 9, 0 using the default value", function() {
          var brow, _i, _len, _results;
          this.cfx.skew(9, 0);
          _results = [];
          for (_i = 0, _len = browsers.length; _i < _len; _i++) {
            brow = browsers[_i];
            _results.push((expect(this.cfx.context()["" + brow + "transform"].trim())).toEqual('skew(9deg, 0deg)'));
          }
          return _results;
        });
        it("skewX have to format x in skewX(Xdeg) way ", function() {
          var brow, _i, _len, _results;
          this.cfx.skewX(1);
          _results = [];
          for (_i = 0, _len = browsers.length; _i < _len; _i++) {
            brow = browsers[_i];
            _results.push((expect(this.cfx.context()["" + brow + "transform"].trim())).toEqual('skewX(1deg)'));
          }
          return _results;
        });
        it("skewY have to format x in skewY(Ydeg) way ", function() {
          var brow, _i, _len, _results;
          this.cfx.skewY(2);
          _results = [];
          for (_i = 0, _len = browsers.length; _i < _len; _i++) {
            brow = browsers[_i];
            _results.push((expect(this.cfx.context()["" + brow + "transform"].trim())).toEqual('skewY(2deg)'));
          }
          return _results;
        });
        it("translate and to should pass in ['translate(1px, 0px), translate(2px, 1px)']  way", function() {
          var brow, _i, _len, _results;
          this.cfx.translate(1, 2);
          _results = [];
          for (_i = 0, _len = browsers.length; _i < _len; _i++) {
            brow = browsers[_i];
            _results.push((expect(this.cfx.context()["" + brow + "transform"].trim())).toEqual('translate(1px, 2px)'));
          }
          return _results;
        });
        it("translate if y is null should be 0 ['translate(1px, 0px), translate(2px, 0px)']  way", function() {
          var brow, _i, _len, _results;
          this.cfx.translate(1);
          _results = [];
          for (_i = 0, _len = browsers.length; _i < _len; _i++) {
            brow = browsers[_i];
            _results.push((expect(this.cfx.context()["" + brow + "transform"].trim())).toEqual('translate(1px, 0px)'));
          }
          return _results;
        });
        it("translateX have to format x in translateX(Xpx) way ", function() {
          var brow, _i, _len, _results;
          this.cfx.translateX(1);
          _results = [];
          for (_i = 0, _len = browsers.length; _i < _len; _i++) {
            brow = browsers[_i];
            _results.push((expect(this.cfx.context()["" + brow + "transform"].trim())).toEqual('translateX(1px)'));
          }
          return _results;
        });
        it("translateY have to format x in translateY(Ypx) way ", function() {
          var brow, _i, _len, _results;
          this.cfx.translateY(2);
          _results = [];
          for (_i = 0, _len = browsers.length; _i < _len; _i++) {
            brow = browsers[_i];
            _results.push((expect(this.cfx.context()["" + brow + "transform"].trim())).toEqual('translateY(2px)'));
          }
          return _results;
        });
        it("scale have to format x and y in scale(X, Y) way ", function() {
          var brow, _i, _len, _results;
          this.cfx.scale(1, 2);
          _results = [];
          for (_i = 0, _len = browsers.length; _i < _len; _i++) {
            brow = browsers[_i];
            _results.push((expect(this.cfx.context()["" + brow + "transform"].trim())).toEqual('scale(1, 2)'));
          }
          return _results;
        });
        it("scale if y is not defined should use x ", function() {
          var brow, _i, _len, _results;
          this.cfx.scale(1);
          _results = [];
          for (_i = 0, _len = browsers.length; _i < _len; _i++) {
            brow = browsers[_i];
            _results.push((expect(this.cfx.context()["" + brow + "transform"].trim())).toEqual('scale(1, 1)'));
          }
          return _results;
        });
        it("scaleX have to format x in scaleX(X) way ", function() {
          var brow, _i, _len, _results;
          this.cfx.scaleX(1);
          _results = [];
          for (_i = 0, _len = browsers.length; _i < _len; _i++) {
            brow = browsers[_i];
            _results.push((expect(this.cfx.context()["" + brow + "transform"].trim())).toEqual('scaleX(1)'));
          }
          return _results;
        });
        it("scaleY have to format x in scaleY(Y) way ", function() {
          var brow, _i, _len, _results;
          this.cfx.scaleY(2);
          _results = [];
          for (_i = 0, _len = browsers.length; _i < _len; _i++) {
            brow = browsers[_i];
            _results.push((expect(this.cfx.context()["" + brow + "transform"].trim())).toEqual('scaleY(2)'));
          }
          return _results;
        });
        it("rotate have to format x in rotate(Ndeg) way ", function() {
          var brow, _i, _len, _results;
          this.cfx.rotate(2);
          _results = [];
          for (_i = 0, _len = browsers.length; _i < _len; _i++) {
            brow = browsers[_i];
            _results.push((expect(this.cfx.context()["" + brow + "transform"].trim())).toEqual('rotate(2deg)'));
          }
          return _results;
        });
        it("origin should exist as -{brow}-transform-origin with the default 50%", function() {
          var brow, _i, _len, _results;
          this.cfx.origin();
          _results = [];
          for (_i = 0, _len = browsers.length; _i < _len; _i++) {
            brow = browsers[_i];
            _results.push((expect(this.cfx.context()["" + brow + "transform-origin"].trim())).toEqual('50%'));
          }
          return _results;
        });
        it("origin should exist as -{brow}-transform-origin with the pass(int) value 70%", function() {
          var brow, _i, _len, _results;
          this.cfx.origin(70);
          _results = [];
          for (_i = 0, _len = browsers.length; _i < _len; _i++) {
            brow = browsers[_i];
            _results.push((expect(this.cfx.context()["" + brow + "transform-origin"].trim())).toEqual('70%'));
          }
          return _results;
        });
        it("origin should exist as -{brow}-transform-origin with the pass(string) value 70%", function() {
          var brow, _i, _len, _results;
          this.cfx.origin('60');
          _results = [];
          for (_i = 0, _len = browsers.length; _i < _len; _i++) {
            brow = browsers[_i];
            _results.push((expect(this.cfx.context()["" + brow + "transform-origin"].trim())).toEqual('60%'));
          }
          return _results;
        });
        it("origin should exist as -{brow}-perspective with the pass value", function() {
          var brow, _i, _len, _results;
          this.cfx.perspective(500);
          _results = [];
          for (_i = 0, _len = browsers.length; _i < _len; _i++) {
            brow = browsers[_i];
            _results.push((expect(this.cfx.context()["" + brow + "perspective"])).toEqual(500));
          }
          return _results;
        });
        it("origin should exist as -{brow}-perspective with the pass valid pass value (flat)", function() {
          var brow, _i, _len, _results;
          this.cfx.transformStyle('flat');
          _results = [];
          for (_i = 0, _len = browsers.length; _i < _len; _i++) {
            brow = browsers[_i];
            _results.push((expect(this.cfx.context()["" + brow + "transform-style"].trim())).toEqual('flat'));
          }
          return _results;
        });
        it("origin should exist as -{brow}-perspective with the pass valid pass value (preserve-3d)", function() {
          var brow, _i, _len, _results;
          this.cfx.transformStyle('preserve-3d');
          _results = [];
          for (_i = 0, _len = browsers.length; _i < _len; _i++) {
            brow = browsers[_i];
            _results.push((expect(this.cfx.context()["" + brow + "transform-style"])).toEqual('preserve-3d'));
          }
          return _results;
        });
        return it("origin should not exist as -{brow}-perspective with the non valid value (flato)", function() {
          var brow, _i, _len, _results;
          this.cfx.transformStyle('flat0');
          _results = [];
          for (_i = 0, _len = browsers.length; _i < _len; _i++) {
            brow = browsers[_i];
            _results.push((expect(this.cfx.context()["" + brow + "transform-style"])).not.toBeDefined);
          }
          return _results;
        });
      });
    });
  });
}).call(this);
