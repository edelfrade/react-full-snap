'use strict';

var easeInOutCubic = require('./ease-in-out-cubic');

function animatedScrollTo(scrollTo, duration, element, windowScroll, callback) {
  var scrollFrom = windowScroll ? window.scrollY : element.scrollTop;
  var scrollDiff = scrollTo - scrollFrom;
  var currentTime = 0;
  var increment = 20;

  (function animateScroll() {
    currentTime += increment;
    var newScrollPos = easeInOutCubic(currentTime, scrollFrom, scrollDiff, duration);

    try {
      windowScroll ? window.scrollTo(0, newScrollPos) : element.scrollTo(0, newScrollPos);
    } catch (e) {
      windowScroll ? window.scrollTo(0, newScrollPos) : element.scrollTop = newScrollPos;
    }

    if (currentTime > duration) {
      return callback();
    }

    setTimeout(animateScroll, increment);
  })();
}

module.exports = animatedScrollTo;