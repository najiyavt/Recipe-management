require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const socketIo = require('socket.io');
const http = require('http');
const sequelize = require('./util/database');


const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*", 
        credentials: true
    }
});

app.use(cors({ origin: '*', credentials: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


const userRouter = require('./routes/user'); 
const recipeRouter = require('./routes/recipe');
const reviewRouter = require('./routes/review');

const User = require('./models/user');
const Recipe = require('./models/recipe');
const Review = require('./models/review');

app.use('/users' , userRouter(io));
app.use('/recipes' , recipeRouter);
app.use('/reviews' , reviewRouter );

User.hasMany(Recipe, { foreignKey: 'UserId' });
Recipe.belongsTo(User , { foreignKey: 'UserId' });
Review.belongsTo(User);
User.hasMany(Review);
Review.belongsTo(Recipe);
Recipe.hasMany(Review);


io.on('connection', (socket) => {
    console.log("Socket connected: ", socket.id);
    socket.emit("welcome", 'Welcome to the server!');

    // Handle other socket events as needed
    socket.on('disconnect', () => {
        console.log("Socket disconnected: ", socket.id);
    });
});

 
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

sequelize.sync()
    .then(result => {
        console.log('Database synchronized');
    })
    .catch(err => {
        console.error('Error synchronizing database:', err);
    });