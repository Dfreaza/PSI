const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

mongoose.connect('mongodb://localhost:27017/myapp', { useNewUrlParser: true, useUnifiedTopology: true });

const WebsiteSchema = new mongoose.Schema({
  url: String,
  status: { type: String, default: 'Por avaliar' }
});

const Website = mongoose.model('Website', WebsiteSchema);

app.use(bodyParser.json());
app.use(cors());

app.post('/api/websites', (req, res) => {
    const website = new Website({ url: req.body.url });
    website.save()
      .then(() => {
        res.status(200).json("Website adicionado com sucesso!");
      })
      .catch(err => {
        res.status(500).send(err);
      });
});

app.listen(3000, () => console.log('Server started on port 3000'));