import {getPlaylistMetadata, normalizeImageSources} from "./playlist-metadata";

async function main() {
  while (!Spicetify?.showNotification) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  const artistAvatarImageMenuItem = new Spicetify.ContextMenu.Item("Artist avatar image", onArtistAvatarImageMenuItemClicked, () => { return true }, "external-link");
  const artistBannerImageMenuItem = new Spicetify.ContextMenu.Item("Artist banner image", onArtistBannerImageMenuItemClicked, () => { return true }, "external-link");
  const artistGalleryImagesMenuItem = new Spicetify.ContextMenu.Item("Artist gallery images", onArtistGalleryImagesMenuItemClicked, () => { return true }, "external-link");
  const artistAllImagesMenuItem = new Spicetify.ContextMenu.Item("All artist images", onArtistAllImagesMenuItemClicked, () => { return true }, "external-link");

  new Spicetify.ContextMenu.SubMenu("Open image", [artistAvatarImageMenuItem, artistBannerImageMenuItem, artistGalleryImagesMenuItem, artistAllImagesMenuItem], (uris) => {
    return Spicetify.URI.isArtist(uris[0]);
  }).register();

  new Spicetify.ContextMenu.Item("Open cover image", onAlbumMenuItemClicked, (uris) => {
    const uri = uris[0];

    return (Spicetify.URI.isTrack(uri) || Spicetify.URI.isAlbum(uri));
  },
    "external-link").register();

  new Spicetify.ContextMenu.Item("Open cover image", onPlaylistMenuItemClicked, (uris) => {
    const uri = uris[0];

    return Spicetify.URI.isPlaylistV1OrV2(uri);
  },
    "external-link").register();
}



let lastFetchedArtistUri: string;
let lastFetchedArtistData: any;



function onArtistAvatarImageMenuItemClicked(uris: string[]) {
  openArtistAvatarImage(uris[0]);
}

function onArtistBannerImageMenuItemClicked(uris: string[]) {
  openArtistBannerImage(uris[0]);
}

function onArtistGalleryImagesMenuItemClicked(uris: string[]) {
  openArtistGalleryImages(uris[0]);
}

async function onArtistAllImagesMenuItemClicked(uris: string[]) {
  onArtistAvatarImageMenuItemClicked(uris);
  await new Promise(resolve => setTimeout(resolve, 500));
  onArtistBannerImageMenuItemClicked(uris);
  await new Promise(resolve => setTimeout(resolve, 500));
  onArtistGalleryImagesMenuItemClicked(uris);
}

function onAlbumMenuItemClicked(uris: string[]) {
  openAlbumCoverImage(uris[0]);
}

function onPlaylistMenuItemClicked(uris: string[]) {
  // The error is already reported through the extension's notification helper.
  void openPlaylistCoverImage(uris[0]).catch(() => {});
}



async function openArtistAvatarImage(uri: string) {
  const artistVisuals = await getArtistVisuals(uri);

  window.open(artistVisuals.avatarImage.sources[0].url);
}

/**
 * This function checks for 2 different potential routes for `headerImage`  
 * to ensure it works with both `v1` and `v2` version of the API
 * 
 * Old Spotify (such as 2023) uses `v1` version  
 * In `v2` (current API) it seems that for whatever reason they moved the banner variable outside of the visuals object
 */
async function openArtistBannerImage(uri: string) {
  const artistData = await getArtistData(uri);
  const artistVisuals = await getArtistVisuals(uri);

  let url = null;

  if (artistData.data.artistUnion.headerImage != null) {
    url = artistData.data.artistUnion.headerImage.data.sources[0].url;
  } else if (artistVisuals.headerImage != null) {
    url = artistVisuals.headerImage.sources[0].url;
  } else {
    throw logError("Artist does not have a banner image");
  }

  window.open(url);
}

async function openArtistGalleryImages(uri: string) {
  const artistVisuals = await getArtistVisuals(uri);

  if (artistVisuals.gallery.items.length == 0) {
    throw logError("Artist does not have any images in gallery");
  }
  else {
    artistVisuals.gallery.items.forEach((element: { sources: { url: any; }[]; }) => {
      window.open(element.sources[0].url);
    });
  }
}

async function openAlbumCoverImage(uri: string) {
  if (Spicetify.URI.isAlbum(uri)) {
    const albumData = await getAlbumData(uri);

    window.open(albumData.data.albumUnion.coverArt.sources[2].url);
  }
  else {
    const trackData = await getTrackData(uri);

    window.open(trackData.data.tracks[0].albumOfTrack.coverArt.sources[2].url);
  }
}

async function openPlaylistCoverImage(uri: string) {
  try {
    const metadata = await getPlaylistMetadata(uri);
    const image = normalizeImageSources(metadata.images)[0];
    if (!image) throw new Error("Playlist does not have a cover image");
    window.open(image.url);
  } catch (error) {
    throw logError(error instanceof Error ? error.message : "Failed to retrieve playlist data");
  }
}



/**
 * This function stores the fetched artist's data in a variable to avoid making additional (unnecessary) API calls  
 * when the same artist's data is being requested several times in a row
 * 
 * For example, this behavior is observed by requesting the artist's data 3 times in just one function call  
 * with the `onArtistAllImagesMenuItemClicked` function
 */
async function getArtistData(uri: string) {
  try {
    if (lastFetchedArtistUri != uri) {
      lastFetchedArtistUri = uri;

      lastFetchedArtistData = getData("queryArtistOverview",
        {
          uri: uri,
          includePrerelease: false
        })
    }

    return lastFetchedArtistData;
  } catch (error) {
    throw logError("Failed to retrieve artist data");
  }
}

async function getArtistVisuals(uri: string) {
  const artistData = await getArtistData(uri);

  return artistData.data.artistUnion.visuals;
}

async function getTrackData(uri: string) {
  return getData("decorateContextTracks",
    { uris: [uri] });
}

async function getAlbumData(uri: string) {
  return getData("getAlbum", {
    uri: uri,
    offset: 0,
    limit: 1
  });
}




async function getData(query: any, variables: any) {
  try {
    return await fetchAndValidateGraphQL(
      Spicetify.GraphQL.Definitions[query],
      variables
    );
  } catch (error) {
    throw logError("Failed to retrieve data");
  }
}

async function fetchAndValidateGraphQL(query: any, variables: any) {
  const response = await Spicetify.GraphQL.Request(query, variables);

  if (response.errors && response.errors.length > 0) {
    throw new Error("Data is undefined or empty");
  }

  return response;
}

function logError(message: string) {
  Spicetify.showNotification(message, true, 2500);
  throw new Error(message);
}



export default main;
