import io from 'socket.io-client';
let socket = null;
// let appStart = Date.now();
let appStart = new Date(Date.now()+(1000*60*(-(new Date()).getTimezoneOffset()))).toISOString().replace('T',' ').replace('Z','');

const connectPromise = (useruuid) => {
    return new Promise((resolve, reject) => {
        socket = io(process.env.REACT_APP_GLOBAL_API_URL, {query: `adminuuid=${useruuid}`});
        socket.on('connect', () => {
            if (socket.id !== undefined) {
                resolve(socket);
            } else {
                resolve(false);
            }
        });

        socket.io.on('connect_error', function(err) {
            resolve(false);
        });
    });
}

function resetSocket(useruuid) {
}

export { 
    socket,
    appStart,
    connectPromise,
    resetSocket
};