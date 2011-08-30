##################################################################################
# CoffeeFX
# CSS3 Efects (animations, transitions, transformations) library
#
# Gamaliel A. Toro H.
# argami@gmail.com
# @argami_toro
#
# This library its think to be a fluid and easy way to set animations, 
# transformations and transitions to html elements using CSS3 which give us the 
# option for hardware aceleration means faster animations, painles for cpu,
#
# fluid api example (no finally decided)
#
#        move()
#        	.rotate()
#         .skew()
#        	.animation("name", callback).delay()
#        		.transform().rotate().skew()
#           .from().pop()
#        		.step()
#        			.transform().rotate().skew()
#        			.transition()...
#        		.animationEnd(callback)
#        	.end()
#
#
# 
# context_base {
#   class {
#     
#   }
#   animation {
#     
#   }
# }
#
# class {}
# from {}
# to {}
# step {}
##################################################################################


window.browsers = ['-webkit-', '-moz-', '-ms-', '-o-']

#----------------------------------------#
# Initialize a `coffeefx` instance 
# with the given `selector`.
#
# @param {String} selector
# @return {Coffeefx class instance}
# @api public
#----------------------------------------#

window.coffeefx = (selector) ->
  new Coffeefx(selector)
  
  
#----------------------------------------#
#  Computed style.
#----------------------------------------#

current = getComputedStyle || currentStyle


#----------------------------------------#
# Map of prop -> type for numeric values.
#----------------------------------------#

map = {
   'top': 'px'
   'bottom': 'px'
   'left': 'px'
   'right': 'px'
   'width': 'px'
   'height': 'px'
   'font-size': 'px'
   'margin': 'px'
   'margin-top': 'px'
   'margin-bottom': 'px'
   'margin-left': 'px'
   'margin-right': 'px'
   'padding': 'px'
   'padding-top': 'px'
   'padding-bottom': 'px'
   'padding-left': 'px'
   'padding-right': 'px'
 }
 
 #----------------------------------------#
 # Easing functions.
 #----------------------------------------#

 window.coffeefx.ease = {
   'in': 'ease-in'
   'out': 'ease-out'
   'in-out': 'ease-in-out'
   'snap': 'cubic-bezier(0,1,.5,1)'
 }
 

#----------------------------------------#
# Coffeefx class, its the manager class 
# for the animations, transformations,
# transitions
#
# @param {String} selector
# @return {Coffeefx class instance}
# @api public
#----------------------------------------#

