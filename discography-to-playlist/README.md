# discography-to-playlist

![preview](https://raw.githubusercontent.com/Resxt/Spicetify-Extensions/main/discography-to-playlist/assets/preview.png)

`discography-to-playlist` is a [Spicetify](https://spicetify.app/) extension that allows you to create a playlist with the entire discography of an artist.  

This is quite useful if you want your own playlist of an artist that only features the songs you like after filtering out the ones you don't like.

## How to use it?

Simply right click on any element that links to an artist (his name under a track, his banner on his profile and so on) then click on "Create playlist from discography".  
It will then create a playlist with the artist's profile picture and name.  

Just wait for the extension to process all the tracks and you will be prompted with a popup letting you know the process is finished.  
You will then see the tracks appear in the newly created playlist.

## Notes

- Don't hesitate to contact me on [Discord](https://github.com/Resxt) or to open issues regarding any feedback or issue you may have. Please try to provide as much info and context as you can. Explaining when, what and why makes it easier to understand why you want something added or how I can potentially solve an issue you may have
- There are a lot of possibilities for future updates and potential issues due to how much data and cases there are to handle
- The extension filters out most duplicates but you may still have some since their names may differ or their exposed duration in the API may differ which makes it hard to identify them. The majority of mixes/compilations are also filtered out. You should only get the songs from their original album and not from a "Summer Mix" made by "Various Artists" for example
- I might add a way to sort the playlists in a future update but for now you can use another extension such as [Sort By Play Count](https://github.com/Tetrax-10/Spicetify-Extensions#1-sort-by-play-count) (which isn't only about play count) or use a website for it such as [Skiley](https://skiley.net/)
- Creating a playlist within a folder will most likely never be a feature since this is not possible due to [Spotify's API limitations](https://developer.spotify.com/documentation/web-api/concepts/playlists)
- Once the playlist is created it's yours. Feel free to edit the image, name and description if you want to. It won't cause any issue

## Made with Spicetify Creator
- https://github.com/spicetify/spicetify-creator
