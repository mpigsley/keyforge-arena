export default ({ ctx, width, height, ratio }) => {
  ctx.fillStyle = 'red';
  ctx.fillRect(0, 0, width * ratio, height * ratio);
};
