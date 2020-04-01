require('intersection-observer')
const assignIn = require('lodash/assignIn')

export default class IntersectionObserve {
  constructor(option) {
    this.config = {
      root: null, // scroll area, null = body
      rootMargin: '0px', // -100~100  px, %
      threshold: 0, // 0 ~ 100..n
    }

    assignIn(this.config, option)

    const thresholds = []
    const numSteps = this.config.threshold

    for (let i = 1.0; i <= numSteps; i++) {
      let ratio = i / numSteps
      thresholds.push(ratio)
    }
    thresholds.push(0)

    this.config.threshold = thresholds
    this.intersectionObsever = new IntersectionObserver((...arg) => {
      this.onUpdate(...arg)
    }, this.config)
  }

  onUpdate(entries, observer) {
    // eslint-disable-line no-unused-vars
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in')
        // entry.target.in(entry)
      } else {
        entry.target.classList.remove('in')
        // entry.target.out(entry)
      }
    })
  }

  add(dom) {
    this.intersectionObsever.observe(dom)
  }

  remove(dom) {
    this.intersectionObsever.unobserve(dom)
  }
}
