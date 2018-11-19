import { useState, useRef, useEffect } from 'react';

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

export const useAnimation = renderFunc =>
  useEffect(() => {
    let frameId;
    const animate = () => {
      renderFunc();
      frameId = window.requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, []);
