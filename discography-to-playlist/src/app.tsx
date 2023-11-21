import { encodeImgFromUrl, getArtistData, getUserId } from "./utils";

async function main() {
  while (!Spicetify?.showNotification) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  new Spicetify.ContextMenu.Item("Create playlist from discography", createPlaylistFromDiscography, (uris) => Spicetify.URI.isArtist(uris[0]), "playlist").register();
}

async function createPlaylistFromDiscography(uris: string[]) {
  const artistId = Spicetify.URI.fromString(uris[0]).id!;
  const artistData = await getArtistData(artistId);
  const createPlaylistBody: CreatePlaylistBody = {
    name: "Discography of " + artistData.name,
    description: "Playlist with the entire discography of " + artistData.name + ". Created with discography-to-playlist at <date>",
    public: false
  };

  Spicetify.showNotification("Creating playlist with the discography of " + artistData.name);

  const createPlaylistResponse = await createPlaylist(createPlaylistBody);
  updatePlaylistImage(createPlaylistResponse.id, artistData.images[0].url);
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
