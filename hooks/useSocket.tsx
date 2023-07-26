import { useCallback, useEffect, useState } from 'react';
import * as io from 'socket.io-client';

export const useSocket = ( serverPath: any ) => {
    
    const [ socket, setSocket ] = useState<any>(null);
    const [ online, setOnline ] = useState(false);

    const connectSocket = useCallback( () => {

        const token = localStorage.getItem('token');

        const socketTmp = io.connect( serverPath, { 
            transports: ['websocket'],
            autoConnect: true, // always connected
            forceNew: true, // Every connection is unique and gets destroyed when disconnected
            query: {
                'x-token': token
            }
        });

        socketTmp.on('connect', () => {
            setSocket( socketTmp );
            setOnline(true);
        });

        socketTmp.on('disconnect', () => {
            setOnline(false);
        });

    }, [ serverPath ]);

    const disconnectSocket = useCallback( () => {
        socket?.disconnect();
    }, [ socket ]);

    useEffect(() => {
        setOnline( socket?.connected );
    }, [socket])

    useEffect(() => {
        socket?.on('connect', () => {
            setOnline( true );
        });
    }, [ socket ])

    useEffect(() => {
        socket?.on('disconnect', () => setOnline( false ));
    }, [ socket ])

    return {
        socket,
        online,
        connectSocket,
        disconnectSocket
    }
}