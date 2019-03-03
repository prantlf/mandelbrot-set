/* global CustomEvent, HTMLElement */

const template = document.createElement('template')
template.innerHTML = `<form>
    <label for="iteration-threshold">Maximum iterations:</label>
    <input id="iteration-threshold" type="number" value="20">
    <fieldset>
      <legend>Colour palette</legend>
      <input id="palette-grayscale" type="radio" name="palette" checked>
      <label for="palette-grayscale">Grayscale</label>
      <input id="palette-fiery" type="radio" name="palette">
      <label for="palette-fiery">Fiery</label>
      <input id="palette-rainbow" type="radio" name="palette">
      <label for="palette-rainbow">Rainbow</label>
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
  event = new CustomEvent('submit')
  this.dispatchEvent(event)
}

class SetFormElement extends HTMLElement {
  constructor () {
    super()
    this.appendChild(template.content.cloneNode(true))
    this.form = this.firstElementChild
  }

  connectedCallback () {
    this.applyThisSettings = applySettings.bind(this)
    this.form.addEventListener('submit', this.applyThisSettings)
  }

  disconnectedCallback () {
    this.form.removeEventListener('submit', this.applyThisSettings)
  }

  getValues () {
    const form = this.form
    const palette = form.querySelector('input[name="palette"]:checked').id.substr(8)
    const size = +form.querySelector('#size').value
    const iterationThreshold = +form.querySelector('#iteration-threshold').value
    const offsetX = +form.querySelector('#offset-x').value
    const offsetY = +form.querySelector('#offset-y').value
    const scale = +form.querySelector('#scale').value
    return { palette, iterationThreshold, size, offsetX, offsetY, scale }
  }
}

export { SetFormElement }
