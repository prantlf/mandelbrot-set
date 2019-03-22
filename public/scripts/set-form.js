import { initializeElement } from './element-utils.js'

const template = document.createElement('template')
template.innerHTML = `<form>
  <label for="iteration-threshold">Maximum iterations:</label>
  <input id="iteration-threshold" type="number" value="20">
  <fieldset>
    <legend>Colour palette</legend>
    <input id="palette-grayscale" type="radio" name="palette" checked>
    <label for="palette-grayscale">Grayscale</label>
    <input id="palette-jewels" type="radio" name="palette">
    <label for="palette-jewels">Jewels</label>
    <input id="palette-fiery" type="radio" name="palette">
    <label for="palette-fiery">Fiery</label>
    <input id="palette-rainbow" type="radio" name="palette">
    <label for="palette-rainbow">Rainbow</label>
    <input id="palette-sharp" type="radio" name="palette">
    <label for="palette-sharp">Sharp</label>
    <br>
    <input id="palette-onion" type="radio" name="palette">
    <label for="palette-onion">Onion</label>
    <input id="palette-ocean" type="radio" name="palette">
    <label for="palette-ocean">Ocean</label>
    <input id="palette-poison" type="radio" name="palette">
    <label for="palette-poison">Poison</label>
    <input id="palette-garden" type="radio" name="palette">
    <label for="palette-garden">Garden</label>
    <input id="palette-sky" type="radio" name="palette">
    <label for="palette-sky">Sky</label>
  </fieldset>
  <label for="size">Size [px]:</label>
  <input id="size" type="number" value="400">
  <label for="scale">Scale:</label>
  <input id="scale" type="number" value="1" step="any">
  <fieldset>
    <legend>Offset from the top-left corner [px]</legend>
    <label for="offset-x">X:</label>
    <input id="offset-x" type="number" value="0" step="any">
    <label for="offset-y">Y:</label>
    <input id="offset-y" type="number" value="0" step="any">
  </fieldset>
  <button type="submit" class="button">Apply</button>
</form>`

function applySettings (event) {
  event.preventDefault()
  if (this.graph) {
    this.saveParameters()
    event = new CustomEvent('submitted')
  } else {
    event = new CustomEvent('submit')
  }
  this.dispatchEvent(event)
}

function addFormListener (element) {
  const applyThisSettings = applySettings.bind(element)
  element.applyThisSettings = applyThisSettings
  element.form.addEventListener('submit', applyThisSettings)
}

function removeFormListener (element) {
  element.form.removeEventListener('submit', element.applyThisSettings)
}

function addGraphObserver (element) {
  const observer = new MutationObserver(function () {
    element.loadParameters()
  })
  observer.observe(element.graph, { attributes: true })
  element.observer = observer
}

function removeGraphObserver (element) {
  element.observer.disconnect()
}

class SetFormElement extends HTMLElement {
  constructor () {
    super()
    const parent = initializeElement(this, template)
    this.form = parent.lastElementChild
    const graph = this.getAttribute('for')
    if (graph) {
      this.graph = document.getElementById(graph)
    }
  }

  connectedCallback () {
    addFormListener(this)
    if (this.graph) {
      addGraphObserver(this)
    }
  }

  disconnectedCallback () {
    removeFormListener(this)
    if (this.graph) {
      removeGraphObserver(this)
    }
  }

  loadParameters () {
    const parameters = this.graph.getParameters()
    this.setParameters(parameters)
  }

  saveParameters () {
    const parameters = this.getParameters()
    const graph = this.graph
    graph.suppressUpdates()
    graph.setParameters(parameters)
    graph.resumeUpdates()
  }

  getParameters () {
    const form = this.form
    const palette = form.querySelector('input[name="palette"]:checked').id.substr(8)
    const size = +form.querySelector('#size').value
    const iterationThreshold = +form.querySelector('#iteration-threshold').value
    const offsetX = +form.querySelector('#offset-x').value
    const offsetY = +form.querySelector('#offset-y').value
    const scale = +form.querySelector('#scale').value
    return { palette, iterationThreshold, size, offsetX, offsetY, scale }
  }

  setParameters ({ palette, iterationThreshold, size, offsetX, offsetY, scale }) {
    const form = this.form
    form.querySelector(`#palette-${palette}`).checked = true
    form.querySelector('#size').value = size
    form.querySelector('#iteration-threshold').value = iterationThreshold
    form.querySelector('#offset-x').value = offsetX
    form.querySelector('#offset-y').value = offsetY
    form.querySelector('#scale').value = scale
  }
}

export { SetFormElement }
