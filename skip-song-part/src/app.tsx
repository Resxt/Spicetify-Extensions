import initMenu from "./menu";
import { getStoredData, getStoredDataRaw, saveStoredData, msToReadableTime, sleep, clearStoredData, getArtistNameFromTrack } from "./utils";

const skipSegmentDefault = -1;

let skipStartSegment = skipSegmentDefault;
let skipStopSegment = skipSegmentDefault;

async function main() {
  while (!Spicetify?.showNotification) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  initMenu();

  if (getStoredDataRaw() === null) {
    clearStoredData();
  }

  Spicetify.Mousetrap.bind('alt+s', addSegmentPart);

  monitorTrackChange();
}

function monitorTrackChange() {
  Spicetify.Player.addEventListener("songchange", () => {
    const data = Spicetify.Player.data || Spicetify.Queue;

    if (!data) return;

    clearSkipPartSegment();

    const parsedStorage: SkipSongPartStorage = getStoredData();

    // If the current track is found in the local storage then monitor the track to skip the segments
    if (parsedStorage[data.track?.uri!] !== undefined) {
      monitorSegmentSkip(data.track?.uri!, parsedStorage[data.track?.uri!].segments);
    }
  });
}

async function monitorSegmentSkip(trackURI: string, skips: SongSegments) {
  while (Spicetify.Player.isPlaying) {
    const data = Spicetify.Player.data || Spicetify.Queue;

    // If we're not listening to the monitored song anymore then stop monitoring for segment skips
    if (data.track?.uri! !== trackURI) {
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

    Spicetify.showNotification("Starting creation of skip segment");
  }
  else {
    const data = Spicetify.Player.data || Spicetify.Queue;
    skipStopSegment = trackProgress;

    if (data.track !== null && data.track?.uri !== null) {
      addSegmentToStorage(data.track?.uri!, getArtistNameFromTrack(data.track), data.track?.metadata!.title!);
    }

    Spicetify.showNotification("Skip segment from " + msToReadableTime(skipStartSegment) + " to " + msToReadableTime(trackProgress) + " saved");

    clearSkipPartSegment();
  }
}

function addSegmentToStorage(trackURI: string, artistName: string, songName: string) {
  let parsedStorage: SkipSongPartStorage = getStoredData();
  let parsedTrackData: SongData = parsedStorage[trackURI];
  let newTrackData: SongSegment = { start: skipStartSegment, end: skipStopSegment };

  if (parsedTrackData === undefined) {
    parsedTrackData = {
      artist: artistName,
      song: songName,
      segments: [newTrackData]
    }
  }
  else {
    parsedTrackData.segments.push(newTrackData);
  }

  parsedStorage[trackURI] = parsedTrackData;

  saveStoredData(parsedStorage);
}

function clearSkipPartSegment() {
  skipStartSegment = skipSegmentDefault;
  skipStopSegment = skipSegmentDefault;
}

export default main;