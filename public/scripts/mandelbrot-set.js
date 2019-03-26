import './julia-set-form.js'
import './julia-set-graph.js'
import './mandelbrot-set-form.js'
import './mandelbrot-set-graph.js'
import './mandelbrot-set-toolbar.js'
import { initializeElement } from './element-utils.js'

function createTemplate (type) {
  const template = document.createElement('template')
  template.innerHTML = `<style>
mandelbrot-set-toolbar {
  position: absolute;
  bottom: .5em;
  left: 0;
  width: 100%;
}
</style>
<dialog>
  <${type}-set-form></${type}-set-form>
</dialog>
<div style="position: relative; width: fit-content;">
  <${type}-set-graph></${type}-set-graph>
  <mandelbrot-set-toolbar></mandelbrot-set-toolbar>
</div>`
  return template
}

const templates = {
  julia: createTemplate('julia'),
  mandelbrot: createTemplate('mandelbrot')
}

function addEventListener (target, eventName, eventHandler) {
  target.eventHandler = eventHandler
  target.addEventListener(eventName, eventHandler)
}

function addEventListeners (element) {
  const toolbar = element.querySelector('mandelbrot-set-toolbar')
  const dialog = element.querySelector('dialog')
  const form = element.querySelector(`${element.type}-set-form`)

  if (dialog.showModal) {
    element.toolbar = toolbar
    element.form = form
    addEventListener(toolbar, 'open-settings', openSettingsDialog)
    addEventListener(form, 'submitted', closeSettingsDialog)
  }

  function closeSettingsDialog () {
    dialog.close()
  }

  function openSettingsDialog () {
    dialog.showModal()
  }
}

function removeEventListener (target, eventName) {
  target.removeEventListener(eventName, target.eventHandler)
}

function removeEventListeners (element) {
  const toolbar = element.toolbar
  if (toolbar) {
    removeEventListener(toolbar, 'open-settings')
    removeEventListener(element.form, 'submitted')
  }
}

const graphAttributes = [
  'palette', 'iteration-threshold', 'scale',
  'width', 'height', 'offset-x', 'offset-y', 'kr', 'ki'
]
const toolbarAttributes = [
  'panning', 'zooming', 'settings'
]

function propagateAttribute (target, attributeName) {
  const value = this.getAttribute(attributeName)
  if (value != null) {
    target.setAttribute(attributeName, value)
  }
}

function propagateAttributes (element, parent) {
  const graph = parent.querySelector(`${element.type}-set-graph`)
  graph.suppressUpdates()
  graphAttributes.forEach(propagateAttribute.bind(element, graph))
  graph.resumeUpdates()
  const form = parent.querySelector(`${element.type}-set-form`)
  form.bindGraph(graph)
  const toolbar = parent.querySelector('mandelbrot-set-toolbar')
  toolbar.bindGraph(graph)
  toolbarAttributes.forEach(propagateAttribute.bind(element, toolbar))
}

class MandelbrotSetElement extends HTMLElement {
  constructor () {
    super()
    const type = this.getAttribute('type') || 'mandelbrot'
    this.type = type
    const parent = initializeElement(this, templates[type])
    propagateAttributes(this, parent)
  }

  connectedCallback () {
    addEventListeners(this)
  }

  disconnectedCallback () {
    removeEventListeners(this)
  }
}

customElements.define('mandelbrot-set', MandelbrotSetElement)
