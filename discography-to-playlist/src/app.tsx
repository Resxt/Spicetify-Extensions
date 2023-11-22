import { encodeImgFromUrl, getArtistDiscography, getArtist, getUserId, splitArray } from "./utils";

async function main() {
  while (!Spicetify?.showNotification) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  new Spicetify.ContextMenu.Item("Create playlist from discography", createPlaylistFromDiscography, (uris) => Spicetify.URI.isArtist(uris[0]), "playlist").register();
}

async function createPlaylistFromDiscography(uris: string[]) {
  const artistId = Spicetify.URI.fromString(uris[0]).id!;
  const artistData = await getArtist(artistId);
  const createPlaylistBody: CreatePlaylistBody = {
    name: "Discography of " + artistData.name,
    description: "Playlist with the entire discography of " + artistData.name + ". Created with discography-to-playlist"
  };

  Spicetify.showNotification("Creating your playlist..", false, 5000);

  const createPlaylistResponse = await createPlaylist(createPlaylistBody);
  await updatePlaylistImage(createPlaylistResponse.id, artistData.images[0].url);

  const tracks = await getArtistDiscography(artistId, "album,single,appears_on,compilation");

  // splitting the tracks array by chunks of 100 tracks to respect the API's limit per request
  // https://developer.spotify.com/documentation/web-api/reference/add-tracks-to-playlist
  splitArray(tracks, 100).forEach(async tracksChunk => {
    await Spicetify.CosmosAsync.post(`https://api.spotify.com/v1/playlists/${createPlaylistResponse.id}/tracks`, { "uris": tracksChunk });
  });

  Spicetify.showNotification("Playlist " + createPlaylistBody.name + " <br>successfully created with " + tracks.length + " tracks", false, 5000);
}

async function createPlaylist(body: CreatePlaylistBody): Promise<CreatePlaylistResponse> {
  const userId = await getUserId();

  return await Spicetify.CosmosAsync.post(`https://api.spotify.com/v1/users/${userId}/playlists`, body);
}

async function updatePlaylistImage(playlistId: string, imageUrl: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  encodeImgFromUrl(imageUrl).then(async (encodedImg: any) => {
    await Spicetify.CosmosAsync.put(`https://api.spotify.com/v1/playlists/${playlistId}/images`, encodedImg.split("base64,")[1]);
  });
}

export default main;
