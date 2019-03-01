// See https://en.wikipedia.org/wiki/Mandelbrot_set.

/* global addEventListener, postMessage */

let maximumIterations

// Computes z := z^2 + c until |z| > 2. Returns the count of
// iterations run checking if the Mandelbrot set contains c.
function iterationsToLeaveMandelbrotSet (cr, ci) {
  let iterations = 1
  // Complex number z to compute recursively
  let zr = 0
  let zi = 0
  // Local variables to store parts of the computation of z^2,
  // so that they cxan be reused for the computation of |z|.
  // They are zr^2 and zi^2.
  let zr2 = 0
  let zi2 = 0
  do {
    // Compute z^2 := (zr * zr - zi * zi) + (2 * zr * zi)i
    const z2r = zr2 - zi2
    const z2i = 2 * zr * zi
    // Compute the new z := z^2 + c
    zr = z2r + cr
    zi = z2i + ci
    // Store square powers of zr and zi to compute |z| and z^2
    zr2 = zr * zr
    zi2 = zi * zi
    // Check the condition of Mandelbrot set |z| <= 2 more
    // efficiently by comaring z^2 <= 4.
  } while (zr2 + zi2 <= 4 && ++iterations < maximumIterations)
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
      iterations[row + x] = iterationsToLeaveMandelbrotSet(r, i)
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
