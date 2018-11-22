exports.generateTag = () =>
  [...Array(4)].map(() => Math.floor(Math.random() * 10)).join('');
