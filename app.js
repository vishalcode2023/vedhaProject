const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const userRoutes = require('./routers/userRoutes');
const attendanceRoutes = require('./routers/attendanceRoutes');
const profileRoutes = require('./routers/profileRouter');
const index = require('./routers/index');
const { Server } = require('socket.io');
const http = require('http');
const app = express();

const server = http.createServer(app);
const io = new Server(server);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/models', express.static(path.join(__dirname, 'public/models')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



// MongoDB connection
mongoose.connect('mongodb://localhost:27017/face-recognition-db', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Routes
app.use('/', userRoutes);
app.use('/', attendanceRoutes);
app.use('/', profileRoutes);
app.use('/',index)

// Serve main pages
app.get('/', (req, res) => {
  res.render('home');
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/authlogin', (req, res) => {
  res.render('authlogin');
});

app.get('/profile', (req, res) => {
  res.render('profile');
});

app.get('/viewrank', (req, res) => {
  res.render('viewrank');
});

app.get('/Video', (req, res) => {
  const chatName = req.params.name;
  res.render('video', { chatName });
});

app.get('/chat/:name', (req, res) => {
  const chatName = req.params.name; // Retrieve the name from the URL
  res.render('message', { chatName }); // Pass the name to the EJS template
});

app.get('/payment', (req, res) => {
  res.render('payindex');
})

app.get('/course', (req, res) => {
  res.render('course');
})

app.get('/playcourse', (req, res) => {
  res.render('playcourse');
})


// Socket.io connection handling (merged all socket events into one listener)
let points = 0;

io.on('connection', (socket) => {
  console.log('A user connected.');

  // Send a welcome message to the user when they connect
  socket.emit('chat message', { chatName: 'Server', message: 'Welcome to the chat!' });

  // Join room using chat name
  socket.on('join room', (chatName) => {
    socket.join(chatName);
    console.log(`User joined room: ${chatName}`);
  });

  // Handle chat messages
  socket.on('chat message', ({ chatName, message }) => {
    // Emit to the room the user has joined
    io.to(chatName).emit('chat message', { chatName, message });
  });

  // Handle WebRTC signaling
  socket.on('offer', (data) => {
    socket.to(data.chatName).emit('offer', data);
  });

  socket.on('answer', (data) => {
    socket.to(data.chatName).emit('answer', data);
  });

  socket.on('ice-candidate', (data) => {
    socket.to(data.chatName).emit('ice-candidate', data);
  });

  // Listen for "increment points" event and update points
  socket.on('increment points', () => {
    points += 10; // Increment points by 10
    io.emit('update points', points)// Broadcast updated points to all connected clients
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected.');
  });
});

// Start the server
server.listen(3000, () => {
  console.log('Server running on port 3000');
});
