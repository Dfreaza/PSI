const Website = require('../models/website');
const Page = require('../models/page');

exports.createWebsite = (req, res) => {
  const website = new Website({ url: req.body.url, pages: req.body.pageUrls || [] });
  website.save()
    .then((savedWebsite) => {
      res.status(200).json(savedWebsite);
    })
    .catch(err => {
      res.status(500).send(err);
    });
};

exports.getWebsite = (req, res) => {
  Website.findOne({ _id: req.params.websiteId })
    .then(website => {
      if (website) {
        res.status(200).json(website);
      } else {
        res.status(404).send("Website not found");
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(err);
    });
};

exports.updateWebsite = (req, res) => {
  Website.findOne({ _id: req.params.WebsiteId })
  .then(website => {
    if (website) {
      if (!website.pages) {
        website.pages = [];
      }
      const page = new Page(req.body.page);
      website.pages.push(page);
      website.save()
        .then(() => {
          res.status(200).json("Página adicionada com sucesso!");
        })
        .catch(err => {
          console.log(err);
          res.status(500).send(err);
        });
    } else {
      res.status(404).send("Website not found");
    }
  })
  .catch(err => {
    console.log(err);
    res.status(500).send(err);
  });
};

exports.getAllWebsites = (req, res) => {
  Website.find()
    .then(websites => {
      res.status(200).json(websites);
    })
    .catch(err => {
      res.status(500).send(err);
    });
};
