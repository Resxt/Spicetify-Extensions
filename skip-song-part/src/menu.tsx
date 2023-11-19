import { deleteSongFromStoredData, getCssVariable, getStoredData, getStoredDataRaw, getVisibleChildrenCount, isStoredDataEmpty, msToReadableTime, saveStoredData, saveStoredDataRaw, sleep } from "./utils";

const react = Spicetify.React;
const modalStyle = {
  dangerouslySetInnerHTML: {
    __html: `
    .ssp-container {
      text-align: center;
    }
    
    .ssp-container hr {
      margin-top: 2rem;
      margin-bottom: 2rem;
    }

    #ssp-song-filter {
      text-align: center;
      padding-left: 2rem;
      padding-right: 2rem;
    }
    
    .ssp-song-div {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .ssp-song-div:not(:last-child) {
      margin-bottom: 2rem;
    }
    
    .ssp-song-label {
      font-weight: bold;
    }
    
    .ssp-song-label:hover {
      text-decoration: line-through;
      opacity: 50%;
    }
    
    .ssp-song-segment {
      font-size: 0.825rem;
    }
    
    .ssp-song-segment:hover {
      text-decoration: line-through;
      opacity: 50%;
    }
    
    .ssp-buttons {
      -webkit-tap-highlight-color: transparent;
      font-weight: 700;
      font-family: var(--font-family,CircularSp,CircularSp-Arab,CircularSp-Hebr,CircularSp-Cyrl,CircularSp-Grek,CircularSp-Deva,var(--fallback-fonts,sans-serif));
      background-color: transparent;
      border-radius: 500px;
      transition-duration: 33ms;
      transition-property: background-color, border-color, color, box-shadow, filter, transform;
      padding-inline: 15px;
      border: 1px solid #727272;
      color: var(--spice-text);
      min-block-size: 32px;
    }
    
    .ssp-buttons:hover {
      transform: scale(1.04);
      border-color: var(--spice-text);
    }

    #ssp-import-export-textarea {
      background-color: transparent;
      color: var(--spice-text);
      height: 25vh;
      width: 100%;
    }
    
    .d-none {
      display: none;
    }
    `,
  },
};

function initMenu() {
  new Spicetify.Menu.Item("Skip song part menu", false, () => {
    openSegmentsModal();
  }).register();
}

async function openSegmentsModal() {
  const menuContainer = react.createElement("div", { className: "ssp-container" }, react.createElement("style", modalStyle),
    react.createElement("p", { id: "ssp-how-to-1" }, "Use ALT+S to add segments to skip"),
    react.createElement("p", { id: "ssp-how-to-2", className: `${isStoredDataEmpty() ? "d-none" : ""}` }, "Click on a song or a segment to delete it"),
    react.createElement("hr", { id: "ssp-separator-1", color: getCssVariable("spice-text"), size: 1 }),
    react.createElement("input", { id: "ssp-song-filter", type: "text", placeHolder: "Type to filter", autofocus: "true", className: `${isStoredDataEmpty() ? "d-none" : ""}`, onInput: onSongFilter }),
    react.createElement("hr", { id: "ssp-separator-2", color: getCssVariable("spice-text"), size: 1, className: `${isStoredDataEmpty() ? "d-none" : ""}` }),

    // For each song in the storage create a div with the artist and song name in a child label. In that same div create a span with the segments times for each segments found for that song
    Object.entries(getStoredData()).map(([songKey, songData], index) => (
      react.createElement("div", { className: "ssp-song-div" },
        react.createElement("label", { className: "ssp-song-label col description", songKey: songKey, onClick: onSongClick }, songData.artist + " - " + songData.song),
        Object.entries(songData.segments).map(([segmentKey, segmentValue], index) => (
          react.createElement("span", { className: "ssp-song-segment", songKey: songKey, songData: segmentValue.start, onClick: onSegmentClick }, msToReadableTime(segmentValue.start) + " to " + msToReadableTime(segmentValue.end))
        ))
      )
    )),
    react.createElement("hr", { id: "ssp-separator-3", color: getCssVariable("spice-text"), size: 1, className: `${isStoredDataEmpty() ? "d-none" : ""}` }),
    react.createElement("button", { id: "ssp-delete-all", className: `${isStoredDataEmpty() ? "ssp-buttons d-none" : "ssp-buttons"}`, onClick: onDeleteAllClick }, "Delete all segments"),
    react.createElement("button", { id: "ssp-import-export", className: "ssp-buttons", onClick: openImportExportModal }, "Import/Export")
  )

  Spicetify.PopupModal.display({
    title: "Skip song part - Saved segments",
    content: menuContainer,
    isLarge: true,
  });
}

