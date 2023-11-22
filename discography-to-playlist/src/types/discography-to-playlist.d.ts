type CreatePlaylistBody = {
    name: string,
    public?: boolean,
    collaborative?: boolean,
    description?: string
}

type CreatePlaylistResponse = {
    id: string
}

type GetArtistResponse = {
    images: [{
        url: string
    }],
    name: string
}

type GetArtistAlbumsReponse = {
    next: string,
    items: [{
        artists: [{
            id: string
        }],
        id: string,
        name: string
    }]
}

type GetAlbumTracksResponse = {
    items: [{
        artists: [{
            id: string
        }],
        name: string,
        uri: string
    }]
}