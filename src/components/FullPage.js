import PropTypes from 'prop-types';
import React from 'react';
import { Provider } from './ControlProvider';
import animatedScrollTo from '../utils/animated-scroll-to';

class FullPage extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    initialSlide: PropTypes.number,
    windowScroll: PropTypes.bool,
    snap: PropTypes.bool,
    duration: PropTypes.number,
    beforeChange: PropTypes.func,
    afterChange: PropTypes.func,
    offset: PropTypes.number
  };

  static defaultProps = {
    className: 'snap-container',
    initialSlide: 0,
    windowScroll: true,
    snap: true,
    duration: 700,
    offset: 0,
    beforeChange: () => {},
    afterChange: () => {}
  };

  constructor(props) {
    super(props);
    this.myRef;
    this.newTouch = false;
    this.scrollPending = false;
    this.slidesCount = React.Children.toArray(props.children).filter(child => {
      return child.type.displayName !== 'ControlledComponent';
    }).length;
    this.slideElements = React.Children.toArray(props.children).filter(child => {
      return child.type.displayName !== 'ControlledComponent';
    });
    this.touchSensitivity = 5;
    this.touchStart = 0;

    this._isNewScrollAction = true;
    this._wheel = { increasing: true, lastDeltaY: 0 };

    this.state = {
      activeSlide: props.initialSlide
    };
  }

  componentDidMount() {
    document.addEventListener('touchmove', this.onTouchMove);
    document.addEventListener('touchstart', this.onTouchStart);
    document.addEventListener('touchend', this.onTouchEnd);
    document.addEventListener('wheel', this.onScroll, false);
    window.addEventListener('resize', this.setHeights);

    document.addEventListener('keydown', this.onKeyPress);

    this.setHeights();
    this.scrollToSlide(this.props.initialSlide);
  }

  componentWillUnmount() {
    document.removeEventListener('touchmove', this.onTouchMove);
    document.removeEventListener('touchstart', this.onTouchStart);
    document.removeEventListener('touchend', this.onTouchEnd);
    document.removeEventListener('wheel', this.onScroll);
    window.removeEventListener('resize', this.setHeights);

    document.removeEventListener('keydown', this.onKeyPress);
  }

  setHeights = () => {
    if (!this.scrollPending) {
      this.setState({ height: window.innerHeight - this.props.offset });
    } else {
      setTimeout(() => {
        this.setHeights();
      }, 90);
    }
  };

  scrollToSlide(slide) {
    if (!this.scrollPending && slide >= 0 && slide < this.slidesCount) {
      const currentSlide = this.state.activeSlide;
      this.props.beforeChange({ from: currentSlide, to: slide });
      this.setState({ activeSlide: slide });

      this.scrollPending = true;
      animatedScrollTo((window.innerHeight - this.props.offset) * slide, this.props.duration, this.myRef, this.props.windowScroll, () => {
        this.scrollPending = false;
        this.props.afterChange({ from: currentSlide, to: slide });
      });
    }
  }

  onTouchStart = e => {
    if (this.props.snap) {
      this.touchStart = e.touches[0].clientY;
      this.scrollPending = true;
      this.newTouch = true;
    }
  };
  onTouchEnd = () => {
    if (this.props.snap) {
      this.newTouch = false;
    }
  };

  onTouchMove = e => {
    if (this.props.snap) {
      e.preventDefault();
      const touchEnd = e.changedTouches[0].clientY;
      if (!this.scrollPending && this.newTouch) {
        if (this.touchStart > touchEnd + this.touchSensitivity) {
          this.scrollToSlide(this.state.activeSlide + 1);
        } else if (this.touchStart < touchEnd - this.touchSensitivity) {
          this.scrollToSlide(this.state.activeSlide - 1);
        }
      }
    }
  };

  onKeyPress = e => {
    if ((e.keyCode === 38 || e.keyCode === 40) && this.props.snap) {
      e.preventDefault();
      if (e.keyCode === 38) {
        this.scrollToSlide(this.state.activeSlide - 1);
      }
      if (e.keyCode === 40) {
        this.scrollToSlide(this.state.activeSlide + 1);
      }
    }
  };

  onScroll = e => {
    if (!this.props.snap) {
      return;
    }
    e.preventDefault();
    if (this.scrollPending) {
      return false;
    }

    const deltaY = Math.abs(e.deltaY);
    if (deltaY > this._wheel.lastDeltaY && !this._wheel.increasing) {
      this._wheel.increasing = true;
      this._isNewScrollAction = true;
    } else {
      this._isNewScrollAction = false;
      if (deltaY < this._wheel.lastDeltaY) {
        this._wheel.increasing = false;
      }
    }
    this._wheel.lastDeltaY = deltaY;

    if (!this._isNewScrollAction) {
      return;
    }

    const scrollDown = (e.wheelDelta || -e.deltaY || -e.detail) < 0;
    let activeSlide = this.state.activeSlide;

    if (scrollDown) {
      activeSlide++;
    } else {
      activeSlide--;
    }
    this.scrollToSlide(activeSlide);
  };

  scrollNext() {
    this.scrollToSlide(this.state.activeSlide + 1);
  }

  scrollPrev() {
    this.scrollToSlide(this.state.activeSlide - 1);
  }

  getSlidesCount() {
    return this.slidesCount;
  }

  getCurrentIndex() {
    return this.state.activeSlide;
  }

  render() {
    const controls = {
      scrollToSlide: this.scrollToSlide.bind(this),
      scrollNext: this.scrollNext.bind(this),
      scrollPrev: this.scrollPrev.bind(this),
      getSlidesCount: this.getSlidesCount.bind(this),
      getCurrentIndex: this.getCurrentIndex.bind(this)
    };

    return (
      <Provider {...controls}>
        <div
          className={this.props.className}
          ref={ref => (this.myRef = ref)}
          style={this.props.windowScroll ? { height: this.state.height } : { height: this.state.height, width: '100%', position: 'fixed', overflowY: 'scroll', top: this.props.offset }}
        >
          {this.props.children}
        </div>
      </Provider>
    );
  }
}

module.exports = FullPage;
