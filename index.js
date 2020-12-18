var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
// const users = {}

io.on('connection', (socket) => {
    // socket.on('new-user', name => {
    //     users[socket.id] = name;
    //     socket.broadcast.emit('user-connected', name);
    // })

    socket.on('msg', (msg) => {
        socket.broadcast.emit('msg', {
            username: "anonymous",
            message: msg
        });
        socket.emit('msg', {
            username: "You",
            message: msg
        });
        // io.emit('msg', msg);
    });

});

http.listen(port, () => {
    console.log('Server listening at port:' + port);
});

// Broadcast a message to connected users when someone connects or disconnects.
// Add support for nicknames.
// Don’t send the same message to the user that sent it.Instead, append the message directly as soon as he / she presses enter.
// Add “{ user } is typing” functionality.
// Show who’s online.
// Add private messaging.
// Share your improvements!