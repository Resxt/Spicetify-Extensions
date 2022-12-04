import { getArtistData, getUserData, encodeImgFromUrl } from "./utils";

async function main() {
  while (!Spicetify?.showNotification) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  Spicetify.showNotification("artist-discography-to-playlist loaded");

  new Spicetify.ContextMenu.Item("Create a playlist from discography", createPlaylistFromArtist, Spicetify.URI.isArtist, "playlist").register();
}

async function createPlaylistFromArtist(elementURIs: string[]) {
  const artistId: string = Spicetify.URI.fromString(elementURIs[0]).getBase62Id();

  getSongsFromArtist(Spicetify.URI.fromString(elementURIs[0]).getBase62Id()).then((songs) => {
    getArtistData(artistId).then((artistData) => {
      const creationDate = new Date().toLocaleString(navigator.language, {
        dateStyle: 'short',
        timeStyle: 'medium'
      });

      createPlaylist("Discography of " + artistData.name, false, false, "Playlist with the entire discography of " + artistData.name + " created at " + creationDate).then((playlistData) => {
        updatePlaylistImage(playlistData.id, artistData.images[0].url);
      })
    })
  });
}

async function createPlaylist(name: string, isPublic: boolean, isCollaborative: boolean, description: string): Promise<PlaylistData> {
  const body: CreatePlaylistBody = {
    name: name,
    public: isPublic,
    collaborative: isCollaborative,
    description: description
  }
  
  const userData = await getUserData();

  return await Spicetify.CosmosAsync.post(`https://api.spotify.com/v1/users/${userData.id}/playlists`, body);
}

async function updatePlaylistImage(playlistId: string, imageUrl: string) {
  encodeImgFromUrl(imageUrl).then(async (encodedImg: any) => {
    await Spicetify.CosmosAsync.put(`https://api.spotify.com/v1/playlists/${playlistId}/images`, encodedImg.split("base64,")[1]);
  })
}

async function getSongsFromArtist(artistId: string): Promise<SongData[]> {
  let songs: SongData[] = [];

  let albumsData: AlbumsData = await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/artists/${artistId}/albums?limit=50`);
  albumsData.items.forEach(song => {
    songs.push(song);
  });
  
  while (albumsData.next != null && albumsData.next != undefined) {
    albumsData = await Spicetify.CosmosAsync.get(albumsData.next);
    albumsData.items.forEach(song => {
      songs.push(song);
    });
  }

  return songs;
}

export default main;
