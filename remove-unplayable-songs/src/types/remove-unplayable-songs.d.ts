type PlaylistData = {
    items: [PlaylistSongData],
    playlist: PlaylistPlaylistData
}

type LikedSongsData = {
    items: [LikedSongData],
    next: string
}

type LikedSongData = {
    track: {
        id: string,
        is_playable: boolean
    }
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