window.Coffeefx = class Coffeefx
  constructor: (selector="") ->
    throw new Error("SelectorEmpty") if selector == ""
    @_selector = selector
    @el = @select(selector)
    @_fx = {} #this variable save all the information of the whole effects
    @_context = undefined
    @_baseContext()
    @callbacks = []
    if @el != undefined
      @duration() #add the transitionDuration as default
    
  select: (selector) ->
    document.getElementById(selector) || document.querySelectorAll(selector)[0]
    
    
  ###
  ---------------------------------
    base context

    Return the actual context 
    and create a new one if not any
    defined context
    
    @return {contextname} 
    @api private
  ---------------------------------
  ###
  _baseContext: ->
    randomName = Math.floor(Math.random()*1000001)
    if @_context == undefined
      @_context = "#{@el.id}_#{randomName}"
    @_fx[@_context] = {} if @_fx[@_context] == undefined
    @_fx[@_context]

  ###
  ---------------------------------
    context

    Return the actual context (base) 
    or a subcontext required

    @param {String}
    @return {contextname} 
    @api private
  ---------------------------------
  ###
  context: (context = "class") -> 
    @_baseContext()[context] = {} if @_baseContext()[context] == undefined
    @_baseContext()[context]

  ###
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
  ###

  set: (key, value) -> 
    value += map[key] if ('number' == typeof value and map[key])
    @context()[key] = value
    @

  ###
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
  ###
  _deleteBrowserAction: (action) ->
      delete @context()[brow+action] if @context()[brow+action] != undefined for brow in browsers

  _setBrowser: (action, value, sum=true) ->
    for brow in browsers
      val = if @context()[brow+action] == undefined then "" else @context()[brow+action]
      if sum
        val += "#{value} "
      else
        val = value
      @set(brow+action, val)
    @

  ###
  ---------------------------------
    Prepare generates the css class
    from the context JSON

    @return {String}
    @api private
  ---------------------------------
  ###

  _prepare: () -> 
    text = ""
    keyframe = ""
    for key, value of @_baseContext()
      val = JSON.stringify(value).replace(/"/gi, "").replace(/"}"/gi, ";").replace("{","").replace("}",";").replace(/,/g,"; ")
      if key == "class"
        text += ".#{@_context} { #{val} }"
      else
        keyframe += "#{key} { #{val} }"

    if keyframe!=""
      text += " @#{key}keyframes #{@_context}  { #{keyframe} } " for key in browsers 
      
    text
    

    # text = JSON.stringify(@context())
    # text = text.replace(/","/gi, "; ").replace(/"/gi, "").replace(/"}"/gi, ";").replace("{","").replace("}",";")


  ###
  ---------------------------------
    Add the class to the html
    head element

    @param {String} class
    @param {String} className
    @api private
  ---------------------------------
  ###
  
  _addCssClass: (className, class_text) ->
    cssAnimation = document.createElement('style')
    cssAnimation.id = "#{className}_style"
    cssAnimation.type = 'text/css'
    cssAnimation.appendChild( document.createTextNode( class_text ) )
    document.getElementsByTagName("head")[0].appendChild(cssAnimation)
    
  ###
  ---------------------------------
    Get computed or "current" value of `prop`.
   
    @param {String} prop
    @return {String}
    @api public
  ---------------------------------
  ###

  current: (prop) -> current(@el).getPropertyValue(prop)
  

  ###
  ---------------------------------
    In case of being a chlid return
    the parent if not return it self

    @param {Number|String} n
    @return {Move} for chaining
    @api public
  ---------------------------------
  ###

  pop: () -> 
    @parent._baseContext()[@_context] = @context() if @parent? and @_context in ['from', 'to']
    @parent || @    
        
    #original statement just for using then
    # @parent || @

  ###
  ---------------------------------
    _child generate a clean copy of 
    self with self as parent

    @return {CoffeeFx} 
    @api public
  ---------------------------------
  ###

  _child: () -> 
    clone = new Coffeefx(@_selector)
    # if we dont assign this property we will lost all the 
    # previous behaviour (then generates a clean instance.)
    clone.context()[key]  = val for key, val of @context()
    clone.parent = @
    return clone


  ###
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
  ###

  then: (fn=undefined) ->
    switch  typeof(fn)
      when "function" then @callbacks.push(fn)
      when "object"  then @callbacks.push(-> fn.end()) if fn instanceof Coffeefx
      when 'undefined'
        child = @_child()
        @then(child)
        return child
    @

  ###
  ---------------------------------
    end add the context as a css
    class and execute

    @return {String}
    @api private
  ---------------------------------
  ###

  end: (event=undefined) ->
    self = @
    @then(event) if event

    #transformation
    if @context()['-webkit-animation-name'] == undefined
      @el.addEventListener( 'webkitTransitionEnd', (->  self.callbacks.shift().apply(self) while self.callbacks.length > 0), false)
      @el.style.setProperty(prop, value, '') for prop, value of @context()
        
    else
      @el.addEventListener( 'webkitAnimationEnd', (->  self.callbacks.shift().apply(self) while self.callbacks.length > 0), false)
      @_addCssClass(@_context, @_prepare())
      @el.style.webkitAnimationName = ''; 
      window.setTimeout( (-> self.el.style.webkitAnimationName = self._context), 0);
      @el.className = "#{@_context}"
    @
  
  
  ##################################################################
  # Transforms
  ##################################################################


  ###
  ---------------------------------
    transformStyle
    
    @param {String} n 
        [flat, preserve-3d]
    @return {Coffeefx} for chaining
    @api public
  ---------------------------------
  ###

  transformStyle: (style) -> @_setBrowser('transform-style', style, false) if style in ['flat', 'preserve-3d']

  ###
  ---------------------------------
    Perspective
  
    @param {Number} n
    @return {Coffeefx} for chaining
    @api public
  ---------------------------------
  ###

  perspective: (n=50) -> @_setBrowser('perspective', n, false)

  ###
  ---------------------------------
    Perspective
  
    @param {Number} n
    @return {Coffeefx} for chaining
    @api public
  ---------------------------------
  ###

  origin: (n=50) -> @_setBrowser('transform-origin', "#{n}%", false)

  ###
  ---------------------------------
    Transform

    @param {String} transformation
    @return {Coffeefx} for chaining
    @api public
  ---------------------------------
  ###

  transform: (transformation) -> @_setBrowser('transform', transformation)


  ###
  ---------------------------------
    Skew `x` and `y`.
  
    @param {Number} x
    @param {Number} y   def: 0
    @return {Coffeefx} for chaining
    @api public
  ---------------------------------
  ###

  skew: (x, y=0) -> @transform("skew(#{x}deg, #{y}deg)")
  
  ###
  ---------------------------------
  #  * Skew x by `n`.
  #  *
  #  * @param {Number} n
  #  * @return {Move} for chaining
  #  * @api public
  ---------------------------------
  ###

  skewX: (n) -> @transform("skewX(#{n}deg)")

  ###
  ---------------------------------
  #  * Skew y by `n`.
  #  *
  #  * @param {Number} n
  #  * @return {Move} for chaining
  #  * @api public
  ---------------------------------
  ###

  skewY: (n) -> @transform("skewY(#{n}deg)")
  
  ###
  ---------------------------------
  #  * Translate and to `x` and `y` axis.
  #  *
  #  * @param {Number} x
  #  * @param {Number} y
  #  * @return {Move} for chaining
  #  * @api public
  ---------------------------------
  ###

  translate: (x, y=0) -> @transform("translate(#{x}px, #{y}px)")

  ###
  ---------------------------------
  # * Translate on the x axis to `n`.
  # *
  # * @param {Number} n
  # * @return {Move} for chaining
  # * @api public
  ---------------------------------
  ###

  x: (n) -> @translateX(n)
  translateX: (n) -> @transform("translateX(#{n}px)")


  ###
  ---------------------------------
  # * Translate on the y axis to `n`.
  # *
  # * @param {Number} n
  # * @return {Move} for chaining
  # * @api public
  ---------------------------------
  ###

  y: (n) -> @translateY(n)
  translateY: (n) -> 
    @transform("translateY(#{n}px)")
    @
  
  ###
  ---------------------------------
  #  * Scale the x and y axis by `x`, or 
  #  * individually scale `x` and `y`.
  #  *
  #  * @param {Number} x
  #  * @param {Number} y
  #  * @return {Move} for chaining
  #  * @api public
  ---------------------------------
  ###

  scale: (x, y) -> @transform("scale(#{x}, #{y ? x})")

  ###
  ---------------------------------
  #  * Scale x axis by `n`.
  #  *
  #  * @param {Number} n
  #  * @return {Move} for chaining
  #  * @api public
  ---------------------------------
  ###

  scaleX: (n) -> @transform("scaleX(#{n})")

  ###
  ---------------------------------
  #  * Scale y axis by `n`.
  #  *
  #  * @param {Number} n
  #  * @return {Move} for chaining
  #  * @api public
  ---------------------------------
  ###

  scaleY: (n) -> @transform("scaleY(#{n})")

  ###
  ---------------------------------
  #  * Rotate `n` degrees.
  #  *
  #  * @param {Number} n
  #  * @return {Move} for chaining
  #  * @api public
  ---------------------------------
  ###

  rotate: (n) -> @transform("rotate(#{n}deg)")


  ##################################################################
  # Transition
  ##################################################################

  ###
  ---------------------------------
    transitionDuration
    If is text is converted in ms (multiply by 1000)
    
    @param {Number|String} n def:500
    @return {Coffeefx} for chaining
    @api public
  ---------------------------------
  ###

  transitionDuration: (n=500) ->
    if n == -1
      @_deleteBrowserAction("transition-duration")
    else
      n = if 'string' == typeof n then parseFloat(n) * 1000 else n
      @_setBrowser('transition-duration', "#{n}ms", false)

  ###
  ---------------------------------
    Increment `prop` by `val`, deferred until `.end()` is invoked
    and adds the property to the list of transition props.
  
    @param {String} prop
    @param {Number} val
    @return {Move} for chaining
    @api public
  ---------------------------------
  ###

  add: (prop, val) -> @set(prop, parseInt(@current(prop), 10) + val + 'px')

  ###
  ---------------------------------
    Decrement `prop` by `val`, deferred until `.end()` is invoked
    and adds the property to the list of transition props.

    @param {String} prop
    @param {Number} val
    @return {Move} for chaining
    @api public
  ---------------------------------
  ###

  sub: (prop, val) -> @set(prop, parseInt(@current(prop), 10) - val + 'px')
    
  ###
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
  ###

  ease: (fn) -> @_setBrowser('transition-timing-function',  coffeefx.ease[fn] || fn || 'ease')
  
  ###
  ---------------------------------
  #  * Delay the animation by `n`.
  #  * If is text is converted in ms (multiply by 1000)
  #  *
  #  * @param {Number|String} n
  #  * @return {Move} for chaining
  #  * @api public
  ---------------------------------
  ###

  delay: (n) ->
    n = if 'string' == typeof n then parseFloat(n) * 1000 else n
    @_setBrowser('transition-delay', "#{n}ms")

  

  ##################################################################
  # Animation
  ##################################################################
  
  
  _clone: (prop) ->
    child = new Coffeefx(@_selector)
    child._context = prop
    child.parent = @
    child._baseContext()
    child
    
  
  setAnimationName: () -> @_setBrowser('animation-name', @_context, false)
  
  step: (step) ->
    @setAnimationName()
    child = @_clone(step)

  from: () -> @step('from')
  to: () -> @step('to')
  
  duration: (n=500) ->
    @transitionDuration(n)
    @animationDuration(n)
  
  animationDuration: (n=500) ->
    if n == -1
      @_deleteBrowserAction("animation-duration")
    else
      n = if 'string' == typeof n then parseFloat(n) * 1000 else n
      @_setBrowser('animation-duration', "#{n}ms", false)
  
  iteration: (n) -> @_setBrowser('animation-iteration-count', n, false)
  
  timing: (fn = "linear") ->
    @_setBrowser('animation-timing-function', fn, false)

  fillmode: (fn) ->
    @_setBrowser('animation-fill-mode', fn, false)


