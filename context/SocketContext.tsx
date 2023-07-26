import React, { useContext, useEffect } from 'react';
import { createContext } from 'react';

import { AuthContext } from '@/auth/AuthContext';
import { ChatContext } from './chat/ChatContext';
import { useSocket } from '@/hooks/useSocket';

import { types } from '@/types/types';
import { UserModel } from '@/models/User.model';
import { MessageModel } from '@/models/Message.model';
import { scrollToBottom, scrollToBottomAnimated } from '@/helpers/scrollToBottom';

interface AuthContextType {
    socket: any;
    online: boolean;
}

const defaultAuthContext: AuthContextType = {
    socket: null,
    online: false
};

interface ChildProps {
    children: any;
}

export const SocketContext = createContext<AuthContextType>( defaultAuthContext );

export const SocketProvider: React.FC<ChildProps> = ({ children }) => {

    const { socket, online, connectSocket, disconnectSocket } = useSocket( 'http://localhost:8080' );
    const { auth } = useContext( AuthContext );
    const { dispatch } = useContext( ChatContext );

    // Connect socket
    useEffect(() => {
        if( auth.logged ) {
            connectSocket();
        }
    }, [ auth, connectSocket ]);

    // Disconnect socket
    useEffect(() => {
        if( !auth.logged ) {
            disconnectSocket();
        }
    }, [ auth, disconnectSocket ]);

    // Listen to all online users
    useEffect(() => {
        if(socket?.connected) {
            socket?.on( "users-list", (users: UserModel[]) => {
                dispatch({
                    type: types.loadedUsers,
                    payload: users
                });
            });
        }
    }, [ socket, dispatch ]);

    // Listen to message
    useEffect(() => {
        socket?.on("personal-message", (message: MessageModel) => {
            // Dispatch of action
            dispatch({
                type: types.newMessage,
                payload: message
            });
            
            // Move scroll to end
            scrollToBottomAnimated('messages')
        });
    }, [ socket, dispatch ]);
    
    return (
        <SocketContext.Provider value={{ socket, online }}>
            { children }
        </SocketContext.Provider>
    )
}