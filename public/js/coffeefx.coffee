#########################################
# Initialize a `Move` instance with the given `selector`.
#
# @param {String} selector
# @return {Move}
# @api public
#########################################

window.move = (selector) ->
  new Move(move.select(selector))
  
#########################################
# `duration` - default duration of 500ms
#########################################
window.move.defaults = { duration: 500 }


#########################################
#  * Computed style.
#########################################

current = getComputedStyle || currentStyle


# /**
#  * Map of prop -> type for numeric values.
#  */

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



#########################################
# Easing functions.
#########################################

window.move.ease = {
  'in': 'ease-in'
  'out': 'ease-out'
  'in-out': 'ease-in-out'
  'snap': 'cubic-bezier(0,1,.5,1)'
}

#########################################
# Default element selection utilized by `move(selector)`.
#
# Override to implement your own selection, for example
# with jQuery one might write:
#
#     move.select = function(selector) {
#       return jQuery(selector).get(0);
#     };
#
# @param {String} selector
# @return {Element}
# @api public
#########################################

window.move.select = (selector) ->
  document.getElementById(selector) || document.querySelectorAll(selector)[0]

#########################################
# EventEmitter.
#########################################

class EventEmitter
  constructor: ->
    @callbacks = {}
  
  #########################################
  # Listen on the given `event` with `fn`.
  #
  # @param {String} event
  # @param {Function} fn
  #########################################

  on: (event, fn) ->
    (@callbacks[event] = @callbacks[event] || []).push(fn)
    @

  #########################################
  # Emit `event` with the given args.
  #
  # @param {String} event
  # @param {Mixed} ...
  #########################################

  emit: (event) ->
    args = Array.prototype.slice.call(arguments, 1)
    callbacks = @callbacks[event] ? []
    callback.apply(@, args) for callback in callbacks
    @


