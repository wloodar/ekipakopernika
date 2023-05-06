const db = require('../middleware/db');
const { ADMIN_ACTIVE, ADMIN_LEAVE } = require('./Events');
 
var sockets = {  };

sockets.init = function (server, port) {
    const io = require('socket.io').listen(server);
    const redisAdapter = require('socket.io-redis');
    io.adapter(redisAdapter({ host: 'localhost', port: 6379 }));

    io.sockets.on('connection', function (socket) {
        // console.log('Socket connected - ' + socket.client.id);

        socket.on(ADMIN_ACTIVE, (data) => {
            const { adminuuid } = data;
            socket.join(`admin-${adminuuid}`);

            try {
                db.query('UPDATE an_users SET is_active=true WHERE uuid=$1', [adminuuid]);
            } catch (err) { console.error(err) }
        })

        socket.on(ADMIN_LEAVE, (data) => {
            console.log(data);
            
            try {
                db.query('UPDATE an_users SET is_active=false WHERE uuid=$1', [data.uuid]);
                
                if (data.duration > 10000) {
                    db.query(`INSERT INTO an_users_activeness VALUES (default, (SELECT id FROM an_users WHERE uuid=$1), $2, $3)`, [data.uuid, data.start, data.finish]);
                }

            } catch (err) { console.error(err) }
        })

        socket.on('disconnect', () => {
            // console.log(socket.client.id + " - disconnected.");

        })
    });
}  

module.exports = sockets;