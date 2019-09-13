const fs = require('fs')
const path = require('path')
const { vec4 } = require('../../utils/webgl')

const getRandomItem = xs => xs[Math.floor(Math.random() * xs.length)]

const hexToRgb = hex => {
  var result = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i)
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
        255,
      ]
    : null
}

const color404 = [
  '#071b25',
  '#c5e4ed',
  '#e1f1f6',
  '#85c7d8',
  '#299cba',
  '#0e3548',
  '#0e3548',
  '#144e69',
  '#185c7e',
  '#185c7e',
]
  .map(hexToRgb)
  .map(vec4)

module.exports = {
  fragmentShader: fs.readFileSync(
    path.join(__dirname, './triangles.glsl'),
    'utf8',
  ),
  uniforms: {
    u_color1: getRandomItem(color404),
    u_color2: getRandomItem(color404),
    // u_color1: getRandomItem([
    //   vec4(hexToRgb('3a1f5d')),
    //   vec4(hexToRgb('c83660')),
    //   vec4(hexToRgb('e15249')),
    //   vec4([20, 170, 217, 255]), // skfbblue
    // ]),
    // u_color2: getRandomItem([
    //   vec4(hexToRgb('3a1f5d')),
    //   vec4(hexToRgb('c83660')),
    //   vec4(hexToRgb('e15249')),
    //   vec4([20, 170, 217, 255]), // skfbblue
    // ]),
  },
}
