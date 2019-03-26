import { initializeElement, ensureUniqueFieldIds } from './element-utils.js'

const template = document.createElement('template')
template.innerHTML = `<style>
[data-id=palette] > label {
  min-width: 5em;
  display: inline-block;
}
</style>
<form>
  <fieldset data-id="palette">
    <legend>Colour palette</legend>
    <input data-id="palette-grayscale" type="radio" name="palette" checked>
    <label>Grayscale</label>
    <input data-id="palette-jewels" type="radio" name="palette">
    <label>Jewels</label>
    <input data-id="palette-fiery" type="radio" name="palette">
    <label>Fiery</label>
    <input data-id="palette-rainbow" type="radio" name="palette">
    <label>Rainbow</label>
    <input data-id="palette-sharp" type="radio" name="palette">
    <label>Sharp</label>
    <br>
    <input data-id="palette-onion" type="radio" name="palette">
    <label>Onion</label>
    <input data-id="palette-ocean" type="radio" name="palette">
    <label>Ocean</label>
    <input data-id="palette-poison" type="radio" name="palette">
    <label>Poison</label>
    <input data-id="palette-garden" type="radio" name="palette">
    <label>Garden</label>
    <input data-id="palette-sky" type="radio" name="palette">
    <label>Sky</label>
  </fieldset>
  <fieldset>
    <legend>Resolution</legend>
    <label>Maximum iterations:</label>
    <input data-id="iteration-threshold" type="number" value="20">
    <label>Scale:</label>
    <input data-id="scale" type="number" value="1" step="any">
  </fieldset>
  <fieldset>
    <legend>Canvas size [px]</legend>
    <label>Width:</label>
    <input data-id="width" type="number" value="400">
    <label>Height:</label>
    <input data-id="height" type="number" value="400">
  </fieldset>
  <fieldset>
    <legend>Offset from the top-left corner [px]</legend>
    <label>X:</label>
    <input data-id="offset-x" type="number" value="0" step="any">
    <label>Y:</label>
    <input data-id="offset-y" type="number" value="0" step="any">
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

function bindGraph (element, graph) {
  graph = document.getElementById(graph)
  element.bindGraph(graph)
}

const fields = [
  'iteration-threshold', 'scale', 'width', 'height', 'offset-x', 'offset-y',
  'palette-grayscale', 'palette-jewels', 'palette-fiery', 'palette-rainbow', 'palette-sharp',
  'palette-onion', 'palette-ocean', 'palette-poison', 'palette-garden', 'palette-sky'
]

class SetFormElement extends HTMLElement {
  constructor () {
    super()
    const parent = initializeElement(this, template)
    this.parent = parent
    const form = parent.lastElementChild
    this.form = form
    this.fields = ensureUniqueFieldIds(form, fields)
    const graph = this.getAttribute('for')
    if (graph) {
      bindGraph(this, graph)
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

  attributeChangedCallback (name, oldValue, newValue) {
    if (name === 'for') {
      bindGraph(this, newValue)
    }
  }

  bindGraph (graph) {
    this.graph = graph
    if (this.applyThisSettings) {
      if (this.observer) {
        removeGraphObserver(this)
      }
      addGraphObserver(this)
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
    const fields = this.fields
    const palette = form
      .querySelector('input[name="palette"]:checked')
      .getAttribute('data-id')
      .substr(8)
    const iterationThreshold = +fields['iteration-threshold'].value
    const scale = +fields['scale'].value
    const width = +fields['width'].value
    const height = +fields['height'].value
    const offsetX = +fields['offset-x'].value
    const offsetY = +fields['offset-y'].value
    return { palette, iterationThreshold, scale, width, height, offsetX, offsetY }
  }

  setParameters ({ palette, iterationThreshold, scale, width, height, offsetX, offsetY }) {
    const form = this.form
    const fields = this.fields
    form.querySelector(`[data-id=palette-${palette}]`).checked = true
    fields['iteration-threshold'].value = iterationThreshold
    fields['scale'].value = scale
    fields['width'].value = width
    fields['height'].value = height
    fields['offset-x'].value = offsetX
    fields['offset-y'].value = offsetY
  }
}

export { SetFormElement }
