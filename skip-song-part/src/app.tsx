const localStorageKey = "skip-song-part";
const skipSegmentDefault = -1;

let skipStartSegment = skipSegmentDefault;
let skipStopSegment = skipSegmentDefault;

async function main() {
  while (!Spicetify?.showNotification) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  Spicetify.LocalStorage.remove(localStorageKey);

  if (Spicetify.LocalStorage.get(localStorageKey) === null) {
    Spicetify.LocalStorage.set(localStorageKey, JSON.stringify({}));
  }

  Spicetify.Mousetrap.bind('s', addSegmentPart);

  monitorTrackChange();
}

function monitorTrackChange() {
  Spicetify.Player.addEventListener("songchange", () => {
		const data = Spicetify.Player.data || Spicetify.Queue;

		if (!data) return;

    clearSkipPartSegment();
		
    const parsedStorage: SkipSongPartStorage = JSON.parse(Spicetify.LocalStorage.get(localStorageKey)!);
    
    // If the current track is found in the local storage then monitor the track to skip the segments
    if (parsedStorage[data.track?.uid!] !== undefined) {
      monitorSegmentSkip(data.track?.uid!, parsedStorage[data.track?.uid!]);
    }
	});
}

async function monitorSegmentSkip(trackUID: string, skips: SongSegments) {
  while (Spicetify.Player.isPlaying) {
    const data = Spicetify.Player.data || Spicetify.Queue;

    // If we're not listening to the monitored song anymore then stop monitoring for segment skips
    if (data.track?.uid! !== trackUID) {
      break;
    }

    const trackProgress = Spicetify.Player.getProgress();

    // Loop through all the tracks segment and skip to the end of that segment if we're inside one of them
    Object.entries(skips).forEach(([key, value], index) => {
      if (trackProgress >= value.start && trackProgress < value.end) {
        Spicetify.Player.seek(value.end);
      }
    })

    await sleep(1000);
  }
}

function addSegmentPart() {
  const trackProgress = Spicetify.Player.getProgress();

  if (skipStartSegment == skipSegmentDefault) {
    skipStartSegment = trackProgress;
  }
  else {
    const data = Spicetify.Player.data || Spicetify.Queue;
    skipStopSegment = trackProgress;

    if (data.track !== null && data.track?.uid !== null) {
      addSegmentToStorage(data.track?.uid!);
    }

    Spicetify.showNotification("Skip segment from " + msToMinutesSecond(skipStartSegment) + " to " + msToMinutesSecond(trackProgress) + " saved");

    clearSkipPartSegment();
  }
}

function addSegmentToStorage(trackUID: string) {
  const storage = Spicetify.LocalStorage.get(localStorageKey);

  let parsedStorage: SkipSongPartStorage = JSON.parse(storage!);
  let parsedTrackData: SongSegments = parsedStorage[trackUID];
  let newTrackData = {[skipStartSegment]: {start: skipStartSegment, end: skipStopSegment}};
  
  parsedStorage[trackUID] = {...parsedTrackData, ...newTrackData};

  Spicetify.LocalStorage.set(localStorageKey, JSON.stringify(parsedStorage));
}

function clearSkipPartSegment() {
  skipStartSegment = skipSegmentDefault;
  skipStopSegment = skipSegmentDefault;
}

function msToMinutesSecond(ms: number) {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);

  return `${+minutes < 10 ? "0" : ""}${minutes}:${+seconds < 10 ? "0" : ""}${seconds}`
};

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default main;
