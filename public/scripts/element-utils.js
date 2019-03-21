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

export { initializeElement }