const localStorageKey = "skip-song-part";



/* Storage utils section */

export function getStoredDataRaw(): string {
    return Spicetify.LocalStorage.get(localStorageKey)!;
}

export function getStoredData(): SkipSongPartStorage {
    return JSON.parse(getStoredDataRaw());
}

export function getStoredDataObject() {
    return Object.values(getStoredData());
}

export function saveStoredData(parsedStorage: SkipSongPartStorage) {
    Spicetify.LocalStorage.set(localStorageKey, JSON.stringify(parsedStorage));
}

export function deleteSongFromStoredData(songToDelete: string) {
    let storedData = getStoredData();

    delete storedData[songToDelete];
    saveStoredData(storedData);
}

export function clearStoredData() {
    saveStoredData({});
}

export function isStoredDataEmpty(): boolean {
    return getStoredDataRaw() == null || getStoredDataRaw() == undefined || getStoredDataRaw() == "{}";
}



/* Generic utils section */

export function msToReadableTime(ms: number) {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);

    return `${+minutes < 10 ? "0" : ""}${minutes}:${+seconds < 10 ? "0" : ""}${seconds}`
};

export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}



/* Backend utils section */

export function getArtistNameFromTrack(track: any): string {
    let artistNames = track.metadata.artist_name;
    let artistNameIndex = 1;

    while (true) {
        const artistName = track.metadata["artist_name:" + artistNameIndex];
        artistNameIndex++;

        if (artistName == null || artistName == undefined) {
            artistNames.trim();
            break;
        }
        else {
            artistNames += ", " + artistName;
        }
    }

    return artistNames;
}



/* Frontend utils section */

export function getVisibleChildrenCount(children: HTMLCollection): number {
    let visibleChildrenCount = 0;

    for (let index = 0; index < children.length; index++) {
        const element = children.item(index);

        if (!element?.classList.contains("d-none")) {
            visibleChildrenCount++;
        }
    }

    return visibleChildrenCount;
}

export function getCssVariable(variable: string) {
    return getComputedStyle(document.querySelector(':root')!).getPropertyValue("--" + variable);
}