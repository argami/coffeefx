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
#        		.step()
#        			.transform().rotate().skew()
#        			.transition()...
#        		.onEnd(callback)
#        	.end()
#
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
    @el = @select(selector)
    @_fx = {} #this variable save all the information of the whole effects
    @_context = undefined
    if @el != undefined
      @transitionDuration() #add the transitionDuration as default
    
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
  context: (context = null) ->
    if context != null
      @_baseContext[context] = {} if @_baseContext[context] == undefined
      return @_baseContext[context]
    @_baseContext()

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

  _prepare: (context = null) -> 
    context = context ? @_context
    text = JSON.stringify @_fx[@_context]
    text = text.replace(/","/gi, "; ").replace(/"/gi, "").replace(/"}"/gi, ";").replace("{","").replace("}",";")


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
    cssAnimation.id = className
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
    end add the context as a css
    class and execute

    @return {String}
    @api private
  ---------------------------------
  ###

  end: (context =null) ->
    self = @
    @_addCssClass( @_context, @_prepare(context) )
    @el.style.cssText = @_prepare()

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

  add: (prop, val) ->
    @set(prop, parseInt(@current(prop), 10) + val + 'px')

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

  sub: (prop, val) ->
    @set(prop, parseInt(@current(prop), 10) - val + 'px')
    
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
  
