import React from 'react';
import { FullPage, Slide, withControls } from '../src';

const Controls = withControls(controls => {
  const { scrollToSlide, scrollNext, scrollPrev, getSlidesCount, getCurrentIndex } = controls;
  const totalSlides = getSlidesCount();
  const activeSlide = getCurrentIndex();
  const dots = [];

  for (let i = 0; i < totalSlides; i++) {
    dots.push(
      <button key={i} disabled={activeSlide === i} onClick={() => scrollToSlide(i)}>
        {i + 1}
      </button>
    );
  }

  return (
    <div style={{ position: 'fixed' }}>
      <button disabled={activeSlide === 0} onClick={scrollPrev}>
        ←
      </button>
      {dots}
      <button disabled={activeSlide === totalSlides - 1} onClick={scrollNext}>
        →
      </button>
    </div>
  );
});
class FullPageExample extends React.Component {
  render() {
    return (
      <FullPage className={'my-container'} containerHeight={window.innerHeight - 70} snap={true} windowScroll={false}>
        <Controls />
        <Slide height={`100%`} style={{ background: '#2ECC40', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <h1>1</h1>
        </Slide>
        <Slide style={{ background: '#0074D9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <h1>2</h1>
        </Slide>
        <Slide style={{ background: '#d52685', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <h1>3</h1>
        </Slide>
        <Slide height={'70px'} footerSlide style={{ background: '#00c4ff', padding: '20px 0' }}>
          <h1>4</h1>
          <p>Lorem </p>
          <p>Lorem </p>
          <p>Lorem </p>
          <p>Lorem </p>
        </Slide>
      </FullPage>
    );
  }
}

module.exports = FullPageExample;
