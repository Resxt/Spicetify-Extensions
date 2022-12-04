type ArtistData = {
    name: string,
    images: ArtistImageData[]
}

type ArtistImageData = {
    url: string
}

type AlbumsData = {
    items: [],
    next: string,
    total: number
}

type SongData = {
    album_type: string,
}

type PlaylistData = {
    name: string,
    id: string
}

type UserData = {
    id: string
}

type CreatePlaylistBody = {
    name: string,
    public: boolean,
    collaborative: boolean,
    description: string
}