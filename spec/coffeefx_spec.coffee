window.addTagToHtmlBody = (new_tag) ->
  ($ new_tag).appendTo('body')

describe "coffeefx", ->
  beforeEach ->
    addTagToHtmlBody('<div id="test" class="ccsclassname"></div>')
    addTagToHtmlBody('<div class="classname_noid"></div>')
    addTagToHtmlBody('<div id="test"><div class="classname_noid"></div></div>')
      
  
  it "should be a coffeefx funtion", ->
    (expect coffeefx).toBeDefined
  
  it "should return a Coffeefx class", ->
    (expect coffeefx("#test") instanceof Coffeefx).toBeTruthy

  it "throw a exception if is not a selector", ->
    expect(-> coffeefx()).toThrow new Error("SelectorEmpty")
    
  it "should exist a select function", ->
   (expect typeof coffeefx("#test").select).toEqual "function"

  it "should find the object in the DOM by id name", ->
    (expect coffeefx("#test").el.id).toEqual "test" 
  
  it "should find the object in the DOM by classname", ->
    (expect coffeefx(".ccsclassname").el.className).toEqual "ccsclassname" 
    
  
  describe "visual efects", ->
    beforeEach ->
      @cfx = coffeefx("#test")
      
    describe "management", ->
      it "should be a variable for all the efects", ->
        (expect @cfx._fx).toBeDefined
      
      it "should generate a context", ->
        @cfx.context
        (expect @cfx._context).not.toEqual ""

      it "should generate a context name using the id in case select by id", ->
        @cfx.context()
        (expect @cfx._context.search(@cfx.el.id)).toBeGreaterThan -1

      it "should generate a context name using the classname in case select by id", ->
        cfx = coffeefx(".classname_noid")
        cfx.context()
        (expect cfx._context.search(cfx.el.className)).toBeGreaterThan -1

      it "should generate a context name using the classname in case select by id an eliminating 
          the spaces in case to be more than one classname", ->
        cfx = coffeefx(".classname_noid")
        cfx.context()
        (expect cfx._context).toBeDefined


      it "should return the same context", ->
        @cfx._context = "test_context"
        (expect @cfx.context()).toEqual {}

      it "setBrowser should push object in the context for each browser", ->
        @cfx.set("test", 12)
        (expect @cfx.context()["test"]).toEqual 12 for brow in browsers

      it "setBrowser should push object in the context for each browser", ->
        @cfx._setBrowser("test", 12)
        (expect @cfx.context()["#{brow}test"]).toEqual '12 ' for brow in browsers

      it "setBrowser should push object in the context for each browser and sumarize", ->
        @cfx._setBrowser("test", 12)
        @cfx._setBrowser("test", 14)
        (expect @cfx.context()["#{brow}test"].trim()).toEqual '12 14' for brow in browsers

      it "setBrowser should push object in the context for each browser should not and sumarize", ->
        @cfx._setBrowser("test", 12, false)
        @cfx._setBrowser("test", 14, false)
        (expect @cfx.context()["#{brow}test"]).toEqual 14 for brow in browsers


      it "prepare should generate the class from the JSON for the actual context", ->
        @cfx.skew(9,0)
        (expect @cfx._prepare()).toEqual ".#{@cfx._context} {-webkit-transition-duration:500ms; -moz-transition-duration:500ms; -ms-transition-duration:500ms; -o-transition-duration:500ms; -webkit-transform:skew(9deg, 0deg) ; -moz-transform:skew(9deg, 0deg) ; -ms-transform:skew(9deg, 0deg) ; -o-transform:skew(9deg, 0deg) ; }"

      it "prepare should generate the class from the JSON specifying the context", ->
        @cfx.skew(9,0)
        (expect @cfx._prepare(@cfx._context)).toEqual ".#{@cfx._context} {-webkit-transition-duration:500ms; -moz-transition-duration:500ms; -ms-transition-duration:500ms; -o-transition-duration:500ms; -webkit-transform:skew(9deg, 0deg) ; -moz-transform:skew(9deg, 0deg) ; -ms-transform:skew(9deg, 0deg) ; -o-transform:skew(9deg, 0deg) ; }"


    describe "transforms", ->
      it "should exist all the transform functions", ->
        (expect @cfx.skew).not.toEqual undefined
        (expect @cfx.skewX).not.toEqual undefined
        (expect @cfx.skewY).not.toEqual undefined
        (expect @cfx.translate).not.toEqual undefined
        (expect @cfx.translateX).not.toEqual undefined
        (expect @cfx.translateY).not.toEqual undefined
        (expect @cfx.scale).not.toEqual undefined
        (expect @cfx.scaleX).not.toEqual undefined
        (expect @cfx.scaleY).not.toEqual undefined
        (expect @cfx.rotate).not.toEqual undefined
        (expect @cfx.origin).not.toEqual undefined
        (expect @cfx.perspective).not.toEqual undefined
        (expect @cfx.transformStyle).not.toEqual undefined

      it "skew should exist in -{brow}-transform with the values 3, 5", ->
        @cfx.skew(3, 5)
        (expect @cfx.context()["#{brow}transform"].trim()).toEqual 'skew(3deg, 5deg)' for brow in browsers

      it "skew should exist in -{brow}-transform with the values 9, 0 using the default value", ->
        @cfx.skew(9, 0)
        (expect @cfx.context()["#{brow}transform"].trim()).toEqual 'skew(9deg, 0deg)' for brow in browsers

      it "skewX have to format x in skewX(Xdeg) way ", ->
        @cfx.skewX(1)
        (expect @cfx.context()["#{brow}transform"].trim()).toEqual 'skewX(1deg)' for brow in browsers

      it "skewY have to format x in skewY(Ydeg) way ", ->
        @cfx.skewY(2)
        (expect @cfx.context()["#{brow}transform"].trim()).toEqual 'skewY(2deg)' for brow in browsers
      
      it "translate and to should pass in ['translate(1px, 0px), translate(2px, 1px)']  way", ->
        @cfx.translate(1, 2)
        (expect @cfx.context()["#{brow}transform"].trim()).toEqual 'translate(1px, 2px)' for brow in browsers
      
      it "translate if y is null should be 0 ['translate(1px, 0px), translate(2px, 0px)']  way", ->
        @cfx.translate(1)
        (expect @cfx.context()["#{brow}transform"].trim()).toEqual 'translate(1px, 0px)' for brow in browsers
      
      it "translateX have to format x in translateX(Xpx) way ", ->
        @cfx.translateX(1)
        (expect @cfx.context()["#{brow}transform"].trim()).toEqual 'translateX(1px)' for brow in browsers
      
      it "translateY have to format x in translateY(Ypx) way ", ->
        @cfx.translateY(2)
        (expect @cfx.context()["#{brow}transform"].trim()).toEqual 'translateY(2px)' for brow in browsers
      
      it "scale have to format x and y in scale(X, Y) way ", ->
        @cfx.scale(1,2)
        (expect @cfx.context()["#{brow}transform"].trim()).toEqual 'scale(1, 2)' for brow in browsers
      
      it "scale if y is not defined should use x ", ->
        @cfx.scale(1)
        (expect @cfx.context()["#{brow}transform"].trim()).toEqual 'scale(1, 1)' for brow in browsers
      
      it "scaleX have to format x in scaleX(X) way ", ->
        @cfx.scaleX(1)
        (expect @cfx.context()["#{brow}transform"].trim()).toEqual 'scaleX(1)' for brow in browsers
      
      it "scaleY have to format x in scaleY(Y) way ", ->
        @cfx.scaleY(2)
        (expect @cfx.context()["#{brow}transform"].trim()).toEqual 'scaleY(2)' for brow in browsers
      
      it "rotate have to format x in rotate(Ndeg) way ", ->
        @cfx.rotate(2)
        (expect @cfx.context()["#{brow}transform"].trim()).toEqual 'rotate(2deg)' for brow in browsers

      it "origin should exist as -{brow}-transform-origin with the default 50%", ->
        @cfx.origin()
        (expect @cfx.context()["#{brow}transform-origin"].trim()).toEqual '50%' for brow in browsers

      it "origin should exist as -{brow}-transform-origin with the pass(int) value 70%", ->
        @cfx.origin(70)
        (expect @cfx.context()["#{brow}transform-origin"].trim()).toEqual '70%' for brow in browsers

      it "origin should exist as -{brow}-transform-origin with the pass(string) value 70%", ->
        @cfx.origin('60')
        (expect @cfx.context()["#{brow}transform-origin"].trim()).toEqual '60%' for brow in browsers

      it "origin should exist as -{brow}-perspective with the pass value", ->
        @cfx.perspective(500)
        (expect @cfx.context()["#{brow}perspective"]).toEqual 500 for brow in browsers

      it "origin should exist as -{brow}-perspective with the pass valid pass value (flat)", ->
        @cfx.transformStyle('flat')
        (expect @cfx.context()["#{brow}transform-style"].trim()).toEqual 'flat' for brow in browsers
      
      it "origin should exist as -{brow}-perspective with the pass valid pass value (preserve-3d)", ->
        @cfx.transformStyle('preserve-3d')
        (expect @cfx.context()["#{brow}transform-style"]).toEqual 'preserve-3d' for brow in browsers

      it "origin should not exist as -{brow}-perspective with the non valid value (flato)", ->
        @cfx.transformStyle('flat0')
        (expect @cfx.context()["#{brow}transform-style"]).not.toBeDefined for brow in browsers
