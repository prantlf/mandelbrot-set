// See https://en.wikipedia.org/wiki/Mandelbrot_set.

// Computes z := z^2 + c until |z| > 2. Returns the count of
// iterations run checking if the Mandelbrot set contains c,
// when z starts as [0 + 0i] and c is a complex number.
function iterationsToEscapeMandelbrotSet (iterationThreshold, cr, ci) {
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
  } while (zr2 + zi2 <= 4 && ++iterations < iterationThreshold)
  return iterations
}

// Computes z := z^2 + c until |z| > 2. Returns the count of
// iterations run checking if the Julia set for k contains z,
// when z is a complex number.
function iterationsToEscapeJuliaSet (iterationThreshold, zr, zi, kr, ki) {
  let iterations = 1
  // Local variables to store parts of the computation of z^2,
  // so that they cxan be reused for the computation of |z|.
  // They are zr^2 and zi^2.
  let zr2 = zr * zr
  let zi2 = zi * zi
  do {
    // Compute z^2 := (zr * zr - zi * zi) + (2 * zr * zi)i
    const z2r = zr2 - zi2
    const z2i = 2 * zr * zi
    // Compute the new z := z^2 + k
    zr = z2r + kr
    zi = z2i + ki
    // Store square powers of zr and zi to compute |z| and z^2
    zr2 = zr * zr
    zi2 = zi * zi
    // Check the condition of Julia set |z| <= 2 more
    // efficiently by comaring z^2 <= 4.
  } while (zr2 + zi2 <= 4 && ++iterations < iterationThreshold)
  return iterations
}

// Computes the count of interations to escape a Julia or the Mandelbrot
// set for each complex number between [-2 - 2i] and [2 + 2i].
function computeIterations ({ iterationThreshold, width, height, offsetX, offsetY, scale, type, kr, ki }) {
  // Count of all pixels to compute iterations for.
  const size = width * height
  const message = `Computing ${size} points`
  console.time(message)
  const iterations = new Uint8Array(size)
  // Deltas to increment real and imaginary parts of the complex number by.
  // They lie between -2 and 2, which makes the width 4.
  const deltaR = 4 / width / scale
  const deltaI = 4 / height / scale
  // The computation starts at -2 and will continue to 2.
  const startR = -2 + offsetX
  let r
  let i = -2 + offsetY
  // Position of the beginning of the current row of pixels
  // in the result array of iterations for each pixel.
  let row = 0
  const iterationsToEscapeSet = type === 'mandelbrot'
    ? iterationsToEscapeMandelbrotSet : iterationsToEscapeJuliaSet
  for (let y = 0; y < height; ++y) {
    // Start with the initial x-coordinate.
    r = startR
    for (let x = 0; x < width; ++x) {
      iterations[row + x] = iterationsToEscapeSet(iterationThreshold, r, i, kr, ki)
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
  const { number } = data
  const iterations = computeIterations(data)
  const buffer = iterations.buffer
  postMessage({ number, buffer }, [ buffer ])
}

addEventListener('message', receiveRequest)
