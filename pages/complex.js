// Operations on complex numbers. A complex number is represented
// by an object with real and imaginary parts as keys: { r, i }.

// eslint-disable-next-line no-unused-vars
function add ({ r: r1, i: i1 }, { r: r2, i: i2 }) {
  const r = r1 + r2
  const i = i1 + i2
  return { r, i }
}

// eslint-disable-next-line no-unused-vars
function power2 ({ r: r1, i: i1 }) {
  const r = r1 * r1 - i1 * i1
  const i = 2 * r1 * i1
  return { r, i }
}

// eslint-disable-next-line no-unused-vars
function absoluteValue2 ({ r, i }) {
  return r * r + i * i
}
