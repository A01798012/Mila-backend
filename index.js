const express = require("express");
const app = express();
app.use(express.json());
const bodyParser = require('cors');
const cors = require('cors');

app.use(cors());

var whiteList = ['http://localhost:3000']

var corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}
const userRouter = require('./routes/users');
const tutorRouter = require('./routes/tutors');
app.use('/api/users', userRouter);
app.use('/api/tutors', tutorRouter);


const port = 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
