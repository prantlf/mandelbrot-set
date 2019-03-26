function appendStylesheet (parent, stylesheet) {
  const link = document.createElement('link')
  link.setAttribute('rel', 'stylesheet')
  link.setAttribute('href', stylesheet)
  parent.appendChild(link)
}

function initializeElement (parent, template) {
  const stylesheet = parent.getAttribute('stylesheet')
  if (stylesheet) {
    parent = parent.attachShadow({ mode: 'open' })
    appendStylesheet(parent, stylesheet)
  }
  parent.appendChild(template.content.cloneNode(true))
  return parent
}

let counter = 0

function getUniqueId () {
  return `mandelbrot-set-${++counter}`
}

function ensureUniqueFieldId (parent, dataId, uniqueId) {
  const field = parent.querySelector(`[data-id="${dataId}"]`)
  let label = field.previousElementSibling
  if (label.tagName !== 'LABEL' || label.hasAttribute('for')) {
    label = field.nextElementSibling
  }
  field.setAttribute('id', uniqueId)
  label.setAttribute('for', uniqueId)
  return field
}

function ensureUniqueFieldIds (parent, dataIds) {
  return dataIds.reduce(function (result, dataId) {
    const uniqueId = getUniqueId()
    result[dataId] = ensureUniqueFieldId(parent, dataId, uniqueId)
    return result
  }, {})
}

export { initializeElement, ensureUniqueFieldIds }
