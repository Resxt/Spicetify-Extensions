export async function getUserId(): Promise<string> {
  const user = await Spicetify.Platform.UserAPI.getUser();

  return user.username;
}

/**
 * Get various information on an artist such as his name and his ID.  
 * See https://developer.spotify.com/documentation/web-api/reference/get-an-artist for more info
 */
export async function getArtist(artistId: string): Promise<GetArtistResponse> {
  return await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/artists/${artistId}`);
}

/**
 * Albums refer to every type of music collection/album: albums, singles, "appears on" and compilations.  
 * See https://developer.spotify.com/documentation/web-api/reference/get-an-artists-albums for more info
 */
export async function getArtistAlbums(apiUrl: string): Promise<GetArtistAlbumsReponse> {
  return await Spicetify.CosmosAsync.get(apiUrl);
}

/**
 * Albums refer to every type of music collection/album: albums, singles, "appears on" and compilations.  
 * See https://developer.spotify.com/documentation/web-api/reference/get-an-albums-tracks for more info
 */
export async function getAlbumTracks(albumId: string): Promise<GetAlbumTracksResponse> {
  return await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/albums/${albumId}/tracks?limit=50`);
}

export async function getArtistDiscography(artistId: string, groups: string) {
  const songsToAdd = new Map();
  let apiUrl = `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=${groups}&limit=50`;

  do {
    const result = await getArtistAlbums(apiUrl);
    apiUrl = result.next;

    for (const album of result.items) {
      // album artist is not "various artists" (id: 0LyfQWJT6nXafLPZqxe9Of)
      if (album.artists.find((artist) => artist.id == "0LyfQWJT6nXafLPZqxe9Of") === undefined) {
        const albumTracks = await getAlbumTracks(album.id);

        for (const albumTrack of albumTracks.items) {
          // artist is part of the track's artists && the song is not already in the songs to add
          if (albumTrack.artists.find((artist) => artist.id == artistId) !== undefined && !songsToAdd.has(albumTrack.name)) {          
            songsToAdd.set(albumTrack.name, albumTrack.uri);
          }
        }
      }
    }
  } while (apiUrl !== null && apiUrl !== undefined);

  return Promise.all(songsToAdd.values());
}

/**
 * Splits an array into multiple chunks/arrays. Each chunk's length cannot be higher than elementsPerArray
 * @param elementsPerArray the maximum amount of elements each chunk can have
 * @returns an array of chunks (arrays)
 */
export function splitArray(array: unknown[], elementsPerArray: number) {
  const chunks = [];

  for (let i = 0; i < array.length; i += elementsPerArray) {
    chunks.push(array.slice(i, i + elementsPerArray));
  }

  return chunks;
}

/**
* Convert image from a URL to base64 format.  
* Copied from here: https://github.com/daksh2k/Spicetify-stuff/blob/ea9b0593d33dfb4f031f344ec96d76a8cf4b3b31/Extensions/savePlaylists.js#L26
* @param src The src URL of the image to encode ot base64
* @param outputFormat The output format of the image as supported by Canvas API
*/
export function encodeImgFromUrl(src: string, outputFormat = "image/jpeg") {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "Anonymous";
    image.onload = function () {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      canvas.height = this.naturalHeight;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      canvas.width = this.naturalWidth;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ctx?.drawImage(this, 0, 0);
      const dataURL = canvas.toDataURL(outputFormat);
      resolve(dataURL);
    };
    image.onerror = (err) => {
      reject(new Error("Failed to load image."+ err));
    };
    image.src = src;
  });
}