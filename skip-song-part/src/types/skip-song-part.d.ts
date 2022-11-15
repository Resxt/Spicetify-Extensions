type SkipSongPartStorage = {
    [key: string]: SongSegments
}

type SongSegments = {
    [key: number]: SongSegment
}
  
type SongSegment = {
    start: number,
    end: number
}