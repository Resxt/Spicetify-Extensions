const test = require("node:test");
const assert = require("node:assert/strict");
const loadSource = require("./load-source.cjs");

function setup(metadata, failure) {
  const menus = [], opened = [], notifications = [], calls = [];
  class Item {
    constructor(name, click, visible) { Object.assign(this, {name, click, visible}); }
    register() { menus.push(this); }
  }
  const Spicetify = {
    showNotification: message => notifications.push(message),
    ContextMenu: {Item, SubMenu: Item},
    URI: {isArtist: uri => uri.startsWith("spotify:artist:"), isAlbum: uri => uri.startsWith("spotify:album:"),
      isTrack: uri => uri.startsWith("spotify:track:"), isPlaylistV1OrV2: uri => uri.startsWith("spotify:playlist:")},
    Platform: {PlaylistAPI: {getMetadata: async uri => {calls.push(uri); if (failure) throw failure; return metadata;}}},
    GraphQL: {Definitions: {}, Request: () => {throw new Error("Unexpected GraphQL call");}}
  };
  return {app: loadSource("app.tsx", {Spicetify, window: {open: url => opened.push(url)}}), menus, opened, notifications, calls};
}

test("playlist menu uses Platform metadata and preserves existing menu registration", async () => {
  const fixture = setup({images: [{url: "https://example.com/cover"}]});
  await fixture.app.default();
  assert.deepEqual(fixture.menus.map(menu => menu.name), ["Open image", "Open cover image", "Open cover image"]);
  const playlistMenu = fixture.menus[2];
  assert.equal(playlistMenu.visible(["spotify:playlist:test"]), true);
  assert.equal(playlistMenu.visible(["spotify:album:test"]), false);
  playlistMenu.click(["spotify:playlist:test"]);
  await new Promise(setImmediate);
  assert.deepEqual(fixture.calls, ["spotify:playlist:test"]);
  assert.deepEqual(fixture.opened, ["https://example.com/cover"]);
  assert.deepEqual(fixture.notifications, []);
});

for (const [name, metadata, failure, message] of [
  ["missing cover", {images: []}, null, "Playlist does not have a cover image"],
  ["malformed image", {images: [null, {}, {url: "javascript:alert(1)"}]}, null, "Playlist does not have a cover image"],
  ["invalid metadata", null, null, "Failed to retrieve playlist data"],
  ["network failure", null, new Error("offline"), "Failed to retrieve playlist data"]
]) test(name + " reports an English notification without opening a browser", async () => {
  const fixture = setup(metadata, failure);
  await fixture.app.default(); fixture.menus[2].click(["spotify:playlist:test"]);
  await new Promise(setImmediate);
  assert.deepEqual(fixture.opened, []); assert.deepEqual(fixture.notifications, [message]);
});

test("metadata normalization handles nested sources, image URIs and duplicate/invalid URLs", () => {
  const {normalizeImageSources} = loadSource("playlist-metadata.ts");
  const sources = normalizeImageSources({items: [null, {sources: [null, {uri: "spotify:image:abc", width: 320, height: 320},
    {url: "https://i.scdn.co/image/abc"}, {url: "http://example.com/unsafe"}]}]});
  assert.deepEqual(Array.from(sources, source => ({...source})), [{url: "https://i.scdn.co/image/abc", width: 320, height: 320}]);
  assert.equal(normalizeImageSources("bad metadata").length, 0);
});
