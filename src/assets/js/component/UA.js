;(function() {
  var UA = function() {
    if (window.UA) return window.UA
    var e, t, n, r, u, nv
    u = navigator.userAgent
    r = navigator.userAgent.toLowerCase()
    nv = window.navigator
    t = {
      isIE: false,
      isIE6: false,
      isIE7: false,
      isIE8: false,
      isIE9: false,
      isLtIE9: false,
      isLtIE10: false,
      isLtIE11: false,
      isIE10: false,
      isIE11: false,
      isEdge: false,
      isIOS: false,
      isIOS8: false,
      isIPhone: false,
      isIPad: false,
      isIPhone4: false,
      isIPad3: false,
      isAndroid: false,
      isAndroidMobile: false,
      isChrome: false,
      isSafari: false,
      isMozilla: false,
      isFirefox: false,
      isWebkit: false,
      isOpera: false,
      isPC: false,
      isTablet: false,
      isSmartPhone: false,
      browser: r,
      isMac: /mac/i.test(nv['platform']),
      isWin: /win/i.test(nv['platform']),
    }

    if ((t.isIE = /msie\s(\d+)/.test(r))) {
      n = RegExp.$1
      n *= 1
      t.isIE6 = n === 6
      t.isIE7 = n === 7
      t.isIE8 = n === 8
      t.isIE9 = n === 9
      t.isIE10 = n === 10
      t.isLtIE9 = n < 9
      t.isLtIE10 = n < 10
      t.isLtIE11 = n < 11
    }

    if (t.isIE7 && r.indexOf('trident/4.0') !== -1) {
      t.isIE7 = false
      t.isIE8 = true
    }
    if (r.indexOf('trident/7.0') !== -1) {
      t.isIE = true
      t.isIE11 = true
    }

    if (r.indexOf('applewebkit') > -1 && r.indexOf('edge') > -1) {
      t.isEdge = true
      t.isIE = true
    }

    if ((t.isIPhone = /i(phone|pod)/.test(r))) {
      t.isIPhone4 = window.devicePixelRatio === 2
    }
    if ((t.isIPad = /ipad/.test(r))) {
      e = window.devicePixelRatio === 2
    }
    t.isIOS = t.isIPhone || t.isIPad

    t.isAndroid = /android/.test(r)
    if (t.isAndroid) {
      t.androidVersion = Number(
        /Android \d+(.\d)?/.exec(u)[0].replace('Android ', ''),
      )
    }

    t.isAndroidMobile = /android(.+)?mobile/.test(r)
    t.isPC = !t.isIOS && !t.isAndroid
    t.isTablet = t.isIPad || (t.isAndroid && t.isAndroidMobile)
    t.isSmartPhone = t.isIPhone || t.isAndroidMobile
    t.isChrome = /chrome/.test(r)

    if (t.isIOS) {
      t.isChrome = /crios/.test(r)

      if (t.isTablet) {
        t.iosVersion = Number(
          r.substr(r.lastIndexOf('ipad') + 12, 3).split('_')[0],
        )
      } else {
        t.iosVersion = Number(
          r.substr(r.lastIndexOf('iphone os') + 10, 3).split('_')[0],
        )
      }

      if (t.isTablet) {
        t.isSmartPhone = false
      }
    }

    if (t.isChrome) {
      if (t.isAndroidMobile) {
        t.chromeVersion = r.substr(r.lastIndexOf('chrome/') + 7, 2)
      } else if (t.isAndroid && t.isTablet) {
        t.chromeVersion = r.substr(r.lastIndexOf('chrome/') + 7, 2)
      } else {
        t.chromeVersion = r.substr(r.lastIndexOf('crios/') + 6, 2)
      }
    }

    t.isWebkit = /webkit/.test(r)
    t.isOpera = /opera/.test(r)
    t.isMozilla = r.indexOf('compatible') < 0 && /mozilla/.test(r)
    t.isSafari = !t.isChrome && t.isWebkit
    t.isFirefox = t.isMozilla && !t.isChrome && !t.isSafari
    window.UA = t
    return t
  }

  UA.prototype.constructor = UA
  module.exports = UA
}.call(this))
