async function main() {
  while (!Spicetify?.showNotification) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  new Spicetify.ContextMenu.Item("Remove unplayable songs", tryRemoveUnplayableSongs, Spicetify.URI.isPlaylistV1OrV2, "block").register();
}

async function tryRemoveUnplayableSongs(elementURIs: string[]) {
  const playlistData: PlaylistData = await Spicetify.CosmosAsync.get(`sp://core-playlist/v1/playlist/${elementURIs[0]}`);

  if (!playlistData.playlist.allows.remove) {
    Spicetify.showNotification("You are not allowed to remove songs in this playlist");

    return;
  }

  let songsToRemove: PlaylistSong[] = [];

  playlistData.items.forEach((track: PlaylistSongData) => {
    if (!track.playable) {
      songsToRemove.push({"uri": track.link});
    }
  })

  const playlistLink: string = Spicetify.URI.fromString(playlistData.playlist.link).getBase62Id();

  removeUnplayableSongs(playlistLink, songsToRemove);
}

function removeUnplayableSongs(playlistLink: string, songsToRemove: PlaylistSong[]) {
  Spicetify.CosmosAsync.del(`https://api.spotify.com/v1/playlists/${playlistLink}/tracks`, { "tracks": songsToRemove })
  .catch(error => {
    Spicetify.showNotification("Failed to remove unplayable songs. See console for more details");
    console.error(error);
  })
  .then(() => {
    if (songsToRemove.length == 0) {
      Spicetify.showNotification("No unplayable songs found");
    }
    else {
      Spicetify.showNotification("Successfully removed " + songsToRemove.length + " unplayable songs");
    }
  })
}

export default main;
