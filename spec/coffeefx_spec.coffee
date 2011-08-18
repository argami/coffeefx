window.addTagToHtmlBody = (new_tag) ->
  ($ new_tag).appendTo('body')

describe "coffefx", ->
  beforeEach ->
    addTagToHtmlBody('<div id="test"></div>')
    @moveInstance = new Move('#test')

  it "Should exist Move object", ->
    (expect new Move).toBeDefined
  
  describe "on create", ->
    it "should set assign the selector to the el property", ->
      (expect @moveInstance.el).toEqual '#test'
      
    it "should set defaults and return a Move instance", ->
      (expect @moveInstance._rotate).toEqual 0
      (expect @moveInstance._transitionProps).toEqual []
      (expect @moveInstance._transforms).toEqual []
      (expect @moveInstance._props["-webkit-transition-duration"]).toEqual "500ms"

  it "transform function should assign a transform to _transforms", ->
    @moveInstance.transform('test')
    (expect @moveInstance._transforms).toEqual ["test"]

  describe "all the functions that use transform", ->
    it "skew have to format x and y in skew(Xdeg, Ydeg) way ", ->
      @moveInstance.skew(1,2)
      (expect @moveInstance._transforms).toEqual ["skew(1deg, 2deg)"]

    it "skew if y is null should be 0", ->
      @moveInstance.skew(1)
      (expect @moveInstance._transforms).toEqual ["skew(1deg, 0deg)"]

    it "skewX have to format x in skewX(Xdeg) way ", ->
      @moveInstance.skewX(1)
      (expect @moveInstance._transforms).toEqual ["skewX(1deg)"]

    it "skewY have to format x in skewY(Ydeg) way ", ->
      @moveInstance.skewY(2)
      (expect @moveInstance._transforms).toEqual ["skewY(2deg)"]

    it "translate and to should pass in ['translate(1px, 0px), translate(2px, 1px)']  way", ->
      @moveInstance.translate(1, 2)
      (expect @moveInstance._transforms).toEqual ['translate(1px, 2px)']
      @moveInstance.to(2, 1)
      (expect @moveInstance._transforms).toEqual ['translate(1px, 2px)', 'translate(2px, 1px)']

    it "translate if y is null should be 0 ['translate(1px, 0px), translate(2px, 0px)']  way", ->
      @moveInstance.translate(1)
      (expect @moveInstance._transforms).toEqual ['translate(1px, 0px)']
      @moveInstance.to(2)
      (expect @moveInstance._transforms).toEqual ['translate(1px, 0px)', 'translate(2px, 0px)']

    it "translateX have to format x in translateX(Xpx) way ", ->
      @moveInstance.translateX(1)
      (expect @moveInstance._transforms).toEqual ["translateX(1px)"]

    it "translateY have to format x in translateY(Ypx) way ", ->
      @moveInstance.translateY(2)
      (expect @moveInstance._transforms).toEqual ["translateY(2px)"]

    it "scale have to format x and y in scale(X, Y) way ", ->
      @moveInstance.scale(1,2)
      (expect @moveInstance._transforms).toEqual ["scale(1, 2)"]

    it "scale if y is not defined should use x ", ->
      @moveInstance.scale(1)
      (expect @moveInstance._transforms).toEqual ["scale(1, 1)"]


    it "scaleX have to format x in scaleX(X) way ", ->
      @moveInstance.scaleX(1)
      (expect @moveInstance._transforms).toEqual ["scaleX(1)"]

    it "scaleY have to format x in scaleY(Y) way ", ->
      @moveInstance.scaleY(2)
      (expect @moveInstance._transforms).toEqual ["scaleY(2)"]
      
    it "rotate have to format x in rotate(Ndeg) way ", ->
      @moveInstance.rotate(2)
      (expect @moveInstance._transforms).toEqual ["rotate(2deg)"]

    describe "ease function", ->
      it "with a ease parameter", ->
        @moveInstance.ease('in')
        (expect @moveInstance._props["-moz-transition-timing-function"]).toEqual "ease-in"

      it "with a test parameter", ->
        @moveInstance.ease('test')
        (expect @moveInstance._props["-moz-transition-timing-function"]).toEqual "test"

      it "with no parameter", ->
        @moveInstance.ease()
        (expect @moveInstance._props["-moz-transition-timing-function"]).toEqual "ease"

    it "duration", ->
      @moveInstance.duration(1)
      (expect @moveInstance._props["-moz-transition-duration"]).toEqual "1ms"
      @moveInstance.duration('1')
      (expect @moveInstance._props["-moz-transition-duration"]).toEqual "1000ms"

    it "delay", ->
      @moveInstance.delay(1)
      (expect @moveInstance._props["-moz-transition-delay"]).toEqual "1ms"
      @moveInstance.delay('1')
      (expect @moveInstance._props["-moz-transition-delay"]).toEqual "1000ms"

    it "setProperty should add the object in _props", ->
      @moveInstance.setProperty("test", "value")
      (expect @moveInstance._props["test"]).toBeDefined
      (expect @moveInstance._props["test"]).toEqual "value"

    it "setVendorProperty should add the objects in _props", ->
      @moveInstance.setVendorProperty("test", "value")
      (expect @moveInstance._props['-webkit-test']).toEqual 'value'
      (expect @moveInstance._props['-moz-test']).toEqual 'value'
      (expect @moveInstance._props['-ms-test']).toEqual 'value'
      (expect @moveInstance._props['-o-test']).toEqual 'value'
    
    describe "set (add the objects in _props)", ->
      it "if value is numeric and in maps return string with type", ->
        @moveInstance.set("width", 10)
        (expect @moveInstance._props['width']).toEqual '10px'

      it "if value is numeric and not in maps return integer", ->
        @moveInstance.set("widtho", 10)
        (expect @moveInstance._props['widtho']).toEqual 10

      it "if value is string and not in maps return string", ->
        @moveInstance.set("widtho", '10')
        (expect @moveInstance._props['widtho']).toEqual '10'

      it "if value is string and in maps return string", ->
        @moveInstance.set("width", '10')
        (expect @moveInstance._props['width']).toEqual '10'

    it "add push a new function in the callbacks", ->
      @moveInstance.add('width', 200)
      console.log  @moveInstance._props['width']
      @moveInstance.callbacks.start[0]()
      # 
      # (expect @moveInstance._props['width']).toEqual = "200p"

    # it "sub push a new function in the callbacks", ->
    #   @moveInstance.sub("width", "100")
    #   console.log @moveInstance.callbacks.start[0]
    #   (expect @moveInstance.callbacks.start[0]()).toEqual = "100"
    
    it "pending testing current", ->
      "PENDING".toEqual "pending"

    it "transition has to add in _transitionProps", ->
      @moveInstance.transition("test")
      (expect @moveInstance._transitionProps).toEqual = ["test"]
 
  describe "function move()", ->
    it "should be defined", ->
      spyOn(move, 'select');
      
      (expect move()).toBeDefined
      (expect move.select).toHaveBeenCalled();

    it "should return a instance of Move", ->
      (expect move() instanceof Move).toEqual true

    it "should have a version", ->
      (expect move.version).toBeDefined

    it "should have defaults", ->
      (expect move.defaults).toBeDefined
      (expect move.defaults['duration']).toEqual 500

    it "should have ease functions definitions", ->
      (expect move.ease).toBeDefined
      (expect move.ease['in']).toEqual 'ease-in'
      (expect move.ease['out']).toEqual 'ease-out'
      (expect move.ease['in-out']).toEqual 'ease-in-out'
      (expect move.ease['snap']).toEqual 'cubic-bezier(0,1,.5,1)'
      
    describe "select function", ->
      it "should have a select function", ->
        (expect move.select()).toBeDefined

      it "should retrieve a object with the id", ->
        addTagToHtmlBody('<div id="test"></div>')
        (expect move.select('test')).toBeDefined

  describe "if extends EventEmitter", ->
    
    it "should have 'on' function", ->
      @moveInstance.on("test", -> "hola")
      (expect @moveInstance.callbacks.test[0]()).toEqual "hola"

    it "should have 'emit' function", ->
      callback = jasmine.createSpy();
      @moveInstance.on("test", callback)
      @moveInstance.emit("test")
      expect(callback).toHaveBeenCalled

    it "should have 'emit' function", ->
      callback = jasmine.createSpy();
      @moveInstance.on("test", callback)
      @moveInstance.emit("testo")
      expect(callback).not.toHaveBeenCalled
      