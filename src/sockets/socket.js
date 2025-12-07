import { io } from 'socket.io-client';
const CLIENT_URL = process.env.REACT_APP_CLIENT_URL;

export const initSocket = async () => {
    const options = {
        'force new connection': true,
        reconnectionAttempts: 'Infinity',
        timeout: 10000,
        transports: ['websocket'],
    };
    return io(CLIENT_URL, options);
};
