import { useState, useRef, useEffect } from 'react';
import dayjs from 'dayjs';

import { debounce } from 'constants/lodash';

export const useTextInput = (defaultValue = '') => {
  const [input, setInput] = useState(defaultValue);
  const onInput = e => setInput(e ? e.target.value : '');
  return [input, onInput];
};

export const usePrevious = value => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export const useResize = cb =>
  useEffect(() => {
    window.addEventListener('resize', cb);
    return () => window.removeEventListener('resize', cb);
  }, []);

export const useDimensions = () => {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  useResize(
    debounce(
      () =>
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        }),
      50,
    ),
  );
  return dimensions;
};

export const useDimensionConstraints = (minWidth, minHeight) => {
  const { width, height } = useDimensions();
  return width <= minWidth || height <= minHeight;
};

const requestAnimationFrame =
  window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame;

const cancelAnimationFrame =
  window.cancelAnimationFrame || window.mozCancelAnimationFrame;

export const useAnimation = cb =>
  useEffect(() => {
    let raf;
    let lastTime = 0;
    const loop = time => {
      cb({ time, delta: time - lastTime });
      raf = requestAnimationFrame(loop);
      lastTime = time;
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  });

export const useTimer = (startTime, cb, isDisabled) =>
  useEffect(() => {
    const timer = setInterval(() => {
      const diff = dayjs().diff(startTime);
      const formattedTime = dayjs(diff).format('mm:ss');
      if (!isDisabled) {
        cb(formattedTime);
      }
    }, 1000);
    return () => clearInterval(timer);
  });
