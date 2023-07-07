# full-queue-clear

![preview](https://raw.githubusercontent.com/Resxt/Spicetify-Extensions/main/full-queue-clear/assets/preview.png)

`full-queue-clear` is a [Spicetify](https://spicetify.app/) extension that makes it possible to clear the queue the way you want.  
Essentially this a one click queue clear for the playlist/album you clicked play on alone or the regular queue too (songs added by clicking "Add to queue").  
This is used as a one click fresh start/reset for your entire queue or as a one click context queue clear, similar to how you can clear the regular queue.

## Why use this?

I created this because I want to listen exactly what I want in the order that I want.  
The way Spotify handles the queue with tracks coming from "context" (you clicking play on a playlist) and "queue" (you clicking on "Add to queue") isn't ideal in my opinion.  

For example this is what happens if I click on my "The Weeknd" playlist and add my "Lil Nas X" playlist to the queue.  
It splits my two playlists in a way that I don't want instead of playing the second playlist once the first ends like I expected.  

![info1](https://raw.githubusercontent.com/Resxt/Spicetify-Extensions/main/full-queue-clear/assets/info1.png)

The most simple example is how the "Clear queue" button only clears the tracks from the queue (songs added with "Add to queue") but doesn't clear the songs coming from the context in your queue (you clicking play on a playlist/album etc).  
This creates a desynced queue/behavior that I don't like.  

This extension is my take on trying to have a single/unified queue that's not split by queue and context.  

## How to use it?

There are three available methods to clear the queue that have different results

<details><summary>Click to view reference image</summary>

![info1](https://raw.githubusercontent.com/Resxt/Spicetify-Extensions/main/full-queue-clear/assets/info1.png)

</details>  

### Real queue clear

This will clear your entire queue (context and queue) while keeping the currently playing song in the queue.  
This is how Spotify does it when you click "Clear queue" except that Spotify only clears the queue while leaving the context tracks in your queue.  
This allows you to easily start from a clean queue by adding tracks using "Add to queue" to actually queue them in the order you want.  

If you a look at the reference image above: this would clear everything you see and only keep "Out of Time" in the queue.

This is done by right clicking the queue icon inside the playbar (where the volume and lyrics icons are)

### Context queue clear

This will only clear your context queue (songs added when you clicked play on an album/playlist etc) while keeping the currently playing song in the queue.  
This does the same thing as clicking "Clear queue" expect here it clears the context tracks only.  

If you a look at the reference image above: this would clear everything added by clicking play on my "The Weeknd" playlist, only keeping the currently playing song and the songs I added by clicking on "Add to queue", in that case the Lil Nas X songs.  
This is pretty much as if you cancelled the fact that you clicked Play on an album/playlist etc.  

This is done by holding ALT and right clicking the queue icon inside the playbar (where the volume and lyrics icons are)

### Full queue clear

This is a more situational/rare use case.  

This will fully clear your queue while clearing the currently playing song as well.  
As a result your queue will be fully empty and your Spotify player won't be playing any song anymore, as if you just installed Spotify for the first time.  
This can be useful to take screenshots without having any songs playing for example.

If you a look at the reference image above: this would clear everything you see in the queue while also make your Spotify player play nothing.

This is done by holding CTRL and right clicking the queue icon inside the playbar (where the volume and lyrics icons are)

## Made with Spicetify Creator

- <https://github.com/spicetify/spicetify-creator>
