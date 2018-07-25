'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ControlProvider = require('./ControlProvider');

var _animatedScrollTo = require('../utils/animated-scroll-to');

var _animatedScrollTo2 = _interopRequireDefault(_animatedScrollTo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FullPage = function (_React$Component) {
  _inherits(FullPage, _React$Component);

  function FullPage(props) {
    _classCallCheck(this, FullPage);

    var _this = _possibleConstructorReturn(this, (FullPage.__proto__ || Object.getPrototypeOf(FullPage)).call(this, props));

    _this.setHeights = function () {
      if (!_this.scrollPending) {
        _this.setState({ height: _this.props.containerHeight ? _this.props.containerHeight : window.innerHeight });
      } else {
        setTimeout(function () {
          _this.setHeights();
        }, 90);
      }
    };

    _this.onTouchStart = function (e) {
      if (_this.props.snap) {
        _this.touchStart = e.touches[0].clientY;
        _this.scrollPending = true;
        _this.newTouch = true;
      }
    };

    _this.onTouchEnd = function () {
      if (_this.props.snap) {
        _this.newTouch = false;
      }
    };

    _this.onTouchMove = function (e) {
      if (_this.props.snap) {
        e.preventDefault();
        var touchEnd = e.changedTouches[0].clientY;
        if (!_this.scrollPending && _this.newTouch) {
          if (_this.touchStart > touchEnd + _this.touchSensitivity) {
            _this.scrollToSlide(_this.state.activeSlide + 1);
          } else if (_this.touchStart < touchEnd - _this.touchSensitivity) {
            _this.scrollToSlide(_this.state.activeSlide - 1);
          }
        }
      }
    };

    _this.onKeyPress = function (e) {
      if ((e.keyCode === 38 || e.keyCode === 40) && _this.props.snap) {
        e.preventDefault();
        if (e.keyCode === 38) {
          _this.scrollToSlide(_this.state.activeSlide - 1);
        }
        if (e.keyCode === 40) {
          _this.scrollToSlide(_this.state.activeSlide + 1);
        }
      }
    };

    _this.onScroll = function (e) {
      if (!_this.props.snap) {
        return;
      }
      e.preventDefault();
      if (_this.scrollPending) {
        return false;
      }

      var deltaY = Math.abs(e.deltaY);
      if (deltaY > _this._wheel.lastDeltaY && !_this._wheel.increasing) {
        _this._wheel.increasing = true;
        _this._isNewScrollAction = true;
      } else {
        _this._isNewScrollAction = false;
        if (deltaY < _this._wheel.lastDeltaY) {
          _this._wheel.increasing = false;
        }
      }
      _this._wheel.lastDeltaY = deltaY;

      if (!_this._isNewScrollAction) {
        return;
      }

      var scrollDown = (e.wheelDelta || -e.deltaY || -e.detail) < 0;
      var activeSlide = _this.state.activeSlide;

      if (scrollDown) {
        activeSlide++;
      } else {
        activeSlide--;
      }
      _this.scrollToSlide(activeSlide);
    };

    _this.myRef;
    _this.newTouch = false;
    _this.scrollPending = false;
    _this.slidesCount = _react2.default.Children.toArray(props.children).filter(function (child) {
      return child.type.displayName !== 'ControlledComponent';
    }).length;
    _this.slideElements = _react2.default.Children.toArray(props.children).filter(function (child) {
      return child.type.displayName !== 'ControlledComponent';
    });
    _this.touchSensitivity = 5;
    _this.touchStart = 0;

    _this._isNewScrollAction = true;
    _this._wheel = { increasing: true, lastDeltaY: 0 };

    _this.state = {
      activeSlide: props.initialSlide
    };
    return _this;
  }

  _createClass(FullPage, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      document.addEventListener('touchmove', this.onTouchMove);
      document.addEventListener('touchstart', this.onTouchStart);
      document.addEventListener('touchend', this.onTouchEnd);
      document.addEventListener('wheel', this.onScroll, false);
      window.addEventListener('resize', this.setHeights);

      document.addEventListener('keydown', this.onKeyPress);

      this.setHeights();
      this.scrollToSlide(this.props.initialSlide);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      document.removeEventListener('touchmove', this.onTouchMove);
      document.removeEventListener('touchstart', this.onTouchStart);
      document.removeEventListener('touchend', this.onTouchEnd);
      document.removeEventListener('wheel', this.onScroll);
      window.removeEventListener('resize', this.setHeights);

      document.removeEventListener('keydown', this.onKeyPress);
    }
  }, {
    key: 'scrollToSlide',
    value: function scrollToSlide(slide) {
      var _this2 = this;

      if (!this.scrollPending && slide >= 0 && slide < this.slidesCount) {
        var currentSlide = this.state.activeSlide;
        this.props.beforeChange({ from: currentSlide, to: slide });
        this.setState({ activeSlide: slide });

        this.scrollPending = true;
        (0, _animatedScrollTo2.default)(this.props.containerHeight ? this.props.containerHeight * slide : window.innerHeight * slide, this.props.duration, this.myRef, this.props.windowScroll, function () {
          _this2.scrollPending = false;
          _this2.props.afterChange({ from: currentSlide, to: slide });
        });
      }
    }
  }, {
    key: 'scrollNext',
    value: function scrollNext() {
      this.scrollToSlide(this.state.activeSlide + 1);
    }
  }, {
    key: 'scrollPrev',
    value: function scrollPrev() {
      this.scrollToSlide(this.state.activeSlide - 1);
    }
  }, {
    key: 'getSlidesCount',
    value: function getSlidesCount() {
      return this.slidesCount;
    }
  }, {
    key: 'getCurrentIndex',
    value: function getCurrentIndex() {
      return this.state.activeSlide;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var controls = {
        scrollToSlide: this.scrollToSlide.bind(this),
        scrollNext: this.scrollNext.bind(this),
        scrollPrev: this.scrollPrev.bind(this),
        getSlidesCount: this.getSlidesCount.bind(this),
        getCurrentIndex: this.getCurrentIndex.bind(this)
      };

      return _react2.default.createElement(
        _ControlProvider.Provider,
        controls,
        _react2.default.createElement(
          'div',
          {
            className: this.props.className,
            ref: function ref(_ref) {
              return _this3.myRef = _ref;
            },
            style: this.props.windowScroll ? { height: this.state.height } : { height: this.state.height, width: '100%', position: 'fixed', overflowY: 'scroll' }
          },
          this.props.children
        )
      );
    }
  }]);

  return FullPage;
}(_react2.default.Component);

FullPage.propTypes = {
  children: _propTypes2.default.node.isRequired,
  className: _propTypes2.default.string,
  initialSlide: _propTypes2.default.number,
  windowScroll: _propTypes2.default.bool,
  snap: _propTypes2.default.bool,
  duration: _propTypes2.default.number,
  beforeChange: _propTypes2.default.func,
  afterChange: _propTypes2.default.func,
  containerHeight: _propTypes2.default.number
};
FullPage.defaultProps = {
  className: 'snap-container',
  initialSlide: 0,
  windowScroll: true,
  snap: true,
  duration: 700,
  beforeChange: function beforeChange() {},
  afterChange: function afterChange() {}
};


module.exports = FullPage;