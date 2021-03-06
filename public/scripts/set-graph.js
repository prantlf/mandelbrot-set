import { generatePalette } from './palette.js'
import { getComputerUrl } from './mandelbrot-set-computer.js'

const computerUrl = getComputerUrl()
const computer = new Worker(computerUrl)

let counter = 0

function refreshPalette () {
  const { iterationThreshold, palette } = this.parameters
  this.palette = generatePalette({
    paletteType: palette,
    colorCount: iterationThreshold
  })
}

function renderGraph (iterations) {
  const { context, palette } = this
  const { width, height } = this.parameters
  const message = `Rendering ${width * height} pixels`
  console.time(message)
  const image = context.createImageData(width, height)
  const data = image.data
  let row = 0
  for (let y = 0; y < height; ++y) {
    for (let x = 0; x < width; ++x) {
      const pixel = (row + x) * 4
      const count = iterations[row + x]
      const index = (count - 1) * 3
      data[pixel] = palette[index]
      data[pixel + 1] = palette[index + 1]
      data[pixel + 2] = palette[index + 2]
      data[pixel + 3] = 255
    }
    row += width
  }
  context.putImageData(image, 0, 0)
  console.timeEnd(message)
}

function receiveGraph ({ data }) {
  const { number, buffer } = data
  if (number === this.number) {
    const iterations = new Uint8Array(buffer)
    renderGraph.call(this, iterations)
  }
}

function requestGraph () {
  computer.postMessage(this.parameters)
}

function readParameters () {
  const parameters = this.getParameters()
  parameters.number = this.number
  parameters.type = this.type
  this.parameters = parameters
}

function createCanvas () {
  const canvas = document.createElement('canvas')
  const width = this.getAttribute('width') || 400
  const height = this.getAttribute('height') || 400
  canvas.setAttribute('width', width)
  canvas.setAttribute('height', height)
  this.canvas = canvas
  this.context = canvas.getContext('2d', { alpha: false })
}

function clearCanvas () {
  const { width, height } = this.parameters
  this.context.clearRect(0, 0, width, height)
}

const attributeToParameter = {
  palette: 'palette',
  'iteration-threshold': 'iterationThreshold',
  scale: 'scale',
  width: 'width',
  height: 'height',
  'offset-x': 'offsetX',
  'offset-y': 'offsetY'
}

class SetGraphElement extends HTMLElement {
  constructor (type) {
    super()
    this.type = type
    this.number = ++counter
    createCanvas.call(this)
    const shadow = this.attachShadow({ mode: 'open' })
    shadow.appendChild(this.canvas)
    this.updatesEnabled = true
  }

  connectedCallback () {
    this.receiveThisGraph = receiveGraph.bind(this)
    computer.addEventListener('message', this.receiveThisGraph)
    readParameters.call(this)
    clearCanvas.call(this)
    if (this.getAttribute('auto-render') !== 'false') {
      refreshPalette.call(this)
      requestGraph.call(this)
    }
  }

  disconnectedCallback () {
    computer.removeEventListener('message', this.receiveThisGraph)
  }

  attributeChangedCallback (name, oldValue, newValue) {
    const parameters = this.parameters
    if (parameters) {
      const parameter = attributeToParameter[name]
      if (parameter && parameters[parameter].toString() !== newValue.toString()) {
        if (name === 'width' || name === 'height') {
          this.canvas.setAttribute(name, newValue)
        }
        if (this.updatesEnabled) {
          this.render()
        } else {
          this.updatesPending = true
        }
      }
    }
  }

  getParameters () {
    const palette = this.getAttribute('palette') || 'grayscale'
    const iterationThreshold = +(this.getAttribute('iteration-threshold') || 20)
    const scale = +(this.getAttribute('scale') || 1)
    const width = +(this.getAttribute('width') || 400)
    const height = +(this.getAttribute('height') || 400)
    const offsetX = +(this.getAttribute('offset-x') || 0)
    const offsetY = +(this.getAttribute('offset-y') || 0)
    return { palette, iterationThreshold, scale, width, height, offsetX, offsetY }
  }

  setParameters ({ palette, iterationThreshold, scale, width, height, offsetX, offsetY }) {
    this.setAttribute('palette', palette)
    this.setAttribute('width', width)
    this.setAttribute('height', height)
    this.setAttribute('iteration-threshold', iterationThreshold)
    this.setAttribute('offset-x', offsetX)
    this.setAttribute('offset-y', offsetY)
    this.setAttribute('scale', scale)
  }

  render () {
    readParameters.call(this)
    refreshPalette.call(this)
    requestGraph.call(this)
  }

  suppressUpdates () {
    this.updatesEnabled = false
  }

  resumeUpdates () {
    if (this.updatesPending) {
      this.render()
      this.updatesPending = false
    }
    this.updatesEnabled = true
  }
}

const observedAttributes = [
  'palette', 'iteration-threshold', 'scale',
  'width', 'height', 'offset-x', 'offset-y'
]

export { SetGraphElement, observedAttributes }
