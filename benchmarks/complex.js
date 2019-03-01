const createSuite = require('./createSuite')
const size = 400
const maximumIterations = 20

function add ({ r: r1, i: i1 }, { r: r2, i: i2 }) {
  const r = r1 + r2
  const i = i1 + i2
  return { r, i }
}

function power2 ({ r: r1, i: i1 }) {
  const r = r1 * r1 - i1 * i1
  const i = 2 * r1 * i1
  return { r, i }
}

function absoluteValue2 ({ r, i }) {
  return r * r + i * i
}

function iterationsToLeaveMandelbrotSet1 (c) {
  let iterations = 1
  let z = { r: 0, i: 0 }
  do {
    z = add(power2(z), c)
  } while (absoluteValue2(z) <= 4 && ++iterations < maximumIterations)
}

function iterationsToLeaveMandelbrotSet2 (cr, ci) {
  let iterations = 1
  let zr = 0
  let zi = 0
  let zr2 = 0
  let zi2 = 0
  do {
    const z2r = zr2 - zi2
    const z2i = 2 * zr * zi
    zr = z2r + cr
    zi = z2i + ci
    zr2 = zr * zr
    zi2 = zi * zi
  } while (zr2 + zi2 <= 4 && ++iterations < maximumIterations)
}

function testObjects () {
  const deltaR = 4 / size
  const deltaI = 4 / size
  let i = -2
  for (let y = 0; y < size; ++y) {
    let r = -2
    for (let x = 0; x < size; ++x) {
      iterationsToLeaveMandelbrotSet1({ r, i })
      r += deltaR
    }
    i += deltaI
  }
}

function testNumbers () {
  const deltaR = 4 / size
  const deltaI = 4 / size
  let i = -2
  for (let y = 0; y < size; ++y) {
    let r = -2
    for (let x = 0; x < size; ++x) {
      iterationsToLeaveMandelbrotSet2(r, i)
      r += deltaR
    }
    i += deltaI
  }
}

createSuite('Comparing complex number handling...')
  .add('Use objects', testObjects)
  .add('Use numbers', testNumbers)
  .start()
