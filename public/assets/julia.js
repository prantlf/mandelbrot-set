let dialog
let form
let graph

function refreshGraph () {
  const settings = form.getValues()
  graph.setAttributes(settings)
  graph.render()
}

function applySettings () {
  if (dialog.close) {
    dialog.close()
  }
  refreshGraph()
}

function openSettings () {
  if (dialog.showModal) {
    const settings = graph.getAttributes()
    form.setValues(settings)
    dialog.showModal()
  }
}

function initializePage () {
  const toolbar = document.getElementById('toolbar')
  toolbar.addEventListener('open-settings', openSettings)
  form = document.getElementById('settings')
  form.addEventListener('submit', applySettings)
  dialog = document.getElementById('settings-dialog')
  graph = document.getElementById('graph')
  refreshGraph()
}

addEventListener('DOMContentLoaded', initializePage)
