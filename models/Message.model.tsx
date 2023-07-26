export interface MessageModel {
    _id: String,
    from: String,
    to: String,
    message: String,
    seen: Boolean,
    createdAt: Date,
    updatedAt: Date,
}