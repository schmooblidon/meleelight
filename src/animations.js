// To make this as performant as possible, we'll be using webpack's `require`
// and `module.exports` rather than loading this all through babel and using
// its `import` and `export` statements.
const marth = require("./animations/marth");
const puff = require("./animations/puff");
const fox = require("./animations/fox");
const falco = require("./animations/falco");

window.animations = [
  marth,
  puff,
  fox,
  falco
];
