(function() {
  window.addTagToHtmlBody = function(new_tag) {
    return ($(new_tag)).appendTo('body');
  };
  describe("coffefx", function() {
    beforeEach(function() {
      addTagToHtmlBody('<div id="test"></div>');
      return this.moveInstance = new Move('#test');
    });
    it("Should exist Move object", function() {
      return (expect(new Move)).toBeDefined;
    });
    describe("on create", function() {
      it("should set assign the selector to the el property", function() {
        return (expect(this.moveInstance.el)).toEqual('#test');
      });
      return it("should set defaults and return a Move instance", function() {
        (expect(this.moveInstance._rotate)).toEqual(0);
        (expect(this.moveInstance._transitionProps)).toEqual([]);
        (expect(this.moveInstance._transforms)).toEqual([]);
        return (expect(this.moveInstance._props["-webkit-transition-duration"])).toEqual("500ms");
      });
    });
    it("transform function should assign a transform to _transforms", function() {
      this.moveInstance.transform('test');
      return (expect(this.moveInstance._transforms)).toEqual(["test"]);
    });
    describe("all the functions that use transform", function() {
      it("skew have to format x and y in skew(Xdeg, Ydeg) way ", function() {
        this.moveInstance.skew(1, 2);
        return (expect(this.moveInstance._transforms)).toEqual(["skew(1deg, 2deg)"]);
      });
      it("skew if y is null should be 0", function() {
        this.moveInstance.skew(1);
        return (expect(this.moveInstance._transforms)).toEqual(["skew(1deg, 0deg)"]);
      });
      it("skewX have to format x in skewX(Xdeg) way ", function() {
        this.moveInstance.skewX(1);
        return (expect(this.moveInstance._transforms)).toEqual(["skewX(1deg)"]);
      });
      it("skewY have to format x in skewY(Ydeg) way ", function() {
        this.moveInstance.skewY(2);
        return (expect(this.moveInstance._transforms)).toEqual(["skewY(2deg)"]);
      });
      it("translate and to should pass in ['translate(1px, 0px), translate(2px, 1px)']  way", function() {
        this.moveInstance.translate(1, 2);
        (expect(this.moveInstance._transforms)).toEqual(['translate(1px, 2px)']);
        this.moveInstance.to(2, 1);
        return (expect(this.moveInstance._transforms)).toEqual(['translate(1px, 2px)', 'translate(2px, 1px)']);
      });
      it("translate if y is null should be 0 ['translate(1px, 0px), translate(2px, 0px)']  way", function() {
        this.moveInstance.translate(1);
        (expect(this.moveInstance._transforms)).toEqual(['translate(1px, 0px)']);
        this.moveInstance.to(2);
        return (expect(this.moveInstance._transforms)).toEqual(['translate(1px, 0px)', 'translate(2px, 0px)']);
      });
      it("translateX have to format x in translateX(Xpx) way ", function() {
        this.moveInstance.translateX(1);
        return (expect(this.moveInstance._transforms)).toEqual(["translateX(1px)"]);
      });
      it("translateY have to format x in translateY(Ypx) way ", function() {
        this.moveInstance.translateY(2);
        return (expect(this.moveInstance._transforms)).toEqual(["translateY(2px)"]);
      });
      it("scale have to format x and y in scale(X, Y) way ", function() {
        this.moveInstance.scale(1, 2);
        return (expect(this.moveInstance._transforms)).toEqual(["scale(1, 2)"]);
      });
      it("scale if y is not defined should use x ", function() {
        this.moveInstance.scale(1);
        return (expect(this.moveInstance._transforms)).toEqual(["scale(1, 1)"]);
      });
      it("scaleX have to format x in scaleX(X) way ", function() {
        this.moveInstance.scaleX(1);
        return (expect(this.moveInstance._transforms)).toEqual(["scaleX(1)"]);
      });
      it("scaleY have to format x in scaleY(Y) way ", function() {
        this.moveInstance.scaleY(2);
        return (expect(this.moveInstance._transforms)).toEqual(["scaleY(2)"]);
      });
      it("rotate have to format x in rotate(Ndeg) way ", function() {
        this.moveInstance.rotate(2);
        return (expect(this.moveInstance._transforms)).toEqual(["rotate(2deg)"]);
      });
      describe("ease function", function() {
        it("with a ease parameter", function() {
          this.moveInstance.ease('in');
          return (expect(this.moveInstance._props["-moz-transition-timing-function"])).toEqual("ease-in");
        });
        it("with a test parameter", function() {
          this.moveInstance.ease('test');
          return (expect(this.moveInstance._props["-moz-transition-timing-function"])).toEqual("test");
        });
        return it("with no parameter", function() {
          this.moveInstance.ease();
          return (expect(this.moveInstance._props["-moz-transition-timing-function"])).toEqual("ease");
        });
      });
      it("duration", function() {
        this.moveInstance.duration(1);
        (expect(this.moveInstance._props["-moz-transition-duration"])).toEqual("1ms");
        this.moveInstance.duration('1');
        return (expect(this.moveInstance._props["-moz-transition-duration"])).toEqual("1000ms");
      });
      it("delay", function() {
        this.moveInstance.delay(1);
        (expect(this.moveInstance._props["-moz-transition-delay"])).toEqual("1ms");
        this.moveInstance.delay('1');
        return (expect(this.moveInstance._props["-moz-transition-delay"])).toEqual("1000ms");
      });
      it("setProperty should add the object in _props", function() {
        this.moveInstance.setProperty("test", "value");
        (expect(this.moveInstance._props["test"])).toBeDefined;
        return (expect(this.moveInstance._props["test"])).toEqual("value");
      });
      it("setVendorProperty should add the objects in _props", function() {
        this.moveInstance.setVendorProperty("test", "value");
        (expect(this.moveInstance._props['-webkit-test'])).toEqual('value');
        (expect(this.moveInstance._props['-moz-test'])).toEqual('value');
        (expect(this.moveInstance._props['-ms-test'])).toEqual('value');
        return (expect(this.moveInstance._props['-o-test'])).toEqual('value');
      });
      describe("set (add the objects in _props)", function() {
        it("if value is numeric and in maps return string with type", function() {
          this.moveInstance.set("width", 10);
          return (expect(this.moveInstance._props['width'])).toEqual('10px');
        });
        it("if value is numeric and not in maps return integer", function() {
          this.moveInstance.set("widtho", 10);
          return (expect(this.moveInstance._props['widtho'])).toEqual(10);
        });
        it("if value is string and not in maps return string", function() {
          this.moveInstance.set("widtho", '10');
          return (expect(this.moveInstance._props['widtho'])).toEqual('10');
        });
        return it("if value is string and in maps return string", function() {
          this.moveInstance.set("width", '10');
          return (expect(this.moveInstance._props['width'])).toEqual('10');
        });
      });
      it("add push a new function in the callbacks", function() {
        this.moveInstance.add('width', 200);
        this.moveInstance.callbacks.start[0]();
        console.log(this.moveInstance._props['width']);
        return (expect(this.moveInstance._props['width'])).toEqual = "200p";
      });
      it("pending testing current", function() {
        return "PENDING".toEqual("pending");
      });
      return it("transition has to add in _transitionProps", function() {
        this.moveInstance.transition("test");
        return (expect(this.moveInstance._transitionProps)).toEqual = ["test"];
      });
    });
    describe("function move()", function() {
      it("should be defined", function() {
        spyOn(move, 'select');
        (expect(move())).toBeDefined;
        return (expect(move.select)).toHaveBeenCalled();
      });
      it("should return a instance of Move", function() {
        return (expect(move() instanceof Move)).toEqual(true);
      });
      it("should have a version", function() {
        return (expect(move.version)).toBeDefined;
      });
      it("should have defaults", function() {
        (expect(move.defaults)).toBeDefined;
        return (expect(move.defaults['duration'])).toEqual(500);
      });
      it("should have ease functions definitions", function() {
        (expect(move.ease)).toBeDefined;
        (expect(move.ease['in'])).toEqual('ease-in');
        (expect(move.ease['out'])).toEqual('ease-out');
        (expect(move.ease['in-out'])).toEqual('ease-in-out');
        return (expect(move.ease['snap'])).toEqual('cubic-bezier(0,1,.5,1)');
      });
      return describe("select function", function() {
        it("should have a select function", function() {
          return (expect(move.select())).toBeDefined;
        });
        return it("should retrieve a object with the id", function() {
          addTagToHtmlBody('<div id="test"></div>');
          return (expect(move.select('test'))).toBeDefined;
        });
      });
    });
    return describe("if extends EventEmitter", function() {
      it("should have 'on' function", function() {
        this.moveInstance.on("test", function() {
          return "hola";
        });
        return (expect(this.moveInstance.callbacks.test[0]())).toEqual("hola");
      });
      it("should have 'emit' function", function() {
        var callback;
        callback = jasmine.createSpy();
        this.moveInstance.on("test", callback);
        this.moveInstance.emit("test");
        return expect(callback).toHaveBeenCalled;
      });
      return it("should have 'emit' function", function() {
        var callback;
        callback = jasmine.createSpy();
        this.moveInstance.on("test", callback);
        this.moveInstance.emit("testo");
        return expect(callback).not.toHaveBeenCalled;
      });
    });
  });
}).call(this);
