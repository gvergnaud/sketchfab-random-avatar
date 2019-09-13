const initBuffers = gl => {
  //Some Vertex Data
  // prettier-ignore
  var vertices = new Float32Array([
    -1.0, -1.0, 0.0,
    -1.0,  1.0, 0.0,
     1.0,  1.0, 0.0,
     1.0, -1.0, 0.0
  ])
  //Create A Buffer
  const vertexBuffer = gl.createBuffer()
  //Bind it to Array Buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  //Allocate Space on GPU
  gl.bufferData(gl.ARRAY_BUFFER, vertices.byteLength, gl.STATIC_DRAW)
  //Copy Data Over, passing in offset
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertices)
  //Some Index Data
  var indices = new Uint16Array([0, 1, 3, 2])
  //Create A Buffer
  const indexBuffer = gl.createBuffer()
  //Bind it to Element Array Buffer
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
  //Allocate Space on GPU
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices.byteLength, gl.STATIC_DRAW)
  //Copy Data Over, passing in offset
  gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, 0, indices)

  return { vertexBuffer, indexBuffer }
}

const createShader = (gl, type, shaderSource) => {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, shaderSource)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(`Shader Compilation Error : ${gl.getShaderInfoLog(shader)}`)
  }

  return shader
}

const createShaderProgram = (gl, vertexShader, fragShader) => {
  const shaderProgram = gl.createProgram()
  gl.attachShader(
    shaderProgram,
    createShader(gl, gl.VERTEX_SHADER, vertexShader),
  )
  gl.attachShader(
    shaderProgram,
    createShader(gl, gl.FRAGMENT_SHADER, fragShader),
  )
  gl.linkProgram(shaderProgram)
  gl.useProgram(shaderProgram)

  return shaderProgram
}

const bindUniform = (gl, location, uniform) => {
  switch (uniform.type) {
    case 'float':
      gl.uniform1f(location, uniform.value) // for float
      break
    case 'vec2':
      gl.uniform2fv(location, uniform.value) // for vec2 or vec2 array
      break

    case 'vec3':
      gl.uniform3fv(location, uniform.value) // for vec3 or vec3 array
      break

    case 'vec4':
      gl.uniform4fv(location, uniform.value) // for vec4 or vec4 array
      break

    case 'mat2':
      gl.uniformMatrix2fv(location, false, uniform.value) // for mat2 or mat2 array
      break

    case 'mat3':
      gl.uniformMatrix3fv(location, false, uniform.value) // for mat2 or mat2 array
      break

    case 'mat4':
      gl.uniformMatrix4fv(location, false, uniform.value) // for mat2 or mat2 array
      break
  }
}

const float = x => ({ type: 'float', value: x })
const vec2 = x => ({ type: 'vec2', value: x })
const vec3 = x => ({ type: 'vec3', value: x })
const vec4 = x => ({ type: 'vec4', value: x })
const mat2 = x => ({ type: 'mat2', value: x })
const mat3 = x => ({ type: 'mat3', value: x })
const mat4 = x => ({ type: 'mat4', value: x })

module.exports = {
  initBuffers,
  createShaderProgram,
  bindUniform,
  float,
  vec2,
  vec3,
  vec4,
  mat2,
  mat3,
  mat4,
}
