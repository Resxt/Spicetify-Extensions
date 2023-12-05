!async function(){for(;!Spicetify.React||!Spicetify.ReactDOM;)await new Promise(e=>setTimeout(e,10));var t,i,s,e,o,r,l,n;t="skip-song-part",i=Spicetify.React,s={dangerouslySetInnerHTML:{__html:`
    .ssp-container {
      text-align: center;
    }
    
    .ssp-container hr {
      margin-top: 2rem;
      margin-bottom: 2rem;
    }

    #ssp-song-filter {
      text-align: center;
      padding-left: 2rem;
      padding-right: 2rem;
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
    `}},e=function(){new Spicetify.Menu.Item("Skip song part menu",!1,()=>{!async function(){var e=i.createElement("div",{className:"ssp-container"},i.createElement("style",s),i.createElement("p",{id:"ssp-how-to-1"},"Use ALT+S to add segments to skip"),i.createElement("p",{id:"ssp-how-to-2",className:u()?"d-none":""},"Click on a song or a segment to delete it"),i.createElement("hr",{id:"ssp-separator-1",color:f("spice-text"),size:1}),i.createElement("input",{id:"ssp-song-filter",type:"text",placeHolder:"Type to filter",autofocus:"true",className:u()?"d-none":"",onInput:h}),i.createElement("hr",{id:"ssp-separator-2",color:f("spice-text"),size:1,className:u()?"d-none":""}),Object.entries(c()).map(([s,e],t)=>i.createElement("div",{className:"ssp-song-div"},i.createElement("label",{className:"ssp-song-label col description",songKey:s,onClick:v},e.artist+" - "+e.song),Object.entries(e.segments).map(([,e],t)=>i.createElement("span",{className:"ssp-song-segment",songKey:s,songData:e.start,onClick:S},m(e.start)+" to "+m(e.end))))),i.createElement("hr",{id:"ssp-separator-3",color:f("spice-text"),size:1,className:u()?"d-none":""}),i.createElement("button",{id:"ssp-delete-all",className:u()?"ssp-buttons d-none":"ssp-buttons",onClick:b},"Delete all segments"),i.createElement("button",{id:"ssp-import-export",className:"ssp-buttons",onClick:y},"Import/Export"));Spicetify.PopupModal.display({title:"Skip song part - Saved segments",content:e,isLarge:!0})}()}).register()},l=r=o=-1,n=async function(){for(;null==Spicetify||!Spicetify.showNotification;)await new Promise(e=>setTimeout(e,100));e(),null===a()&&p({}),Spicetify.Mousetrap.bind("alt+s",w),Spicetify.Player.addEventListener("songchange",()=>{var e,t,s=Spicetify.Player.data||Spicetify.Queue;s&&(k(),void 0!==(t=c())[null==(e=s.item)?void 0:e.uri])&&!async function(e,t){for(;Spicetify.Player.isPlaying;){var s=Spicetify.Player.data||Spicetify.Queue;if((null==(s=s.item)?void 0:s.uri)!==e)break;const i=Spicetify.Player.getProgress();Object.entries(t).forEach(([,e],t)=>{i>=e.start&&i<e.end&&Spicetify.Player.seek(e.end)}),await g(1e3)}}(null==(e=s.item)?void 0:e.uri,t[null==(e=s.item)?void 0:e.uri].segments)})},(async()=>{await n()})();function a(){return Spicetify.LocalStorage.get(t)}function c(){return JSON.parse(a())}function p(e){Spicetify.LocalStorage.set(t,JSON.stringify(e))}function d(e){var t=c();delete t[e],p(t)}function u(){return null==a()||null==a()||"{}"==a()}function m(e){var t=Math.floor(e/6e4),e=(e%6e4/1e3).toFixed(0);return(+t<10?"0":"")+t+":"+(+e<10?"0":"")+e}function g(t){return new Promise(e=>setTimeout(e,t))}function f(e){return getComputedStyle(document.querySelector(":root")).getPropertyValue("--"+e)}async function y(){var e=i.createElement("div",{className:"ssp-container"},i.createElement("style",s),i.createElement("p",{id:"ssp-how-to-1"},"Clicking the Save button will override all your saved segments!"),i.createElement("p",{id:"ssp-how-to-2"},"Tip: You can use CTRL + A to select everything in the text area"),i.createElement("hr",{id:"ssp-separator-1",color:f("spice-text"),size:1}),i.createElement("h2",{id:"ssp-how-to-title-3"},"Importing saved segments"),i.createElement("p",{id:"ssp-how-to-3"},"Delete everything in the text area below, paste your previously saved skips (from the text file) inside the textarea below, then click on Save"),i.createElement("hr",{id:"ssp-separator-2",color:f("spice-text"),size:1}),i.createElement("h2",{id:"ssp-how-to-title-4"},"Exporting saved segments"),i.createElement("p",{id:"ssp-how-to-4"},"Copy everything in the text area below in a text file on your PC"),i.createElement("hr",{id:"ssp-separator-3",color:f("spice-text"),size:1}),i.createElement("textarea",{id:"ssp-import-export-textarea",autofocus:"true"},u()?"":a()),i.createElement("hr",{id:"ssp-separator-4",color:f("spice-text"),size:1}),i.createElement("button",{id:"ssp-import-export-save",className:"ssp-buttons",onClick:x},"Save"));Spicetify.PopupModal.hide(),await g(500),Spicetify.PopupModal.display({title:"Skip song part - Import/Export",content:e,isLarge:!0})}function h(e){const s=e.target.value.toLowerCase();document.querySelectorAll(".ssp-song-div").forEach(e=>{var t=e.getElementsByTagName("label")[0];null!==t.textContent&&(t.textContent.toLowerCase().includes(s)?e.style.display="":e.style.display="none")})}function v(e){d(e.target.attributes.songKey.value),e.target.parentElement.classList.add("d-none"),u()&&E()}function S(s){let i=c();const n=s.target.attributes.songKey.value;0==function(t){let s=0;for(let e=0;e<t.length;e++){var i=t.item(e);null!=i&&i.classList.contains("d-none")||s++}return s}(s.target.parentElement.children)-2?(d(n),s.target.parentElement.classList.add("d-none")):i[n].segments.forEach((e,t)=>{e.start==s.target.attributes.songData.value&&(i[n].segments.splice(t,1),p(i),s.target.classList.add("d-none"))}),u()&&E()}function b(){var t=document.getElementsByClassName("ssp-song-div");for(let e=0;e<t.length;e++)t[e].classList.add("d-none"),d(t[e].children[0].attributes[1].value);E()}function x(){var e=document.getElementById("ssp-import-export-textarea").value;e&&null!=e&&(Spicetify.LocalStorage.set(t,e),Spicetify.PopupModal.hide(),Spicetify.showNotification("Skips data successfully imported"))}function E(){Spicetify.PopupModal.hide(),Spicetify.showNotification("All segments have been deleted")}function w(){var e=Spicetify.Player.getProgress();if(r==o)r=e,Spicetify.showNotification("Starting creation of skip segment");else{var i=Spicetify.Player.data||Spicetify.Queue;if(l=e,null!==i.item&&null!==(null==(n=i.item)?void 0:n.uri)){var n=null==(n=i.item)?void 0:n.uri;var a=function(e){let t=e.metadata.artist_name,s=1;for(;;){var i=e.metadata["artist_name:"+s];if(s++,null==i){t.trim();break}t+=", "+i}return t}(i.item);i=null==(i=i.item)?void 0:i.metadata.title;let e=c(),t=e[n],s={start:r,end:l};void 0===t?t={artist:a,song:i,segments:[s]}:t.segments.push(s);e[n]=t,p(e)}Spicetify.showNotification("Skip segment from "+m(r)+" to "+m(e)+" saved"),k()}}function k(){l=r=o}}();