const express = require('express');
const cors = require("cors");
const connectDB = require('./database/config');
require('dotenv').config();

const userRoutes = require('./routes/UserRoutes');
const adminRoutes = require('./routes/AdminRoutes');
const questionRoutes = require('./routes/QuestionRoutes');
const answerRoutes = require('./routes/AnswerRoutes');

const app = express();

app.use(express.json());
connectDB();

app.use(cors());

app.get('/', (req, res) => {
    res.send('Server Running!');
});

app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/answers', answerRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
