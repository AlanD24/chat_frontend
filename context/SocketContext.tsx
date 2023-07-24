import React from 'react';
import { createContext } from 'react';
import { useSocket } from '../hooks/useSocket';

interface AuthContextType {
    socket: any;
    online: boolean;
}

const defaultAuthContext: AuthContextType = {
    socket: {},
    online: false
};

interface ChildProps {
    children: any;
}

export const SocketContext = createContext<AuthContextType>(defaultAuthContext);


export const SocketProvider: React.FC<ChildProps> = ({ children }) => {

    const { socket, online } = useSocket('http://localhost:8080');
    
    return (
        <SocketContext.Provider value={{ socket, online }}>
            { children }
        </SocketContext.Provider>
    )
}