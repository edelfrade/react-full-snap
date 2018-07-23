import PropTypes from 'prop-types';
import React from 'react';

const Wrapper = props => {
  return (
    <div className={props.className} style={Object.assign({}, props.style, props.footerSlide ? { height: props.height, overflowY: 'scroll' } : { height: props.height, touchAction: 'none' })}>
      {props.children}
    </div>
  );
};
class Slide extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    style: PropTypes.object,
    footerSlide: PropTypes.bool,
    height: PropTypes.string
  };

  static defaultProps = {
    footerSlide: false,
    height: '100%',
    className: ''
  };

  render() {
    return (
      <Wrapper
        {...this.props}
        style={Object.assign({}, this.props.style, this.props.footerSlide ? { height: this.props.height, overflowY: 'scroll' } : { height: this.props.height, touchAction: 'none' })}
      >
        {this.props.children}
      </Wrapper>
    );
  }
}

module.exports = Slide;
