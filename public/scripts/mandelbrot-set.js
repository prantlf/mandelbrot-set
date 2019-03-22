import './julia-set-form.js'
import './julia-set-graph.js'
import './mandelbrot-set-form.js'
import './mandelbrot-set-graph.js'
import './mandelbrot-set-toolbar.js'
import { initializeElement } from './element-utils.js'

function createTemplate (type) {
  const template = document.createElement('template')
  template.innerHTML = `<style>
#toolbar {
  position: absolute;
  bottom: .5em;
  left: 0;
  width: 100%;
}
</style>
<dialog id="settings-dialog">
  <${type}-set-form id="settings" for="graph"></${type}-set-form>
</dialog>
<div style="position: relative; width: fit-content;">
  <${type}-set-graph id="graph"></${type}-set-graph>
  <mandelbrot-set-toolbar id="toolbar" for="graph"></mandelbrot-set-toolbar>
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
  const toolbar = element.querySelector('#toolbar')
  const dialog = element.querySelector('#settings-dialog')
  const form = element.querySelector('#settings')

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

class MandelbrotSetElement extends HTMLElement {
  constructor () {
    super()
    const type = this.getAttribute('type') || 'mandelbrot'
    initializeElement(this, templates[type])
  }

  connectedCallback () {
    addEventListeners(this)
  }

  disconnectedCallback () {
    removeEventListeners(this)
  }
}

customElements.define('mandelbrot-set', MandelbrotSetElement)
