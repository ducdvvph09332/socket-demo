var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
app.get('/sound', (req, res) => {
    res.sendFile(__dirname + '/audio/notify.mp3');
});

io.on('connection', (socket) => {
    let countUser = io.engine.clientsCount;
    socket.emit('user-connected', countUser);
    // join room
    socket.join(`${socket.id}`)
        // console.log(socket.rooms);
    // get data
    socket.on('msg-sent', (data) => {
        // post data for all
        if (data.notify_for === "all") {
            socket.broadcast.emit('msg', {
                light: data.light,
                temp: data.temp
            }); 
        } else {
            // post data
            socket.to(`${data.notify_for}`).emit('msg', {
                light: data.light,
                temp: data.temp
            });
            //post text
            socket.emit("save", "Saved changes")
        }

    });
    // get user option
    socket.on('user-info', (user_info) => {
        socket.broadcast.emit('notify-for', {
            user_id: socket.id,
            user_name: user_info
        })
        socket.emit('user-name', (user_info))
    })

});

http.listen(port, () => {
    console.log('Server listening at port:' + port);
});
