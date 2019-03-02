import { Renderer, getElement } from './renderer.js'

const type = 'julia'
let k

class Julia extends Renderer {
  getParameters () {
    const parameters = super.getParameters()
    return { type, k, ...parameters }
  }

  readSettings () {
    super.readSettings()
    const r = +getElement('k-r').value
    const i = +getElement('k-i').value
    k = { r, i }
  }

  importTemplate () {
    super.importTemplate()
    const form = getElement('settings')
    const part = getElement('form-part')
    form.insertBefore(part.content, form.firstElementChild)
  }
}

const renderer = new Julia()
renderer.initialize()
