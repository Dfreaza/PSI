const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

mongoose.connect('mongodb://localhost:27017/myapp', { useNewUrlParser: true, useUnifiedTopology: true });

const WebsiteSchema = new mongoose.Schema({
  url: String,
  pages: [String],
  submissionDate: {type: Date, default: Date.now},
  appraisalDate:{type: Date, default: Date.now},
  status: { type: String, default: 'Por avaliar' }
});

const Website = mongoose.model('Website', WebsiteSchema);

app.use(bodyParser.json());
app.use(cors());

app.post('/api/websites', (req, res) => {
  const website = new Website({ url: req.body.url, pages: req.body.pageUrls || [] });
  website.save()
    .then(() => {
      res.status(200).json("Website adicionado com sucesso!");
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

app.post('/api/websites/addPages', (req, res) => {
  Website.findOne({ url: req.body.url })
    .then(website => {
      if (website) {
        website.pages = [...website.pages, ...req.body.pageUrls];
        website.save()
          .then(() => {
            res.status(200).json("Páginas adicionadas com sucesso!");
          })
          .catch(err => {
            res.status(500).send(err);
          });
      } else {
        res.status(404).send("Website not found");
      }
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

app.get('/api/websites', (req, res) => {
  Website.find()
    .then(websites => {
      res.status(200).json(websites);
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

app.listen(3000, () => console.log('Server started on port 3000'));