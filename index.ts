// const mongoose = require('mongoose');
const express = require('express');
const { MongoClient } = require('mongodb');
const devicesRouter = require('./routes/devices');

const PORT = 5000;
const app = express();

// express app
app.listen(PORT, async () => {
    console.log(`Server up on port ${PORT}`);
});

// api routes
app.use(devicesRouter);