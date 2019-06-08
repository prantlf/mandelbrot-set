import { SetFormElement } from './set-form.js'
import { ensureUniqueFieldIds } from './element-utils.js'

const template = document.createElement('template')
template.innerHTML = `<fieldset>
  <legend>Constant for the Julia set [X + Yi]</legend>
  <label>X:</label>
  <input data-id="k-r" type="number" value="0.4" step="any">
  <label>Y:</label>
  <input data-id="k-i" type="number" value="0.4" step="any">
</fieldset>`

const fields = [ 'k-r', 'k-i' ]

class JuliaSetFormElement extends SetFormElement {
  constructor () {
    super()
    const form = this.form
    form.insertBefore(template.content.cloneNode(true), form.firstElementChild)
    const juliaFields = ensureUniqueFieldIds(form, fields)
    Object.assign(this.fields, juliaFields)
  }

  getParameters () {
    const parameters = super.getParameters()
    const fields = this.fields
    parameters.kr = +fields['k-r'].value
    parameters.ki = +fields['k-i'].value
    return parameters
  }

  setParameters (parameters) {
    super.setParameters(parameters)
    const fields = this.fields
    fields['k-r'].value = parameters.kr
    fields['k-i'].value = parameters.ki
  }
}

customElements.define('julia-set-form', JuliaSetFormElement)
