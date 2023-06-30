var skipDsongDpart=(()=>{var t="skip-song-part";function a(){return Spicetify.LocalStorage.get(t)}function r(){return JSON.parse(a())}function o(e){Spicetify.LocalStorage.set(t,JSON.stringify(e))}function n(e){var t=r();delete t[e],o(t)}function l(){return null==a()||null==a()||"{}"==a()}function c(e){var t=Math.floor(e/6e4),e=(e%6e4/1e3).toFixed(0);return(+t<10?"0":"")+t+":"+(+e<10?"0":"")+e}function i(t){return new Promise(e=>setTimeout(e,t))}function s(e){return getComputedStyle(document.querySelector(":root")).getPropertyValue("--"+e)}var p=Spicetify.React,d={dangerouslySetInnerHTML:{__html:`
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

    #ssp-import-export-textarea {
      background-color: transparent;
      color: var(--spice-text);
      height: 25vh;
      width: 100%;
    }
    
    .d-none {
      display: none;
    }
    `}};async function u(){var e=p.createElement("div",{className:"ssp-container"},p.createElement("style",d),p.createElement("p",{id:"ssp-how-to-1"},"Clicking the Save button will override all your saved segments!"),p.createElement("p",{id:"ssp-how-to-2"},"Tip: You can use CTRL + A to select everything in the text area"),p.createElement("hr",{id:"ssp-separator-1",color:s("spice-text"),size:1}),p.createElement("h2",{id:"ssp-how-to-title-3"},"Importing saved segments"),p.createElement("p",{id:"ssp-how-to-3"},"Delete everything in the text area below, paste your previously saved skips (from the text file) inside the textarea below, then click on Save"),p.createElement("hr",{id:"ssp-separator-2",color:s("spice-text"),size:1}),p.createElement("h2",{id:"ssp-how-to-title-4"},"Exporting saved segments"),p.createElement("p",{id:"ssp-how-to-4"},"Copy everything in the text area below in a text file on your PC"),p.createElement("hr",{id:"ssp-separator-3",color:s("spice-text"),size:1}),p.createElement("textarea",{id:"ssp-import-export-textarea",autofocus:"true"},a()),p.createElement("hr",{id:"ssp-separator-4",color:s("spice-text"),size:1}),p.createElement("button",{id:"ssp-import-export-save",className:"ssp-buttons",onClick:y},"Save"));Spicetify.PopupModal.hide(),await i(500),Spicetify.PopupModal.display({title:"Skip song part - Import/Export",content:e,isLarge:!0})}function m(e){n(e.target.attributes.songKey.value),e.target.parentElement.classList.add("d-none"),l()&&v()}function g(a){let s=r();const i=a.target.attributes.songKey.value;0==function(t){let a=0;for(let e=0;e<t.length;e++){var s=t.item(e);null!=s&&s.classList.contains("d-none")||a++}return a}(a.target.parentElement.children)-2?(n(i),a.target.parentElement.classList.add("d-none")):s[i].segments.forEach((e,t)=>{e.start==a.target.attributes.songData.value&&(s[i].segments.splice(t,1),o(s),a.target.classList.add("d-none"))}),l()&&v()}function f(){var t=document.getElementsByClassName("ssp-song-div");for(let e=0;e<t.length;e++)t[e].classList.add("d-none"),n(t[e].children[0].attributes[1].value);v()}function y(){var e=document.getElementById("ssp-import-export-textarea").value;e&&null!=e&&(Spicetify.LocalStorage.set(t,e),Spicetify.PopupModal.hide(),Spicetify.showNotification("Skips data successfully imported"))}function v(){Spicetify.PopupModal.hide(),Spicetify.showNotification("All segments have been deleted")}var e=function(){new Spicetify.Menu.Item("Skip song part menu",!1,()=>{!async function(){var e=p.createElement("div",{className:"ssp-container"},p.createElement("style",d),p.createElement("p",{id:"ssp-how-to-1"},"Use ALT+S to add segments to skip"),p.createElement("p",{id:"ssp-how-to-2",className:l()?"d-none":""},"Click on a song or a segment to delete it"),p.createElement("hr",{id:"ssp-separator-1",color:s("spice-text"),size:1,className:l()?"d-none":""}),Object.entries(r()).map(([a,e],t)=>p.createElement("div",{className:"ssp-song-div"},p.createElement("label",{className:"ssp-song-label col description",songKey:a,onClick:m},e.artist+" - "+e.song),Object.entries(e.segments).map(([,e],t)=>p.createElement("span",{className:"ssp-song-segment",songKey:a,songData:e.start,onClick:g},c(e.start)+" to "+c(e.end))))),p.createElement("hr",{id:"ssp-separator-2",color:s("spice-text"),size:1,className:l()?"d-none":""}),p.createElement("button",{id:"ssp-delete-all",className:l()?"ssp-buttons d-none":"ssp-buttons",onClick:f},"Delete all segments"),p.createElement("button",{id:"ssp-import-export",className:"ssp-buttons",onClick:u},"Import/Export"));Spicetify.PopupModal.display({title:"Skip song part - Saved segments",content:e,isLarge:!0})}()}).register()},h=-1,S=h,b=h;function x(){var e=Spicetify.Player.getProgress();if(S==h)S=e,Spicetify.showNotification("Starting creation of skip segment");else{var s=Spicetify.Player.data||Spicetify.Queue;if(b=e,null!==s.track&&null!==(null==(i=s.track)?void 0:i.uri)){var i=null==(i=s.track)?void 0:i.uri;var n=function(e){let t=e.metadata.artist_name,a=1;for(;;){var s=e.metadata["artist_name:"+a];if(a++,null==s){t.trim();break}t+=", "+s}return t}(s.track);s=null==(s=s.track)?void 0:s.metadata.title;let e=r(),t=e[i],a={start:S,end:b};void 0===t?t={artist:n,song:s,segments:[a]}:t.segments.push(a);e[i]=t,o(e)}Spicetify.showNotification("Skip segment from "+c(S)+" to "+c(e)+" saved"),k()}}function k(){b=S=h}var E=async function(){for(;null==Spicetify||!Spicetify.showNotification;)await new Promise(e=>setTimeout(e,100));e(),null===a()&&o({}),Spicetify.Mousetrap.bind("alt+s",x),Spicetify.Player.addEventListener("songchange",()=>{var e,t,a=Spicetify.Player.data||Spicetify.Queue;a&&(k(),void 0!==(t=r())[null==(e=a.track)?void 0:e.uri])&&!async function(e,t){for(;Spicetify.Player.isPlaying;){var a=Spicetify.Player.data||Spicetify.Queue;if((null==(a=a.track)?void 0:a.uri)!==e)break;const s=Spicetify.Player.getProgress();Object.entries(t).forEach(([,e],t)=>{s>=e.start&&s<e.end&&Spicetify.Player.seek(e.end)}),await i(1e3)}}(null==(e=a.track)?void 0:e.uri,t[null==(e=a.track)?void 0:e.uri].segments)})};(async()=>{await E()})()})();