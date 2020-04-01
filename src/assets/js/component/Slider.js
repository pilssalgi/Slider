import { TweenLite, Power2, TimelineLite } from 'gsap'
import DragAndDrop from './DragAndDrop'
import IntersectionObserver from './IntersectionObserver'

const debounce = require('lodash/debounce')
const throttle = require('lodash/throttle')
const assignIn = require('lodash/assignIn')
const UA = require('./UA')()

export default class Slider {
  constructor(wrap,option = {},) {
    this.windowWidth = 0

    this.$ = {
      wrap : wrap,
      outer : wrap.querySelector('.slider-outer'),
      inner : wrap.querySelector('.slider-inner'),
      items : wrap.querySelectorAll('.slider__item')
    }

    this.config = {
      power: UA.isPC ? 0.2 : 0.4,
      friction: 0.93,
      reverse: false,
      arrowLeft: null,
      arrowRight: null,
      yoyo: true,
      yoyoSpeed: 0.1,
      yoyoPower: UA.isPC ? 2 : 1, // recommended 0 ~ 2
    }

    assignIn(this.config, option)

    this.current = 0
    this.reserveID = 0
    this.directiondirection = 1
    this.isDrag = false
    this.isDragOn = false;
    this.isRender = false
    this.preventClickTimer = null;
    this.drag = { vf: 0, power: 0, old: { x: 0, y: 0 } }
    this.position = { x: 0, z: 0, oldX: 0, ratio: 0 }
    this.size = {
      left: 0,
      width: 0,
      halfWidth: 0,
      total: 0,
      margin: 0,
      start: 0,
      end: 0,
      all: 0,
    }

    this.dnd = null
    this.tweener = null
    this.tweenOption = {
      duration: 0.7,
      ease: Power2.easeInOut,
      complete: () => {},
    }

    this.items = []
    this.observer = new IntersectionObserver()

    /*
      items
    */
    let imageCount = 0;
    let imageLoadCount = 0;
    this.$.items.forEach(($item, index) => {
      this.items[index] = {
        dom: $item,
        offset: 0,
        offsetOld: 0,
        aspect:1,
      }

      this.observer.add($item)

      // this is option for define size by image, or you chooce 
      let img = $item.querySelector('img');
      if(img){
        let image = new Image();
        imageCount++;
        image.src = img.getAttribute('src');
        image.onload = ()=>{
          img.width = image.width;
          img.height = image.height;
          this.items[index].aspect = image.width / image.height;
          imageLoadCount++;
          if(imageLoadCount == imageCount){
            this.resize();
          }
        }
      }
    })


    /*
      drag and drop
    */
    this.dnd = new DragAndDrop(this.$.wrap)
    this.dnd.onStart = (e) => {
      if (this.tweener) this.tweener.kill()
      this.isDrag = true
      this.drag.old = e.start
      if (!this.isRender) {
        this.isRender = true
        console.log("this.isRender", this.isRender);
        requestAnimationFrame(this.render.bind(this))
      }
      if(this.preventClickTimer)clearTimeout(this.preventClickTimer);
    }

    this.dnd.onMove = (e) => {
      this.drag.vf += Math.round((this.drag.old.x - e.move.x) * this.config.power)
      this.drag.old = e.move
      if(!this.isDragOn)this.$.wrap.classList.add('preventClick');
      this.isDragOn = true;
    }

    this.dnd.onEnd = (e) => {
      this.isDrag = false
      this.isDragOn = false;
      this.preventClickTimer = setTimeout(()=>{
        this.$.wrap.classList.remove('preventClick');
      },100)
      
    }

    if (this.config.reverse) {
      this.position.x = this.size.end
      this.position.ratio = this.position.x / this.size.end
      this.moveSlide(this.position.x)
      this.current = this.items.total
    }

    /*
      add event
    */
    if (this.config.arrowLeft) {
      this.config.arrowLeft.addEventListener('click', () => {
        this.prev()
      })
    }

    if (this.config.arrowRight) {
      this.config.arrowRight.addEventListener('click', () => {
        this.next()
      })
    }

    this.resize = debounce(this.resize.bind(this), 100)
    window.addEventListener('resize', this.resize)
    this.resize(true)
  }

  resize(force = false) {
    if (UA.isSmartPhone) {
      if (this.windowWidth == window.innerWidth && !force) {
        return
      }
      this.windowWidth = window.innerWidth
    }

    this.size.all = 0
    let sliderHeight = this.$.inner.clientHeight

    this.items.forEach((item, i) => {
      const padding = Number(window.getComputedStyle(item.dom, null).getPropertyValue('padding-right').replace('px',''))
      const width = Math.floor(sliderHeight * item.aspect + padding);
      item.dom.style.width = width + 'px';
      item.dom.style.height = sliderHeight + 'px';
      this.size.all += width;
    })

    this.$.inner.style.width = this.size.all + 'px'
    this.size.total = this.size.all - this.$.outer.clientWidth

    if (!this.config.reverse) {
      this.size.start = 0
      this.size.end = this.size.total < 0 ? 0 : this.size.total
      if (this.position.x < this.size.start) {
        this.position.x = this.size.start
        this.position.ratio = 0
      }
      // if(this.position.x < this.size.start)
    } else {
      this.size.start = this.size.total < 0 ? this.size.total : 0
      this.size.end = this.size.total
      this.position.x = this.position.ratio * this.size.total

      if (this.position.x < this.size.start) {
        this.position.x = this.size.start
        this.position.ratio = 1
      }
    }

    this.position.x = this.position.ratio * this.size.total
    this.moveSlide(this.position.x)
  }

