import { hsl2rgb, hsv2rgb } from './color-space.js'

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

function fillHsvPalette (palette, colorCount, assignColor) {
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

  jewels (palette, colorCount) {
    const step = 256 / colorCount
    let intensity = 256
    for (let i = 0, length = palette.length; i < length; i += 3) {
      intensity -= step
      const rgb = (intensity * 0xffff / colorCount) * 0xff
      palette[i] = rgb & 0xff
      palette[i + 1] = (rgb >> 8) & 0xff
      palette[i + 2] = (rgb >> 16) & 0xff
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
  },

  sharp (palette, colorCount) {
    function assignColor (intensity) {
      return hsv2rgb(360 * intensity, 1, 1)
    }
    fillHsvPalette(palette, colorCount, assignColor)
  },

  onion (palette, colorCount) {
    function assignColor (intensity) {
      const [r, g, b] = hsv2rgb(360 * intensity, 1, 1)
      return [r, b, g]
    }
    fillHsvPalette(palette, colorCount, assignColor)
  },

  ocean (palette, colorCount) {
    function assignColor (intensity) {
      const [r, g, b] = hsv2rgb(360 * intensity, 1, 1)
      return [b, g, r]
    }
    fillHsvPalette(palette, colorCount, assignColor)
  },

  poison (palette, colorCount) {
    function assignColor (intensity) {
      const [r, g, b] = hsv2rgb(360 * intensity, 1, 1)
      return [b, r, g]
    }
    fillHsvPalette(palette, colorCount, assignColor)
  },

  garden (palette, colorCount) {
    function assignColor (intensity) {
      const [r, g, b] = hsv2rgb(360 * intensity, 1, 1)
      return [g, r, b]
    }
    fillHsvPalette(palette, colorCount, assignColor)
  },

  sky (palette, colorCount) {
    function assignColor (intensity) {
      const [r, g, b] = hsv2rgb(360 * intensity, 1, 1)
      return [g, b, r]
    }
    fillHsvPalette(palette, colorCount, assignColor)
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
