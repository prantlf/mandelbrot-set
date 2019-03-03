import { hsl2rgb } from './color-space.js'

function fillHslPalette (palette, colorCount, assignColor) {
  const step = 1 / colorCount
  let intensity = 1
  for (let i = 0, length = palette.length; i < length; i += 3) {
    intensity -= step
    const [ r, g, b ] = assignColor(intensity)
    palette[i] = Math.floor(r)
    palette[i + 1] = Math.floor(g)
    palette[i + 2] = Math.floor(b)
  }
}

const paletteGenerators = {
  grayscale (palette, colorCount) {
    const step = 256 / colorCount
    let intensity = 256
    for (let i = 0, length = palette.length; i < length; i += 3) {
      intensity -= step
      palette[i] = palette[i + 1] = palette[i + 2] = Math.floor(intensity)
    }
  },

  fiery (palette, colorCount) {
    function assignColor (intensity) {
      return hsl2rgb(0, 1, intensity)
    }
    fillHslPalette(palette, colorCount, assignColor)
  },

  rainbow (palette, colorCount) {
    function assignColor (intensity) {
      return hsl2rgb(intensity, 0.5, 0.5)
    }
    fillHslPalette(palette, colorCount, assignColor)
  }
}

function generatePalette ({ paletteType, colorCount }) {
  const message = `Generating palette of ${colorCount} colours`
  console.time(message)
  const length = colorCount * 3
  const palette = new Array(length)
  paletteGenerators[paletteType](palette, colorCount)
  console.timeEnd(message)
  return palette
}

export { generatePalette }
