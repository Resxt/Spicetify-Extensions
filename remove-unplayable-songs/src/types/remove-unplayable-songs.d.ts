type PlaylistData = {
    items: [PlaylistSongData],
    playlist: PlaylistPlaylistData
}

type PlaylistSongData = {
    playable: boolean,
    link: string
}

type PlaylistPlaylistData = {
    userCapabilities: {
        canAdministratePermissions: boolean
    }
    link: string
}

type PlaylistSong = {
    uri: string
}