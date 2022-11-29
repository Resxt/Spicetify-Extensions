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
  splitSongsToRemove(songsToRemove).forEach(arrayElement => {
    Spicetify.CosmosAsync.del(`https://api.spotify.com/v1/playlists/${playlistLink}/tracks`, { "tracks": arrayElement })
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
  })
}

/*
To avoid getting a "Payload too large" error we split the array into multiple arrays
*/
function splitSongsToRemove(songsToRemove: PlaylistSong[]) {
  const payloadMaxSize = 100;

  let songsToRemoveSplitted: [PlaylistSong[]] = [[]];

  for (let index = 0; index < songsToRemove.length; index += payloadMaxSize) {
    let endIndex = index + payloadMaxSize;
    
    if (endIndex > songsToRemove.length) {
      endIndex = songsToRemove.length;
    }

    songsToRemoveSplitted.push(songsToRemove.slice(index, endIndex));
  }

  return songsToRemoveSplitted;
}

export default main;
