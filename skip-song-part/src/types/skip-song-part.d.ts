type SkipSongPartStorage = {
    [key: string]: SongData
}

type SongData = {
    artist: string,
    song: string,
    segments: SongSegment[]
}

type SongSegments = {
    [key: number]: SongSegment
}
  
type SongSegment = {
    start: number,
    end: number
}