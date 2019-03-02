/* global addEventListener, Worker */

import { hsl2rgb } from './colours.js'

let maximumIterations
let colour
let size
let width
let height
let offset
let scale
let palette
let context

function getElement (id) {
  return document.getElementById(id)
}

function renderGraph (iterations) {
  const message = `Rendering ${width * height} pixels.`
  console.time(message)
  const image = context.createImageData(width, height)
  const data = image.data
  let row = 0
  for (let y = 0; y < height; ++y) {
    for (let x = 0; x < width; ++x) {
      const pixel = (row + x) * 4
      const count = iterations[row + x]
      const [ r, g, b ] = palette[count]
      data[pixel] = r
      data[pixel + 1] = g
      data[pixel + 2] = b
      data[pixel + 3] = 255
    }
    row += width
  }
  context.putImageData(image, 0, 0)
  console.timeEnd(message)
}

function receiveGraph ({ data }) {
  const iterations = new Uint8Array(data)
  renderGraph(iterations)
}

function generatePalette () {
  const message = `Generating palette of ${maximumIterations} colours.`
  console.time(message)
  palette = new Array(maximumIterations)
  if (colour === 'grayscale') {
    const step = 256 / maximumIterations
    let intensity = 255
    for (let iteration = 1; iteration <= maximumIterations; ++iteration) {
      const wholeIntensity = Math.floor(intensity -= step)
      palette[iteration] = [ wholeIntensity, wholeIntensity, wholeIntensity ]
    }
  } else {
    const step = 1 / maximumIterations
    let intensity = 1
    const rgb = colour === 'fiery'
      ? function () {
        return hsl2rgb(0, 1, intensity)
      }
      : function () {
        return hsl2rgb(intensity, 0.5, 0.5)
      }
    for (let iteration = 1; iteration <= maximumIterations; ++iteration) {
      intensity -= step
      const [ r, g, b ] = rgb()
      palette[iteration] = [ Math.floor(r), Math.floor(g), Math.floor(b) ]
    }
  }
  console.timeEnd(message)
}

const computer = new Worker('./computer.js')
computer.addEventListener('message', receiveGraph)

class Renderer {
  getParameters () {
    return { maximumIterations, width, height, offset, scale }
  }

  requestGraph () {
    const parameters = this.getParameters()
    computer.postMessage(parameters)
  }

  readSettings () {
    colour = document.querySelector('input[name="colour"]:checked').id.substr(7)
    size = +getElement('size').value
    maximumIterations = +getElement('iterations').value
    const x = +getElement('offset-x').value
    const y = +getElement('offset-y').value
    offset = { x, y }
    scale = +getElement('scale').value
  }

  prepareCanvas () {
    const canvas = getElement('graph')
    canvas.style.width = canvas.style.height = `${size}px`
    context = canvas.getContext('2d', { alpha: false })
    width = context.canvas.width
    height = context.canvas.height
    context.clearRect(0, 0, width, height)
  }

  refreshGraph () {
    this.readSettings()
    this.prepareCanvas()
    generatePalette()
    this.requestGraph()
  }

  applySettings (event) {
    event.preventDefault()
    this.refreshGraph()
  }

  importTemplate () {
    const link = document.querySelector('link[rel="import"]')
    const content = link.import.getElementById('main')
    const script = document.body.querySelector('script')
    document.body.insertBefore(content, script)
  }

  initializePage () {
    this.importTemplate()
    const form = getElement('settings')
    form.addEventListener('submit', this.applySettings.bind(this))
    this.refreshGraph()
  }

  initialize () {
    addEventListener('DOMContentLoaded', this.initializePage.bind(this))
  }
}

export { Renderer, getElement }