window.Move = class Move extends EventEmitter
  #########################################
  # Initialize a new `Move` with the given `el`.
  #
  # @param {Element} el
  # @api public
  #########################################
  constructor: (el) ->
    return new Move(el) if (!(@ instanceof Move))
    EventEmitter.call(@)
    @el = el
    @_props = {}
    @_rotate = 0
    @_transitionProps = []
    @_transforms = []
    @duration(move.defaults.duration)
    
  #########################################
  # Buffer `transform`.
  # 
  # @param {String} transform
  # @return {Move} for chaining
  # @api private
  #########################################

  transform: (transform) ->
    @_transforms.push(transform)
    @

  #########################################
  # Skew `x` and `y`.
  # 
  # @param {Number} x
  # @param {Number} y
  # @return {Move} for chaining
  # @api public
  #########################################

  skew: (x, y=0) -> @transform("skew(#{x}deg, #{y}deg)")

  #########################################
  #  * Skew x by `n`.
  #  *
  #  * @param {Number} n
  #  * @return {Move} for chaining
  #  * @api public
  #########################################

  skewX: (n) -> @transform("skewX(#{n}deg)")

  #########################################
  #  * Skew y by `n`.
  #  *
  #  * @param {Number} n
  #  * @return {Move} for chaining
  #  * @api public
  #########################################

  skewY: (n) -> @transform("skewY(#{n}deg)")
  
  #########################################
  #  * Translate and to `x` and `y` axis.
  #  *
  #  * @param {Number} x
  #  * @param {Number} y
  #  * @return {Move} for chaining
  #  * @api public
  #########################################

  translate: (x, y=0) -> @to(x, y)  
  to: (x, y=0) -> @transform("translate(#{x}px, #{y}px)")

  #########################################
  # * Translate on the x axis to `n`.
  # *
  # * @param {Number} n
  # * @return {Move} for chaining
  # * @api public
  #########################################

  translateX: (n) -> @x(n)
  x: (n) -> @transform("translateX(#{n}px)")

  #########################################
  # * Translate on the y axis to `n`.
  # *
  # * @param {Number} n
  # * @return {Move} for chaining
  # * @api public
  #########################################

  translateY: (n) -> @y(n)
  y: (n) -> @transform("translateY(#{n}px)")
  
  #########################################
  #  * Scale the x and y axis by `x`, or 
  #  * individually scale `x` and `y`.
  #  *
  #  * @param {Number} x
  #  * @param {Number} y
  #  * @return {Move} for chaining
  #  * @api public
  #########################################

  scale: (x, y) -> @transform("scale(#{x}, #{y ? x})")

  #########################################
  #  * Scale x axis by `n`.
  #  *
  #  * @param {Number} n
  #  * @return {Move} for chaining
  #  * @api public
  #########################################

  scaleX: (n) -> @transform("scaleX(#{n})")

  #########################################
  #  * Scale y axis by `n`.
  #  *
  #  * @param {Number} n
  #  * @return {Move} for chaining
  #  * @api public
  #########################################

  scaleY: (n) -> @transform("scaleY(#{n})")

  #########################################
  #  * Rotate `n` degrees.
  #  *
  #  * @param {Number} n
  #  * @return {Move} for chaining
  #  * @api public
  #########################################

  rotate: (n) -> @transform("rotate(#{n}deg)")
  
  # /**
  #  * Set transition easing function to to `fn` string.
  #  *
  #  * When:
  #  *
  #  *   - null "ease" is used
  #  *   - "in" "ease-in" is used
  #  *   - "out" "ease-out" is used
  #  *   - "in-out" "ease-in-out" is used
  #  *
  #  * @param {String} fn
  #  * @return {Move} for chaining
  #  * @api public
  #  */

  ease: (fn) -> @setVendorProperty('transition-timing-function',  move.ease[fn] || fn || 'ease')
  
  # /**
  #  * Set duration to `n`.
  #  * 
  #  * If is text is converted in ms (multiply by 1000)
  #  * @param {Number|String} n
  #  * @return {Move} for chaining
  #  * @api public
  #  */

  duration: (n) ->
    @_duration = if 'string' == typeof n then parseFloat(n) * 1000 else n
    @setVendorProperty('transition-duration', "#{@_duration}ms")
    
    
  # /**
  #  * Delay the animation by `n`.
  #  * If is text is converted in ms (multiply by 1000)
  #  *
  #  * @param {Number|String} n
  #  * @return {Move} for chaining
  #  * @api public
  #  */

  delay: (n) ->
    n = if 'string' == typeof n then parseFloat(n) * 1000 else n
    @setVendorProperty('transition-delay', "#{n}ms")

  # /**
  #  * Set `prop` to `val`, deferred until `.end()` is invoked.
  #  *
  #  * @param {String} prop
  #  * @param {String} val
  #  * @return {Move} for chaining
  #  * @api public
  #  */

  setProperty: (prop, val) ->
    @_props[prop] = val
    @

  # /**
  #  * Set a vendor prefixed `prop` with the given `val`.
  #  *
  #  * @param {String} prop
  #  * @param {String} val
  #  * @return {Move} for chaining
  #  * @api public
  #  */

  setVendorProperty: (prop, val) ->
    @setProperty(brow + prop, val) for brow in ['-webkit-', '-moz-', '-ms-', '-o-']
    @


  # /**
  #  * Set `prop` to `value`, deferred until `.end()` is invoked
  #  * and adds the property to the list of transition props.
  #  *
  #  * @param {String} prop
  #  * @param {String} val
  #  * @return {Move} for chaining
  #  * @api public
  #  */

  set: (prop, val) ->
    @transition(prop)
    val += map[prop] if ('number' == typeof val and map[prop]) 
    @_props[prop] = val
    @

  # /**
  #  * Increment `prop` by `val`, deferred until `.end()` is invoked
  #  * and adds the property to the list of transition props.
  #  *
  #  * @param {String} prop
  #  * @param {Number} val
  #  * @return {Move} for chaining
  #  * @api public
  #  */

  add: (prop, val) ->
    self =@
    @on 'start', -> self.set(prop, parseInt(self.current(prop), 10) + val + 'px')

  # /**
  #  * Decrement `prop` by `val`, deferred until `.end()` is invoked
  #  * and adds the property to the list of transition props.
  #  *
  #  * @param {String} prop
  #  * @param {Number} val
  #  * @return {Move} for chaining
  #  * @api public
  #  */

  sub: (prop, val) ->
    self = @
    @on('start', -> self.set(prop, parseInt(self.current(prop), 10) - val + 'px'))

  # /**
  #  * Get computed or "current" value of `prop`.
  #  *
  #  * @param {String} prop
  #  * @return {String}
  #  * @api public
  #  */

  current: (prop) -> current(@el).getPropertyValue(prop)
  
  
  # /**
  #  * Add `prop` to the list of internal transition properties.
  #  *
  #  * @param {String} prop
  #  * @return {Move} for chaining
  #  * @api private
  #  */

  transition: (prop) ->
    return @ if (!this._transitionProps.indexOf(prop)) 
    this._transitionProps.push(prop)
    @

  # /**
  #  * Commit style properties, aka apply them to `el.style`.
  #  *
  #  * @return {Move} for chaining
  #  * @see Move#end()  
  #  * @api private
  #  */

  applyProperties: ->
    props = @_props
    el = @el
    el.style.setProperty(prop, props[prop], '') if (props.hasOwnProperty(prop)) for prop in props
    @

  # /**
  #  * Re-select element via `selector`, replacing
  #  * the current element.
  #  *
  #  * @param {String} selector
  #  * @return {Move} for chaining
  #  * @api public
  #  */

  move: (selector) -> @select(selector)
  select: (selector) ->
    @el = move.select(selector)
    @

  # /**
  #  * Defer the given `fn` until the animation
  #  * is complete. `fn` may be one of the following:
  #  *
  #  *   - a function to invoke
  #  *   - an instanceof `Move` to call `.end()`
  #  *   - nothing, to return a clone of this `Move` instance for chaining
  #  *
  #  * @param {Function|Move} fn
  #  * @return {Move} for chaining
  #  * @api public
  #  */

  then: (fn) ->
    # // invoke .end()
    if (fn instanceof Move) 
      @on('end', -> fn.end())
    # // callback
    else if ('function' == typeof fn) 
      @on('end', fn)
    # // chain
    else
      clone = new Move(this.el)
      clone._transforms = this._transforms.slice(0)
      @then(clone)
      clone.parent = @
      return clone

    @

    # /**
    #  * Pop the move context.
    #  *
    #  * @return {Move} parent Move
    #  * @api public
    #  */

    pop: -> @parent

  # /**
  #  * Start animation, optionally calling `fn` when complete.
  #  *
  #  * @param {Function} fn
  #  * @return {Move} for chaining
  #  * @api public
  #  */

  end: (fn) ->
    self = @

    # // emit "start" event
    @emit('start')

    # // transforms
    @setVendorProperty('transform', @_transforms.join(' ')) if (@_transforms.length) 

    # // transition properties
    @setVendorProperty('transition-properties', this._transitionProps.join(', '))
    @applyProperties()

    # // callback given
    @then(fn) if (fn) 

    # // emit "end" when complete
    setTimeout( (-> self.emit('end')), this._duration)

    @
