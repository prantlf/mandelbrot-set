// See https://en.wikipedia.org/wiki/HSL_color_space
// and https://en.wikipedia.org/wiki/HSL_and_HSV.

function hsl2rgb (h, s, l) {
  let r, g, b
  if (s === 0) {
    r = g = b = l
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  return [ r * 255, g * 255, b * 255 ]

  function hue2rgb (p, q, t) {
    if (t < 0) {
      t += 1
    } else if (t > 1) {
      t -= 1
    }
    if (t < 1 / 6) {
      return p + (q - p) * 6 * t
    }
    if (t < 1 / 2) {
      return q
    }
    if (t < 2 / 3) {
      return p + (q - p) * (2 / 3 - t) * 6
    }
    return p
  }
}

function hsv2rgb (h, s, v) {
  if (v > 1) {
    v = 1
  }
  const hp = h / 60
  const c = v * s
  const x = c * (1 - Math.abs((hp % 2) - 1))
  let r, g, b

  if (hp < 0) {
    r = b = g = 0
  } else if (hp < 1) {
    r = c
    g = x
    b = 0
  } else if (hp < 2) {
    r = x
    g = c
    b = 0
  } else if (hp < 3) {
    r = 0
    g = c
    b = x
  } else if (hp < 4) {
    r = 0
    g = x
    b = c
  } else if (hp < 5) {
    r = x
    g = 0
    b = c
  } else if (hp < 6) {
    r = c
    g = 0
    b = x
  } else {
    r = 0
    g = 0
    b = 0
  }

  const m = v - c
  r = (r + m) * 255
  g = (g + m) * 255
  b = (b + m) * 255

  return [ r, g, b ]
}

export { hsl2rgb, hsv2rgb }
