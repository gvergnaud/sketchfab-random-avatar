const { curry, pipe } = require('ramda')
const createGl = require('gl')
const {
  initBuffers,
  createShaderProgram,
  bindUniform,
  float,
  vec2,
} = require('./utils/webgl')
const triangles = require('./shaders/triangles')

const width = 500
const height = 500

const getPixels = curry((width, height, gl) => {
  const pixels = new Uint8Array(width * height * 4)
  gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels)
  return pixels
})

const outputPPM = curry((width, height, pixels) => {
  process.stdout.write(
    ['P3\n# gl.ppm\n', width, ' ', height, '\n255\n'].join(''),
  )
  for (let i = 0; i < pixels.length; i += 4) {
    for (let j = 0; j < 3; ++j) {
      process.stdout.write(pixels[i + j] + ' ')
    }
  }
})

const renderFragmentShader = (fragmentShader, uniforms, gl) => {
  const vertexShader = `
    #ifdef GL_ES
    precision lowp float;
    #endif
    attribute vec3 position;

    void main(void) {
      gl_Position = vec4(position, 1.0);
    }
  `

  const program = createShaderProgram(gl, vertexShader, fragmentShader)

  const { vertexBuffer, indexBuffer } = initBuffers(gl)

  //Enable Position Attribute
  const positionLocation = gl.getAttribLocation(program, 'position')
  gl.enableVertexAttribArray(positionLocation)
  //Bind Vertex Buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  ///Point to Attribute (loc, size, datatype, normalize, stride, offset)
  gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0)
  //Bind Index Buffer
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)

  // uniforms

  const newUniforms = {
    u_time: float(Math.random() * 1000),
    u_resolution: vec2([width, height]),
    ...uniforms,
  }

  for (const [key, value] of Object.entries(newUniforms)) {
    bindUniform(gl, gl.getUniformLocation(program, key), value)
  }

  gl.drawElements(gl.TRIANGLE_STRIP, 4, gl.UNSIGNED_SHORT, 0)

  return gl
}

const render = gl => {
  return renderFragmentShader(triangles.fragmentShader, triangles.uniforms, gl)
}

const main = pipe(
  render,
  getPixels(width, height),
  outputPPM(width, height),
)

main(createGl(width, height, { preserveDrawingBuffer: true }))
