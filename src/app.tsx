enum Page {
  Home = "/",
  Search = "search",
  LibraryPlaylists = "collection/playlists",
  LibraryPodcasts = "collection/podcasts",
  LibraryArtists = "collection/artists",
  LibraryAlbums = "collection/albums",
  LikedSongs = "collection/tracks",
  Marketplace = "marketplace"
}

let menuItems: Spicetify.Menu.Item[] = [];

async function main() {

  while (!Spicetify?.showNotification) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // If it's the first time the user runs the extension, default to home page.
  if (localStorage.getItem("startup-page-name") === null) {
    localStorage.setItem("startup-page-name", "Home");
    localStorage.setItem("startup-page-uri", "/")
  }

  initMenu();
  
  // Go to the user's selected startup page on app startup
  Spicetify.Platform.History.push(localStorage.getItem("startup-page-uri"));
}

function initMenu() {

  // Each value in itemsNames has to match a Page to be able to retrieve the corresponding URI later on
  const itemsNames = ["Home", "Search", "LibraryPlaylists", "LibraryPodcasts", "LibraryArtists", "LibraryAlbums", "LikedSongs", "Marketplace"];

  itemsNames.forEach(itemName => {
    menuItems.push(
      new Spicetify.Menu.Item(itemName, (localStorage.getItem("startup-page-name") == itemName ? true : false), (self) => {
        toggleStartupPage(self);
      })
    )
  });

  new Spicetify.Menu.SubMenu("Startup page", menuItems).register();
}

function toggleStartupPage(clickedStartupPageItem: Spicetify.Menu.Item) {
  menuItems.forEach(menuItem => {
    menuItem.setState(false);
  });

  clickedStartupPageItem.setState(true);
  
  localStorage.setItem("startup-page-name", clickedStartupPageItem.name);
  localStorage.setItem("startup-page-uri", (Page as Record<string, string>)[clickedStartupPageItem.name]);
}

export default main;