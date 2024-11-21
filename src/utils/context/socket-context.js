import { createContext, useState, useEffect, useContext } from 'react';
import { io } from 'socket.io-client';
import { ChatUrl } from '../api-url';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [socketConnected, SetSocketConnected] = useState(false);
    const { Token, logout } = useAuth()

    useEffect(() => {
        if (Token && !socketConnected) {
            let socketInstance;
            try {

                socketInstance = io(ChatUrl, {
                    auth: {
                        token: Token,
                    },
                });
                setSocket(socketInstance);

                socketInstance.on('connect', () => {
                    SetSocketConnected(true);
                    socketInstance.emit('connection')
                    console.log('Connected to the server', socketInstance.id);
                });

                socketInstance.on('disconnect', () => {
                    socketInstance.emit('disconnection')
                    SetSocketConnected(false);
                    console.log('Socket disconnected');
                });


                socketInstance.on('logout', (err) => {
                    socketInstance.disconnect();
                    logout();
                })

            } catch (err) {
                console.log("ERROR");
            }

            return () => {
                if (socketInstance) {
                    socketInstance.disconnect();
                    setSocket(null);
                }
            };
        }

    }, [Token]);

    const handleLogout = () => {
        if (socket) {
            socket.emit('disconnection')
            socket.disconnect();
        }
        logout();
    };

    return (
        <SocketContext.Provider value={{ socket, handleLogout, socketConnected }}>
            {children}
        </SocketContext.Provider>
    );
};

const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};

export { SocketProvider, useSocket };
