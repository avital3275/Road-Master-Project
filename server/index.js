const express = require('express');
const cors    = require('cors');
const dotenv  = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static('uploads'));

const authRoutes   = require('./routes/authRoutes');
const lessonRoutes = require('./routes/lessonRoutes');
const theoryRoutes = require('./routes/theoryRoutes');
const userRoutes   = require('./routes/userRoutes');

app.use('/api/auth',    authRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/theory',  theoryRoutes);
app.use('/api/users',   userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});