async function openImportExportModal() {
  const menuContainer = react.createElement("div", { className: "ssp-container" }, react.createElement("style", modalStyle),
    react.createElement("p", { id: "ssp-how-to-1" }, "Clicking the Save button will override all your saved segments!"),
    react.createElement("p", { id: "ssp-how-to-2" }, "Tip: You can use CTRL + A to select everything in the text area"),
    react.createElement("hr", { id: "ssp-separator-1", color: getCssVariable("spice-text"), size: 1 }),
    react.createElement("h2", { id: "ssp-how-to-title-3" }, "Importing saved segments"),
    react.createElement("p", { id: "ssp-how-to-3" }, "Delete everything in the text area below, paste your previously saved skips (from the text file) inside the textarea below, then click on Save"),
    react.createElement("hr", { id: "ssp-separator-2", color: getCssVariable("spice-text"), size: 1 }),
    react.createElement("h2", { id: "ssp-how-to-title-4" }, "Exporting saved segments"),
    react.createElement("p", { id: "ssp-how-to-4" }, "Copy everything in the text area below in a text file on your PC"),
    react.createElement("hr", { id: "ssp-separator-3", color: getCssVariable("spice-text"), size: 1 }),
    react.createElement("textarea", { id: "ssp-import-export-textarea", autofocus: "true" }, isStoredDataEmpty() ? "" : getStoredDataRaw()),
    react.createElement("hr", { id: "ssp-separator-4", color: getCssVariable("spice-text"), size: 1 }),
    react.createElement("button", { id: "ssp-import-export-save", className: "ssp-buttons", onClick: onImportExportSaveClick }, "Save")
  )

  Spicetify.PopupModal.hide();

  await sleep(500);

  Spicetify.PopupModal.display({
    title: "Skip song part - Import/Export",
    content: menuContainer,
    isLarge: true,
  });
}

function onSongFilter(element: any) {
  const filteredText = element.target.value.toLowerCase();
  const songDivs = document.querySelectorAll('.ssp-song-div') as NodeListOf<HTMLElement>;

  songDivs.forEach((div) => {
    const label = div.getElementsByTagName('label')[0];

    if (label.textContent !== null) {
      const itemText = label.textContent.toLowerCase();

      if (itemText.includes(filteredText)) {
        div.style.display = '';
      } else {
        div.style.display = 'none';
      }
    }
  })
}

function onSongClick(element: any) {
  deleteSongFromStoredData(element.target.attributes.songKey.value);

  /*Make the song element invisible in the modal. 
  We do this instead of removing the element because removing the element closes the modal. 
  The element will not be shown anymore anyways the next time the modal is opened*/
  element.target.parentElement.classList.add("d-none");

  if (isStoredDataEmpty()) {
    onLastSegmentDeleted();
  }
}

function onSegmentClick(element: any) {
  let storedData = getStoredData();
  const songKey = element.target.attributes.songKey.value;
  const remainingAfterDeletion = (getVisibleChildrenCount(element.target.parentElement.children) - 2);

  // If this is the only segment for this song delete the entire song from the storage
  if (remainingAfterDeletion == 0) {
    deleteSongFromStoredData(songKey);

    /*Make the song element invisible in the modal. 
    We do this instead of removing the element because removing the element closes the modal. 
    The element will not be shown anymore anyways the next time the modal is opened*/
    element.target.parentElement.classList.add("d-none");
  }
  // If there are multiple segments for this song then delete the requested segment from the storage
  else {
    const songSegments: SongSegment[] = storedData[songKey].segments;

    songSegments.forEach((segment, index) => {
      if (segment.start == element.target.attributes.songData.value) {
        storedData[songKey].segments.splice(index, 1);
        //delete storedData[songKey].segments[index];
        saveStoredData(storedData);

        /*Make the segment element invisible in the modal. 
        We do this instead of removing the element because removing the element closes the modal. 
        The element will not be shown anymore anyways the next time the modal is opened*/
        element.target.classList.add("d-none");
      }
    })
  }

  if (isStoredDataEmpty()) {
    onLastSegmentDeleted();
  }
}

function onDeleteAllClick() {
  const songs: HTMLCollection = document.getElementsByClassName("ssp-song-div");

  for (let index = 0; index < songs.length; index++) {
    songs[index].classList.add("d-none");

    deleteSongFromStoredData(songs[index].children[0].attributes[1].value);
  }

  onLastSegmentDeleted();
}

function onImportExportSaveClick() {
  let newContent = (document.getElementById("ssp-import-export-textarea") as HTMLInputElement).value;

  if (newContent && newContent != null && newContent != undefined) {
    saveStoredDataRaw(newContent);
    
    Spicetify.PopupModal.hide();
    Spicetify.showNotification("Skips data successfully imported");
  }
}

function onLastSegmentDeleted() {
  Spicetify.PopupModal.hide();
  Spicetify.showNotification("All segments have been deleted");
}

export default initMenu;