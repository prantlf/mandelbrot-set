function initializePage () {
  const toolbar = document.getElementById('toolbar')
  const dialog = document.getElementById('settings-dialog')
  const form = document.getElementById('settings')

  if (dialog.showModal) {
    toolbar.addEventListener('open-settings', openSettingsDialog)
    form.addEventListener('submitted', closeSettingsDialog)
  }

  function closeSettingsDialog () {
    dialog.close()
  }

  function openSettingsDialog () {
    dialog.showModal()
  }
}

addEventListener('DOMContentLoaded', initializePage)