##################################################################
# Animation
##################################################################


# [
#   {
#     "object" : "logo",
#     "id" : "#logo",
# 
#     "init" : { 
#       "margin": "0px",
#       "padding": "0px",      
#       "width": "1080px",
#       "height": "1920px",
#       "border": "3px solid white",
#       "overflow": "hidden",
#     },
#     
#   },
# 
#   {
#     "object" : "logo",
#     "id" : "#logo",
# 
#     "init" : { 
#       "margin-top": "-700px", 
#       "margin-left": "200px", 
#     },
#     "transition": {  "X": "500px", "opacity": "500px",}
#     "animation": {  
#         "from":{
#           "X": "500px"; 
#           "opacity": "500px",
#         }
#         
#       }
#   }
# ]

window.Caffea = class Caffea
  constructor: (@objects = []) ->

  execute: () ->
    for object in @objects
      @cfx = coffeefx(object["id"])
      @_init(object["id"], object["init"]) if object["init"] != undefined
      @_transformation(object["transformation"]) if object["transformation"] != undefined
      @_animation(object["animation"]) if object["animation"] != undefined
      console.log @cfx
      @cfx.end()
  
  # Init execution before anything with no time
  _init: (object, object_init) ->
    @cfx._context = object
    @cfx.set(key, value) for key, value of object_init
    @cfx.duration(-1)
    @cfx._addCssClass(@cfx._context, @cfx._prepare().replace(/^./, ""))
    
    #returning a clean one
    @cfx = coffeefx(object)
  
  _set: (cfx, key, value) ->
    if (key in css_values)
      cfx.set(key, value)
    else
      cfx[key](value)

  _transformation: (object_trans) ->
    @_set(@cfx, key, value) for key, value of object_trans
    @cfx
  
  _animation:  (object_animation) ->
    for step, step_values of object_animation
      if step in ['from', 'to']
        cfx = @cfx[step]()
        @_set(cfx, key, value) for key, value of step_values
        @cfx = cfx.pop()
      else
        @_set(@cfx, step, step_values)
  
  css_values = [
        'azimuth',
        'background',
        'background-attachment',
        'background-color',
        'background-image',
        'background-position',
        'background-repeat',
        'border',
        'border-bottom',
        'border-bottom-color',
        'border-bottom-style',
        'border-bottom-width',
        'border-collapse',
        'border-color',
        'border-left',
        'border-left-color',
        'border-left-style',
        'border-left-width',
        'border-right',
        'border-right-color',
        'border-right-style',
        'border-right-width',
        'border-spacing',
        'border-style',
        'border-top',
        'border-top-color',
        'border-top-style',
        'border-top-width',
        'border-width',
        'bottom',
        'caption-side',
        'clear',
        'clip',
        'color',
        'content',
        'counter-increment',
        'counter-reset',
        'cue',
        'cue-after',
        'cue-before',
        'cursor',
        'direction',
        'display',
        'elevation',
        'empty-cells',
        'float',
        'font',
        'font-family',
        'font-size',
        'font-style',
        'font-variant',
        'font-weight',
        'height',
        'left',
        'letter-spacing',
        'line-height',
        'list-style',
        'list-style-image',
        'list-style-position',
        'list-style-type',
        'margin',
        'margin-bottom',
        'margin-left',
        'margin-right',
        'margin-top',
        'max-height',
        'max-width',
        'min-height',
        'min-width',
        'opacity',
        'orphans',
        'outline',
        'outline-color',
        'outline-style',
        'outline-width',
        'overflow',
        'padding',
        'padding-bottom',
        'padding-left',
        'padding-right',
        'padding-top',
        'page-break-after',
        'page-break-before',
        'page-break-inside',
        'pause',
        'pause-after',
        'pause-before',
        'pitch',
        'pitch-range',
        'play-during',
        'position',
        'quotes',
        'richness',
        'right',
        'speak',
        'speak-header',
        'speak-numeral',
        'speak-punctuation',
        'speech-rate',
        'stress',
        'table-layout',
        'text-align',
        'text-decoration',
        'text-indent',
        'text-transform',
        'top',
        'unicode-bidi',
        'vertical-align',
        'visibility',
        'voice-family',
        'volume',
        'white-space',
        'widows',
        'width',
        'word-spacing',
        'z-index',
    ]
