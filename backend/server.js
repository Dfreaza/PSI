const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const websiteRoutes = require('./routes/websiteRoutes');

const app = express();

mongoose.connect('mongodb://psi021:psi021@localhost:27017/psi021?retryWrites=true&authSource=psi021');
//mongoose.connect('mongodb://localhost:27017/myapp', { useNewUrlParser: true, useUnifiedTopology: true });


app.use(bodyParser.json());
app.use(cors());

app.use('/', websiteRoutes);

app.listen(3071, () => console.log('Server started on port 3071'));
//app.listen(3000, () => console.log('Server started on port 3000'));