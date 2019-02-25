// Operations on complex numbers. A complex number is represented
// by an object with real and imaginary parts as keys: { r, i }.

function equal ({ r: r1, i: i1 }, { r: r2, i: i2 }) {
  return r1 === r2 && i1 === i2
}

function add ({ r: r1, i: i1 }, { r: r2, i: i2 }) {
  const r = r1 + r2
  const i = i1 + i2
  return { r, i }
}

function multiply ({ r: r1, i: i1 }, { r: r2, i: i2 }) {
  const r = r1 * r2 - i1 * i2
  const i = r1 * i2 + i1 * r2
  return { r, i }
}

function power2 ({ r: r1, i: i1 }) {
  const r = r1 * r1 - i1 * i1
  const i = 2 * r1 * i1
  return { r, i }
}

function absoluteValue ({ r, i }) {
  return Math.sqrt(r * r + i * i)
}

function absoluteValue2 ({ r, i }) {
  return r * r + i * i
}

// export { equal, add, multiply, power2, absoluteValue, absoluteValue2 }
