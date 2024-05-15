const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const websiteRoutes = require('./routes/websiteRoutes');
const accessibilityRoutes = require('./routes/accessibilityRoutes');
const reportRoutes = require('./routes/reportRoutes');
const path = require('path'); 
'use strict';
const { QualWeb, generateEARLReport } = require('@qualweb/core');

const app = express();

mongoose.connect('mongodb://localhost:27017/myapp', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());
app.use(cors());

app.use('/', websiteRoutes);
app.use('/', accessibilityRoutes);
app.use('/', reportRoutes);

app.use('/public', express.static(path.join(__dirname, 'public')));
app.listen(3000, () => console.log('Server started on port 3000'));