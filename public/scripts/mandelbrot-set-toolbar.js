import '../assets/bytesize-icon-elements.min.js'
import { initializeElement } from './element-utils.js'

const template = document.createElement('template')
template.innerHTML = `<bytesize-icon-defaults size="16" weight="bold"></bytesize-icon-defaults>
<div style="display: flex">
  <div data-name="panning" class="button-group">
    <button data-name="pan-up" type="button" title="Pan Up">
      <bytesize-icon name="arrow-top"></bytesize-icon>
    </button>
    <button data-name="pan-down" type="button" title="Pan Down">
      <bytesize-icon name="arrow-bottom"></bytesize-icon>
    </button>
    <button data-name="pan-left" type="button" title="Pan Left">
      <bytesize-icon name="arrow-left"></bytesize-icon>
    </button>
    <button data-name="pan-right" type="button" title="Pan Right">
      <bytesize-icon name="arrow-right"></bytesize-icon>
    </button>
  </div>
  <div data-name="zooming" class="button-group">
    <button data-name="zoom-in" type="button" title="Zoom In">
      <bytesize-icon name="plus"></bytesize-icon>
    </button>
    <button data-name="zoom-out" type="button" title="Zoom Out">
      <bytesize-icon name="minus"></bytesize-icon>
    </button>
    <button data-name="reset-zoom" type="button" title="Reset Zoom">
      <bytesize-icon name="move"></bytesize-icon>
    </button>
  </div>
</div>
<div data-name="settings" class="button-group" style="margin-left: auto">
  <button data-name="open-settings" type="button" title="Open Settings">
    <bytesize-icon name="settings"></bytesize-icon>
  </button>
</div>`

function panUp () {
  const graph = this.graph
  const offsetY = +(graph.getAttribute('offset-y') || 0)
  if (offsetY > 0) {
    const scale = +(graph.getAttribute('scale') || 1)
    graph.setAttribute('offset-y', offsetY - 0.5 / scale)
  }
}

function panDown () {
  const graph = this.graph
  const offsetY = +(graph.getAttribute('offset-y') || 0)
  if (offsetY < 2) {
    const scale = +(graph.getAttribute('scale') || 1)
    graph.setAttribute('offset-y', offsetY + 0.5 / scale)
  }
}

function panLeft () {
  const graph = this.graph
  const offsetX = +(graph.getAttribute('offset-x') || 0)
  if (offsetX > 0) {
    const scale = +(graph.getAttribute('scale') || 1)
    graph.setAttribute('offset-x', offsetX - 0.5 / scale)
  }
}

function panRight () {
  const graph = this.graph
  const offsetX = +(graph.getAttribute('offset-x') || 0)
  if (offsetX < 2) {
    const scale = +(graph.getAttribute('scale') || 1)
    graph.setAttribute('offset-x', offsetX + 0.5 / scale)
  }
}

function adaptTterationThreshold (graph, scale) {
  let iterationThreshold
  if (scale === 1) {
    iterationThreshold = 20
  } else if (scale < 50) {
    iterationThreshold = 20 + 8 * scale / 5
  } else {
    iterationThreshold = scale * 2
  }
  graph.setAttribute('iteration-threshold', iterationThreshold)
}

function zoomIn () {
  const graph = this.graph
  let scale = +(graph.getAttribute('scale') || 1)
  if (scale < 100) {
    graph.suppressUpdates()
    const offsetX = +(graph.getAttribute('offset-x') || 0)
    graph.setAttribute('offset-x', offsetX + 1 / scale)
    const offsetY = +(graph.getAttribute('offset-y') || 0)
    graph.setAttribute('offset-y', offsetY + 1 / scale)
    scale += scale === 1 ? 4 : 5
    graph.setAttribute('scale', scale)
    adaptTterationThreshold(graph, scale)
    graph.resumeUpdates()
  }
}

function zoomOut () {
  const graph = this.graph
  let scale = +(graph.getAttribute('scale') || 1)
  if (scale > 1) {
    scale -= scale === 5 ? 4 : 5
    graph.suppressUpdates()
    const offsetX = +(graph.getAttribute('offset-x') || 0)
    graph.setAttribute('offset-x', offsetX - 1 / scale)
    const offsetY = +(graph.getAttribute('offset-y') || 0)
    graph.setAttribute('offset-y', offsetY - 1 / scale)
    graph.setAttribute('scale', scale)
    adaptTterationThreshold(graph, scale)
    graph.resumeUpdates()
  }
}

function resetZoom () {
  const graph = this.graph
  graph.suppressUpdates()
  graph.setAttribute('scale', 1)
  graph.setAttribute('offset-x', 0)
  graph.setAttribute('offset-y', 0)
  adaptTterationThreshold(graph, 1)
  graph.resumeUpdates()
}

function openSettings () {
  const event = new CustomEvent('open-settings')
  this.dispatchEvent(event)
}

const buttonHandlers = {
  'pan-up': panUp,
  'pan-down': panDown,
  'pan-left': panLeft,
  'pan-right': panRight,
  'zoom-in': zoomIn,
  'zoom-out': zoomOut,
  'reset-zoom': resetZoom,
  'open-settings': openSettings
}
const buttonNames = Object.keys(buttonHandlers)

const buttonGroups = [
  'panning', 'zooming', 'settings'
]

function addEventListener (element, button, eventHandler) {
  const boundEventHandler = eventHandler.bind(element)
  button.clickHandler = boundEventHandler
  button.addEventListener('click', boundEventHandler)
}

function addEventListeners (element) {
  buttonNames.forEach(function (buttonName) {
    const button = this.querySelector(`[data-name=${buttonName}]`)
    addEventListener(element, button, buttonHandlers[buttonName])
  }, element.parent)
}

function removeEventListener (button) {
  button.removeEventListener('click', button.clickHandler)
}

function removeEventListeners (element) {
  buttonNames.forEach(function (buttonName) {
    const button = this.querySelector(`[data-name=${buttonName}]`)
    removeEventListener(button)
  }, element.parent)
}

function hideButtonGroup (element, groupName, flag) {
  if (flag === 'false') {
    const selector = `[data-name=${groupName}]`
    element.parent.querySelector(selector).style.display = 'none'
  }
}

function bindGraph (element, graph) {
  graph = document.getElementById(graph)
  element.bindGraph(graph)
}

class MandelbrotSetToolbarElement extends HTMLElement {
  constructor () {
    super()
    this.style.display = 'flex'
    const parent = initializeElement(this, template)
    this.parent = parent
    const graph = this.getAttribute('for')
    if (graph) {
      bindGraph(this, graph)
    }
  }

  connectedCallback () {
    addEventListeners(this)
  }

  disconnectedCallback () {
    removeEventListeners(this)
  }

  attributeChangedCallback (name, oldValue, newValue) {
    if (name === 'for') {
      bindGraph(this, newValue)
    } else if (buttonGroups.includes(name)) {
      hideButtonGroup(this, name, newValue)
    }
  }

  bindGraph (graph) {
    this.graph = graph
  }

  static get observedAttributes () {
    return buttonGroups
  }
}

customElements.define('mandelbrot-set-toolbar', MandelbrotSetToolbarElement)
