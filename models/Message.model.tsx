export interface MessageModel {
    _id: string,
    from: string,
    to: string,
    message: string,
    createdAt: Date,
    updatedAt: Date,
}