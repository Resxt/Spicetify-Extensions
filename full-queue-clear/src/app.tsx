async function main() {
  while (!Spicetify?.showNotification) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  await waitForAppToBeReady();

  let queueButton = document.querySelector(`[aria-label="` + Spicetify.Platform.Translations["playback-control.queue"] + `"]`);

  queueButton?.addEventListener("contextmenu", onQueueIconRightClick)
} 

function onQueueIconRightClick() {
  Spicetify.Player.playUri("");
}

/* Credits to theRealPadster */
async function waitForAppToBeReady() {
  let mainElem = document.querySelector('.main-view-container__scroll-node-child');

  while (!mainElem) {
    await new Promise(resolve => setTimeout(resolve, 100));
    mainElem = document.querySelector('.main-view-container__scroll-node-child');
  }

  return true;
}

export default main;
