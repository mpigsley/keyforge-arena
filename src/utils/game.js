export default ({ ctx, width, height, ratio }, { hasLoaded }) => {
  ctx.fillStyle = hasLoaded ? 'blue' : 'red';
  ctx.fillRect(0, 0, width * ratio, height * ratio);
};
