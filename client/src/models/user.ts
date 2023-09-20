type Playlist = {
    name: String,
    videos: string[]
}
type User = {
    userId: string,
    email: string,
    password: string,
    imgUrl: string,
    subscribers: Number,
    subscribedUsers: string[],
    history: string[],
    liked: string[],
    userVideos: string[],
    watchLater: string[],
    playlist: Playlist[]
    createdAt: Date,
    updatedAt: Date,
    _id: string,
    __v: Number
}


export default User;