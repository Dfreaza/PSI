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

const PageSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  url: {
    type: String,
    required: true
  }
});

const Page = mongoose.model('Page', PageSchema);

app.use(bodyParser.json());
app.use(cors());

app.post('/api/websites', (req, res) => {
  const website = new Website({ url: req.body.url, pages: req.body.pageUrls || [] });
  website.save()
    .then((savedWebsite) => {
      res.status(200).json(savedWebsite);
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

app.put('/api/websites/:WebsiteId', (req, res) => {
  console.log(req.body.page); // Adicione esta linha
  Website.findOne({ _id: req.params.WebsiteId })
  .then(website => {
    if (website) {
      if (!website.pages) {
        website.pages = [];
      }
      const page = new Page(req.body.page); // Crie uma nova instância do modelo Page
      website.pages.push(page); // Adicione a instância ao array pages
      website.save()
        .then(() => {
          res.status(200).json("Página adicionada com sucesso!");
        })
        .catch(err => {
          console.log(err); // Adicione esta linha para ver o erro
          res.status(500).send(err);
        });
    } else {
      res.status(404).send("Website not found");
    }
  })
  .catch(err => {
    console.log(err); // Adicione esta linha para ver o erro
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