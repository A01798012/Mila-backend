const express = require("express");
const app = express();
app.use(express.json());
const cors = require('cors');

app.use(cors());

const userRouter = require('./routes/users');
const tutorRouter = require('./routes/tutors');
const leaderbordRouter = require('./routes/leaderboard');
app.use('/api/users', userRouter);
app.use('/api/tutors', tutorRouter);
app.use('/api/leaderboard', leaderbordRouter);


const port = 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));
