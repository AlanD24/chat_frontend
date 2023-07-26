import { types } from "@/types/types";

/* const initialState = {
    _id: "",
    activeChat: null, // _user of the other user who
    users: [], // all users from DB
    messages: [] // chat selected
} */

export const chatReducer = ( chatState: any, action: any ) => {
        
    switch( action.type ) {
        case types.loadedUsers:
            return {
                ...chatState,
                users: [ ...action.payload ]
            }
        case types.activateChat:
            if( chatState.activeChat === action.payload ) return chatState;
            
            return {
                ...chatState,
                activeChat: action.payload,
                messages: []
            }
        case types.newMessage:
            if( chatState?.activeChat === action?.payload?.from ||
                chatState?.activeChat === action?.payload?.to    
            ) {
                return {
                    ...chatState,
                    messages: [...chatState.messages, action.payload]
                }
            } else {
                return chatState;
            }
        case types.loadMessages:
            return {
                ...chatState,
                messages: [ ...action.payload ]
            }
        case types.clearChatState:
            return {
                _id: "",
                activeChat: null, // _user of the other user who
                users: [], // all users from DB
                messages: [] // chat selected
            }
        default:
            return chatState;
    }
}