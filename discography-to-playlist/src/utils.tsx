export async function getUserId(): Promise<string> {
  const user = await Spicetify.Platform.UserAPI.getUser();

  return user.username;
}

export async function getArtistData(artistId: string): Promise<GetArtistResponse> {
  return await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/artists/${artistId}`);
}

/**
* Convert image from a URL to base64 format
* @param src The src URL of the image to encode ot base64
* @param outputFormat The output format of the image as supported by Canvas API
*/
// Copied from here: https://github.com/daksh2k/Spicetify-stuff/blob/ea9b0593d33dfb4f031f344ec96d76a8cf4b3b31/Extensions/savePlaylists.js#L26
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