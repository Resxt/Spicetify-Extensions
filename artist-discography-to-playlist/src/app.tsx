async function main() {
  while (!Spicetify?.showNotification) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  Spicetify.showNotification("artist-discography-to-playlist loaded");

  new Spicetify.ContextMenu.Item("Create a playlist from discography", createPlaylistFromArtist, Spicetify.URI.isArtist, "playlist").register();
}

async function createPlaylistFromArtist(elementURIs: string[]) {
  getSongsFromArtist(Spicetify.URI.fromString(elementURIs[0]).getBase62Id()).then((songs) => {
    console.log(songs);
  });
}

async function getSongsFromArtist(artistId: string): Promise<SongData[]> {
  let songs: SongData[] = [];

  let artistData: ArtistData = await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/artists/${artistId}/albums?limit=50`);
  artistData.items.forEach(song => {
    songs.push(song);
  });
  
  while (artistData.next != null && artistData.next != undefined) {
    artistData = await Spicetify.CosmosAsync.get(artistData.next);
    artistData.items.forEach(song => {
      songs.push(song);
    });
  }

  return songs;
}

export default main;
