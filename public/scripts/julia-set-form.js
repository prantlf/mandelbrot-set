import { SetFormElement } from './set-form.js'

const template = document.createElement('template')
template.innerHTML = `<fieldset>
  <legend>Constant for the Julia set [X + Yi]</legend>
  <label for="k-r">X:</label>
  <input id="k-r" type="number" value="0.4" step="any">
  <label for="k-i">Y:</label>
  <input id="k-i" type="number" value="0.4" step="any">
</fieldset>`

class JuliaSetFormElement extends SetFormElement {
  constructor () {
    super()
    this.form.insertBefore(template.content.cloneNode(true), this.form.firstElementChild)
  }

  getValues () {
    const values = super.getValues()
    values.kr = +this.form.querySelector('#k-r').value
    values.ki = +this.form.querySelector('#k-i').value
    return values
  }

  setValues (values) {
    super.setValues(values)
    this.form.querySelector('#k-r').value = values.kr
    this.form.querySelector('#k-i').value = values.ki
  }
}

customElements.define('julia-set-form', JuliaSetFormElement)
