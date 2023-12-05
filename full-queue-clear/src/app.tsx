async function main() {
  while (!Spicetify?.showNotification) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  await waitForAppToBeReady();

  let queueButton = document.querySelector(`[aria-label="` + Spicetify.Platform.Translations["playback-control.queue"] + `"]`);
  
  if (queueButton && queueButton != null && queueButton != undefined) {
    queueButton.addEventListener("contextmenu", (evn) => {
      const pressedAlt = (evn as KeyboardEvent).getModifierState("Alt");
      const pressedCtrl = (evn as KeyboardEvent).getModifierState("Control");

      if (!pressedAlt && !pressedCtrl) {
        fullQueueClear(true, true);
      }
      else if (pressedAlt) {
        fullQueueClear(true, false);
      }
      else if (pressedCtrl) {
        fullQueueClear(false, true);
      }
    });
  }
}

async function fullQueueClear(keepCurrentSong: boolean, clearRegularQueue: boolean) {
  if (clearRegularQueue) {
    await Spicetify.Platform.PlayerAPI.clearQueue();
  }

  if (keepCurrentSong) {
    let currentProgress = Spicetify.Player.getProgress();
    let currentPlaybackId = Spicetify.Player.data.playbackId;
    let shouldResume = Spicetify.Player.isPlaying();
    let currentVolume = Spicetify.Player.getVolume();

    Spicetify.Player.setVolume(0); // we temporarily change the volume to 0 so that the user doesn't hear the song seeking back to the current time

    let callback = () => changePlaybackId(currentProgress, currentPlaybackId, shouldResume, currentVolume, callback);

    if (Spicetify.Player.data.item) {
      Spicetify.Player.playUri(Spicetify.Player.data.item.uri);
    }

    Spicetify.Player.addEventListener("onprogress", callback);
  }
  else {
    Spicetify.Player.playUri("");
  }
}

/* Play the same song we're already playing to get a new playback ID, which clears the context queue */
function changePlaybackId(previousProgress: number, previousPlaybackId: string | undefined, shouldResume: boolean, previousVolume: number, callback: any) {
  if (Spicetify.Player.data.item) {
    if (Spicetify.Player.data.playbackId != previousPlaybackId) {
      if (!shouldResume) {
        Spicetify.Player.pause();
      }

      Spicetify.Player.setVolume(previousVolume);
      Spicetify.Player.seek(previousProgress);
      
      Spicetify.Player.removeEventListener("onprogress", callback);
    }
  }
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
