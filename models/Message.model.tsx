export interface MessageModel {
    _id: String,
    from: String,
    to: String,
    message: string | null,
    seen: Boolean,
    createdAt: Date,
    updatedAt: Date,
}