  render() {
    this.drag.vf *= this.config.friction
    
    this.drag.vf = Math.round(this.drag.vf * 1000) / 1000;
    this.position.x += this.drag.vf
    this.direction = this.drag.vf < 0 ? -1 : 1

    if (this.drag.vf > -0.1 && this.drag.vf < 0.1 && !this.isDrag) {
      this.drag.vf = 0
      this.position.x = Math.floor(this.position.x)
      this.isRender = false
    } 

    // this.drag.power += (this.drag.vf - this.drag.power) * 0.2
    // if (this.size.end != 0) this.position.ratio = this.position.x / this.size.end
    if (this.position.x < this.size.start)this.position.x += (this.size.start - this.position.x) * this.config.power
    if (this.position.x > this.size.end)this.position.x += (this.size.end - this.position.x) * this.config.power

    this.moveSlide(this.position.x,this.isRender)  
    this.position.oldX = this.position.x;
    if(this.isRender)requestAnimationFrame(this.render.bind(this))
  }

  moveSlide(x,isRender) {
    // this.matrix3d(this.$.inner, -x, 0, 0, 1)

    this.translate3d(this.$.inner,-x + 'px',0,0);

    let standardLeft = Math.floor(this.position.ratio * this.items.length)
    let standardRight = Math.floor(
      (1 - this.position.ratio) * this.items.length,
    )

    if (this.size.end != 0) this.position.ratio = x / this.size.end

    if (this.config.yoyo) {
      this.items.forEach((item,i)=>{
        this.reserveID = this.items.length - i - 1
        let itemR = this.items[this.reserveID]
        if (this.direction > 0) {
          if (!this.config.reverse){
            item.offset += (this.drag.vf * this.config.yoyoPower * (i - standardLeft) - item.offset) * this.config.yoyoSpeed
          }else{
            this.items[this.reserveID].offset += (this.drag.vf * this.config.yoyoPower * (i - standardLeft) - itemR.offset) * this.config.yoyoSpeed
          }
        } else {
          if (!this.config.reverse){
            item.offset += (this.drag.vf * this.config.yoyoPower * (this.reserveID - standardRight) - item.offset) * this.config.yoyoSpeed
          }else{
            itemR.offset += (this.drag.vf * this.config.yoyoPower * (this.reserveID - standardRight) - itemR.offset) * this.config.yoyoSpeed
          }
        }

        if (item.offsetOld != item.offset) {
          // let x = !isRender?Math.floor(item.offset):item.offset
          this.translate3d(item.dom, item.offset + 'px', 0, 0)
        }
        item.offsetOld = item.offset
      })
    }
  }

  jump(x, option) {
    if (this.tweener) this.tweener.kill()
    assignIn(this.tweenOption, option)
    this.tweener = TweenLite.to(this.position, this.tweenOption.duration, {
      x: x,
      ease: this.tweenOption.ease,
      onUpdate: () => {
        this.moveSlide(this.position.x)
      },
      onComplete: function() {
      },
    })
  }

  prev(option) {
    let tgX = 0
    let firstViewX = 0
    let check = false
    if (this.config.reverse) {
    } else {
      this.items.forEach((item) => {
        if (item.dom.classList.contains('in') && !check) {
          firstViewX = item.dom.getBoundingClientRect().left
          check = true
        }
      })
    }
    tgX = this.position.x - firstViewX
    if (tgX < 0) tgX = 0

    this.jump(tgX, option)
  }

  next(option) {
    let tgX = 0
    let lastViewX = 0
    if (this.config.reverse) {
    } else {
      this.items.forEach((item) => {
        if (item.dom.classList.contains('in')) {
          lastViewX = item.dom.getBoundingClientRect().left
        }
      })
    }
    tgX = this.position.x - lastViewX
    if (tgX > this.size.end) tgX = this.size.end

    this.jump(tgX, option)
  }

  matrix3d(dom, dx, dy, dz, scale) {
    dom.style.transform = `matrix3d(
    1, 0, 0, 0, 
    0, 1, 0, 0, 
    0, 0, 1, 0, 
    ${dx}, ${dy}, ${dz}, ${scale})`
  }

  translate3d(dom, x, y, z) {
    dom.style.transform = `translate3d(${x},${y},${z})`
  }
  kill() {
    window.removeEventListener('resize', this.resize)
  }
  reset() {}
}
