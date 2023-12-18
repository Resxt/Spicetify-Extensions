var removeDunplayableDsongs=(()=>{var e=Spicetify.React;async function t(t){t=await Spicetify.CosmosAsync.get("sp://core-playlist/v1/playlist/"+t[0]);if(t.playlist.userCapabilities.canAdministratePermissions){let e=[];t.items.forEach(t=>{t.playable||e.push({uri:t.link})});var o,i,t=Spicetify.URI.fromString(t.playlist.link).id;void 0!==t&&(o=t,function(o){var i=[[]];for(let e=0;e<o.length;e+=100){let t=e+100;t>o.length&&(t=o.length),i.push(o.slice(e,t))}return i}(i=e).forEach(t=>{Spicetify.CosmosAsync.del(`https://api.spotify.com/v1/playlists/${o}/tracks`,{tracks:t}).catch(t=>{Spicetify.showNotification("Failed to remove unplayable songs. See console for more details"),console.error(t)}).then(()=>{0==i.length?Spicetify.showNotification("No unplayable songs found"):Spicetify.showNotification("Successfully removed "+i.length+" unplayable songs")})}))}else Spicetify.showNotification("You are not allowed to remove songs in this playlist")}async function o(){const e=await async function(){var t=await Spicetify.CosmosAsync.get("https://api.spotify.com/v1/me");let e=[],o=await Spicetify.CosmosAsync.get("https://api.spotify.com/v1/me/tracks?limit=50&market="+t.country);o.items.forEach(t=>{t.track.is_playable||e.push(t.track.id)});for(;null!=o.next&&null!=o.next;)(o=await Spicetify.CosmosAsync.get(o.next)).items.forEach(t=>{t.track.is_playable||e.push(t.track.id)});return e}();(function(o){var i=[[]];for(let e=0;e<o.length;e+=50){let t=e+50;t>o.length&&(t=o.length),i.push(o.slice(e,t))}return i})(e).forEach(t=>{Spicetify.CosmosAsync.del("https://api.spotify.com/v1/me/tracks?ids="+t.toString()).catch(t=>{Spicetify.showNotification("Failed to remove unplayable liked songs. See console for more details"),console.error(t)}).then(()=>{0==e.length?Spicetify.showNotification("No unplayable songs found"):Spicetify.showNotification("Successfully removed "+e.length+" unplayable songs")})})}function i(){o(),Spicetify.PopupModal.hide()}var n=async function(){for(;null==Spicetify||!Spicetify.showNotification;)await new Promise(t=>setTimeout(t,100));new Spicetify.ContextMenu.Item("Remove unplayable songs",t,t=>Spicetify.URI.isPlaylistV1OrV2(t[0]),"block").register(),async function(){let t=document.querySelector('.main-collectionLinkButton-collectionLinkButton[href="/collection/tracks"]');for(;!t;)await new Promise(t=>setTimeout(t,100)),t=document.querySelector('.main-collectionLinkButton-collectionLinkButton[href="/collection/tracks"]');t.addEventListener("contextmenu",()=>{!async function(){var t=e.createElement("div",{className:"rus-container"},e.createElement("style",{dangerouslySetInnerHTML:{__html:`
      .rus-container {
        text-align: center;
      }
      
      .rus-buttons {
        -webkit-tap-highlight-color: transparent;
        font-weight: 700;
        font-family: var(--font-family,CircularSp,CircularSp-Arab,CircularSp-Hebr,CircularSp-Cyrl,CircularSp-Grek,CircularSp-Deva,var(--fallback-fonts,sans-serif));
        background-color: transparent;
        border-radius: 500px;
        transition-duration: 33ms;
        transition-property: background-color, border-color, color, box-shadow, filter, transform;
        padding-inline: 15px;
        border: 1px solid #727272;
        color: var(--spice-text);
        min-block-size: 32px;
      }
      
      .rus-buttons:hover {
        transform: scale(1.04);
        border-color: var(--spice-text);
      }
      `}}),e.createElement("button",{id:"rus-remove-all-unplayble-songs",className:"rus-buttons",onClick:i},"Remove all unplayable songs in my liked songs"));Spicetify.PopupModal.display({title:"Remove unplayable songs",content:t,isLarge:!1})}()})}()};(async()=>{await n()})()})();