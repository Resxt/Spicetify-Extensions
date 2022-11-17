var skipDsongDpart=(()=>{var t="skip-song-part";function e(){return Spicetify.LocalStorage.get(t)}function s(){return JSON.parse(e())}function o(e){Spicetify.LocalStorage.set(t,JSON.stringify(e))}function r(e){var t=s();delete t[e],o(t)}function l(){return null==e()||null==e()||"{}"==e()}function c(e){var t=Math.floor(e/6e4),e=(e%6e4/1e3).toFixed(0);return(+t<10?"0":"")+t+":"+(+e<10?"0":"")+e}function n(e){return getComputedStyle(document.querySelector(":root")).getPropertyValue("--"+e)}var a=Spicetify.React;function i(e){s();r(e.target.attributes.songKey.value),e.target.parentElement.classList.add("d-none"),l()&&d()}function p(n){let a=s();const i=n.target.attributes.songKey.value;0==function(t){let n=0;for(let e=0;e<t.length;e++){var a=t.item(e);null!=a&&a.classList.contains("d-none")||n++}return n}(n.target.parentElement.children)-2?(r(i),n.target.parentElement.classList.add("d-none")):a[i].segments.forEach((e,t)=>{e.start==n.target.attributes.songData.value&&(a[i].segments.splice(t,1),o(a),n.target.classList.add("d-none"))}),l()&&d()}function u(){var t=document.getElementsByClassName("ssp-song-div");for(let e=0;e<t.length;e++)t[e].classList.add("d-none"),r(t[e].children[0].attributes[1].value);d()}function d(){Spicetify.PopupModal.hide(),Spicetify.showNotification("All segments have been deleted")}var g=function(){new Spicetify.Menu.Item("Skip song part menu",!1,()=>{!async function(){var e=a.createElement("div",{className:"ssp-container"},a.createElement("style",{dangerouslySetInnerHTML:{__html:`
      .ssp-container {
        text-align: center;
      }
      
      .ssp-container hr {
        margin-top: 2rem;
        margin-bottom: 2rem;
      }
      
      .ssp-song-div {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      
      .ssp-song-div:not(:last-child) {
        margin-bottom: 2rem;
      }
      
      .ssp-song-label {
        font-weight: bold;
      }
      
      .ssp-song-label:hover {
        text-decoration: line-through;
        opacity: 50%;
      }
      
      .ssp-song-segment {
        font-size: 0.825rem;
      }
      
      .ssp-song-segment:hover {
        text-decoration: line-through;
        opacity: 50%;
      }
      
      .ssp-buttons {
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
      
      .ssp-buttons:hover {
        transform: scale(1.04);
        border-color: var(--spice-text);
      }
      
      .d-none {
        display: none;
      }
      `}}),a.createElement("p",{id:"ssp-how-to-1"},"Use ALT+S to add segments to skip"),a.createElement("p",{id:"ssp-how-to-2",className:l()?"d-none":""},"Click on a song or a segment to delete it"),a.createElement("hr",{id:"ssp-separator-1",color:n("spice-text"),size:1,className:l()?"d-none":""}),Object.entries(s()).map(([n,e],t)=>a.createElement("div",{className:"ssp-song-div"},a.createElement("label",{className:"ssp-song-label col description",songKey:n,onClick:i},e.artist+" - "+e.song),Object.entries(e.segments).map(([,e],t)=>a.createElement("span",{className:"ssp-song-segment",songKey:n,songData:e.start,onClick:p},c(e.start)+" to "+c(e.end))))),a.createElement("hr",{id:"ssp-separator-2",color:n("spice-text"),size:1,className:l()?"d-none":""}),a.createElement("button",{id:"ssp-delete-all",className:l()?"ssp-buttons d-none":"ssp-buttons",onClick:u},"Delete all segments"));Spicetify.PopupModal.display({title:"Skip song part menu",content:e,isLarge:!1})}()}).register()},f=-1,m=f,y=f;function v(){var e=Spicetify.Player.getProgress();if(m==f)m=e,Spicetify.showNotification("Starting creation of skip segment");else{var a=Spicetify.Player.data||Spicetify.Queue;if(y=e,null!==a.track&&null!==(null==(i=a.track)?void 0:i.uri)){var i=null==(i=a.track)?void 0:i.uri;var r=function(e){let t=e.metadata.artist_name,n=1;for(;;){var a=e.metadata["artist_name:"+n];if(n++,null==a){t.trim();break}t+=", "+a}return t}(a.track);a=null==(a=a.track)?void 0:a.metadata.title;let e=s(),t=e[i],n={start:m,end:y};void 0===t?t={artist:r,song:a,segments:[n]}:t.segments.push(n);e[i]=t,o(e)}Spicetify.showNotification("Skip segment from "+c(m)+" to "+c(e)+" saved"),S()}}function S(){y=m=f}var b=async function(){for(;null==Spicetify||!Spicetify.showNotification;)await new Promise(e=>setTimeout(e,100));g(),null===e()&&o({}),Spicetify.Mousetrap.bind("alt+s",v),Spicetify.Player.addEventListener("songchange",()=>{var e,t,n=Spicetify.Player.data||Spicetify.Queue;n&&(S(),void 0!==(t=s())[null==(e=n.track)?void 0:e.uri])&&!async function(e,t){for(;Spicetify.Player.isPlaying;){var n=Spicetify.Player.data||Spicetify.Queue;if((null==(n=n.track)?void 0:n.uri)!==e)break;const a=Spicetify.Player.getProgress();Object.entries(t).forEach(([,e],t)=>{a>=e.start&&a<e.end&&Spicetify.Player.seek(e.end)}),await function(t){return new Promise(e=>setTimeout(e,t))}(1e3)}}(null==(e=n.track)?void 0:e.uri,t[null==(e=n.track)?void 0:e.uri].segments)})};(async()=>{await b()})()})();