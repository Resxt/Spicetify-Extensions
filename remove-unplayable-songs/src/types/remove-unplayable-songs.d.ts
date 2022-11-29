type PlaylistData = {
    items: [PlaylistSongData],
    playlist: PlaylistPlaylistData
}

type PlaylistSongData = {
    playable: boolean,
    link: string
}

type PlaylistPlaylistData = {
    allows: {
        insert: boolean,
        remove: boolean
    }
    link: string
}

type PlaylistSong = {
    uri: string
}