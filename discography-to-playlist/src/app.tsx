async function main() {
  while (!Spicetify?.showNotification) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  new Spicetify.ContextMenu.Item("Create playlist from discography", createPlaylistFromDiscography, (uri) => Spicetify.URI.isArtist(uri[0]), "playlist").register();
}

async function createPlaylistFromDiscography() {
  Spicetify.showNotification("createPlaylistFromDiscography() called");
}

export default main;
