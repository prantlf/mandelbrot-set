/* global addEventListener */

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
    dialog.showModal()
  }
}

function initializePage () {
  const trigger = document.getElementById('open-settings')
  trigger.addEventListener('click', openSettings)
  form = document.getElementById('settings')
  form.addEventListener('submit', applySettings)
  dialog = document.getElementById('settings-dialog')
  graph = document.getElementById('graph')
  refreshGraph()
}

addEventListener('DOMContentLoaded', initializePage)
