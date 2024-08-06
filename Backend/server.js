const express = require('express');
const connectDb = require("./config/db");
const authRoutes = require("./routes/auth");
const dotenv = require("dotenv").config()



const app = express();

connectDb();

app.use(express.json());
app.use('/api', authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(5050, () => {
    console.log(`Server is running at ${PORT}`);
})
