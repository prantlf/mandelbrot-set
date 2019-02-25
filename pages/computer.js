// See https://en.wikipedia.org/wiki/Mandelbrot_set.

// import { add, power2, absoluteValue } from './complex.js'
importScripts('./complex.js')

let maximumIterations

// Computes z := z^2 + c until |z| > 2. Returns the count of
// iterations run checking if the Mandelbrot set contains c.
function iterationsToLeaveMandelbrotSet (c) {
  let iterations = 1
  let z = { r: 0, i: 0 }
  // z = c
  // c = { r: 0.5, i: 0.5 }
  do {
    z = add(power2(z), c)
  } while (absoluteValue2(z) <= 4 && ++iterations < maximumIterations)
  return iterations
}

// Computes the count of interations to leave the Mandelbrot
// set for each complex number between [-2 - 2i] and [2 + 2i].
function computeIterations (width, height, { x: offsetX, y: offsetY }, scale) {
  // Count of all pixels to compute iterations for.
  const size = width * height
  const message = `Computing ${size} points.`
  console.time(message)
  const iterations = new Uint8Array(size)
  // Deltas to increment real and imaginary parts of the complex number by.
  // They lie between -2 and 2, which makes the width 4.
  const deltaR = 4 / width / scale
  const deltaI = 4 / height / scale
  // The computation starts at -2 and wwill continue to 2.
  const startR = -2 + offsetX
  let i = -2 + offsetY
  // Position of the beginning of the current row of pixels
  // in the result array of iterations for each pixel.
  let row = 0
  for (let y = 0; y < height; ++y) {
    // Start with the initial x-coordinate.
    let r = startR
    for (let x = 0; x < width; ++x) {
      iterations[row + x] = iterationsToLeaveMandelbrotSet({ r, i })
      // Advance to the next pixel to compute the iterations for.
      r += deltaR
    }
    // Advance to next rows in the graph and in the array of pixels.
    i += deltaI
    row += width
  }
  console.timeEnd(message)
  return iterations
}

function receiveRequest ({ data }) {
  ({ maximumIterations } = data)
  const { width, height, offset, scale } = data
  const iterations = computeIterations(width, height, offset, scale)
  postMessage(iterations.buffer, [ iterations.buffer ])
}

addEventListener('message', receiveRequest)
