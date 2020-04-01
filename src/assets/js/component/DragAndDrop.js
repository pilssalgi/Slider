const assignIn = require('lodash/assignIn')
const UA = require('./UA')()
const canPassive = require('./CheckPassive')
const throttle = require('lodash/throttle')

export default class ClassName {
  constructor($target, option = {}) {
    this.$target = $target
    this.config = {
      moveWhileDown: true,
      targetOut: false,
    }

    this.info = {
      event: null,
      start: { x: 0, y: 0 },
      move: { x: 0, y: 0 },
      end: { x: 0, y: 0 },
      distance: { x: 0, y: 0 },
      distanceOffset: function() {
        return { x: Math.abs(this.distance.x), y: Math.abs(this.distance.y) }
      },
    }

    assignIn(this.config, option)

    this.isDown = false

    const onStart = (e) => {
      if(UA.isPC)e.preventDefault();

      this.info.start = getPageInfo(e)
      this.info.move = { x: 0, y: 0 }
      this.info.end = { x: 0, y: 0 }
      this.info.distance = { x: 0, y: 0 }
      this.onStart(this.info)
      this.isDown = true

      if (UA.isPC) {
        document.addEventListener('mousemove', onMove)
        document.addEventListener('mouseup', onEnd)
        if (this.config.targetOut) $target.addEventListener('mouseout', onEnd)
      }

      document.addEventListener(
        'touchmove',
        onMove,
        canPassive() ? { passive: true } : false,
      )
      document.addEventListener('touchend', onEnd, false)
    }

    const onMove = (e) => {
      // if(e.cancelable){
      // e.preventDefault();
      // }

      this.info.move = getPageInfo(e)
      this.info.distance.x = this.info.start.x - this.info.move.x
      this.info.distance.y = this.info.start.y - this.info.move.y

      // if (Math.abs(this.info.distance.x) > Math.abs(this.info.distance.y))e.preventDefault()

      if (this.config.moveWhileDown) {
        if (this.isDown) this.onMove(this.info)
      } else {
        this.onMove(this.info)
      }
    };

    const onEnd = (e) => {
      e.preventDefault();
      this.isDown = false
      this.info.end = this.info.move
      // if (this.config.moveWhileDown) {
      //   if (!this.isDown) this.onEnd(this.info)
      // } else {
      //   this.onEnd(this.info)
      // }

      this.onEnd(this.info)

      if (UA.isPC) {
        document.removeEventListener('mousemove', onMove)
        document.removeEventListener('mouseup', onEnd)
        if (this.config.targetOut)
          $target.removeEventListener('mouseout', onEnd)
      }

      document.removeEventListener('touchmove', onMove)
      document.removeEventListener('touchend', onEnd)
    }

    function getPageInfo(e) {
      let info = { x: 0, y: 0 }
      let supportTouch = 'ontouchstart' in window
      let targetRect = e.target.getBoundingClientRect() //{left:e.target.offsetLeft,top:e.target.offsetTop};
      if (UA.isMozilla && UA.isPC) supportTouch = false
      if (e.touches) {
        let touch
        if (e.touches) {
          touch = e.touches[0]
          info.x = touch.clientX
          info.y = touch.clientY
        } else {
          info.x = e.clientX
          info.y = e.clientY
        }
      } else {
        info.x = e.clientX
        info.y = e.clientY
      }
      return info
    }

    if (UA.isPC) {
      this.$target.addEventListener('mousedown', onStart)
    } 

    this.$target.addEventListener(
      'touchstart',
      onStart,
      canPassive() ? { passive: true } : false,
    )
  }

  onStart() {}
  onMove() {}
  onEnd() {}
}
