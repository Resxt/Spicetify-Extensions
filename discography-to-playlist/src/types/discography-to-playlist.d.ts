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