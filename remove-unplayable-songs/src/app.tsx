const react = Spicetify.React;

async function main() {
  while (!Spicetify?.showNotification) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  new Spicetify.Menu.Item("Remove unplayable liked songs", true, () => {
    removeUnplayableLikedSongs();
  }, "block").register();
  
  new Spicetify.ContextMenu.Item("Remove unplayable songs", tryRemoveUnplayableSongs, (uri) => Spicetify.URI.isPlaylistV1OrV2(uri[0]), "block").register();
}

async function tryRemoveUnplayableSongs(elementURIs: string[]) {
  const playlistData: PlaylistData = await Spicetify.CosmosAsync.get(`sp://core-playlist/v1/playlist/${elementURIs[0]}`);

  if (!playlistData.playlist.userCapabilities.canAdministratePermissions) {
    Spicetify.showNotification("You are not allowed to remove songs in this playlist");

    return;
  }

  let songsToRemove: PlaylistSong[] = [];

  playlistData.items.forEach((track: PlaylistSongData) => {
    if (!track.playable) {
      songsToRemove.push({"uri": track.link});
    }
  })

  const playlistLink = Spicetify.URI.fromString(playlistData.playlist.link).id;

  if (playlistLink !== undefined) {
    removeUnplayableSongs(playlistLink, songsToRemove);
  }
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

async function removeUnplayableLikedSongs() {
  const likedSongsToRemove = await getLikedSongs();
  const likedSongsToRemoveSplitted = splitLikedSongsToRemove(likedSongsToRemove);

  likedSongsToRemoveSplitted.forEach(arrayElement => {
    Spicetify.CosmosAsync.del(`https://api.spotify.com/v1/me/tracks?ids=${arrayElement.toString()}`)
  .catch(error => {
    Spicetify.showNotification("Failed to remove unplayable liked songs. See console for more details");
    console.error(error);
  })
  .then(() => {
    if (likedSongsToRemove.length == 0) {
      Spicetify.showNotification("No unplayable songs found");
    }
    else {
      Spicetify.showNotification("Successfully removed " + likedSongsToRemove.length + " unplayable songs");
    }
  })
  })
}

async function getLikedSongs(): Promise<string[]> {
  const userProfile = await Spicetify.CosmosAsync.get("https://api.spotify.com/v1/me");

  let likedSongs: string[] = [];
  let likedSongsData: LikedSongsData = await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/me/tracks?limit=50&market=${userProfile.country}`);

  likedSongsData.items.forEach(likedSong => {
    if (!likedSong.track.is_playable)
    likedSongs.push(likedSong.track.id);
  })
  
  while (likedSongsData.next != null && likedSongsData.next != undefined) {
    likedSongsData = await Spicetify.CosmosAsync.get(likedSongsData.next);
    
    likedSongsData.items.forEach(likedSong => {
      if (!likedSong.track.is_playable)
      likedSongs.push(likedSong.track.id);
    })
  }

  return likedSongs;
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

/*
To avoid getting a "Payload too large" error we split the array into multiple arrays
*/
function splitLikedSongsToRemove(songsToRemove: string[]) {
  const payloadMaxSize = 50;

  let songsToRemoveSplitted: [string[]] = [[]];

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
