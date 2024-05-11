const Website = require('../models/website');
const Page = require('../models/page');
const Statistics = require('../models/statistics');

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

exports.deleteWebsite = (req, res) => {
  Website.findOneAndDelete({_id: req.body._id})
  .then(website => {
    if (website) {
      if (website.status === 'Avaliado') {
        // Delete the statistics for the website
        Statistics.deleteMany({ idWebsite: website._id })
        .then(() => {
          console.log('Statistics by website id deleted successfully');
          res.status(200).json(website);
        })
        .catch(err => {
          console.error('Error deleting statistics by website id:', err);
          res.status(500).send(err);
        });
      } else {
        res.status(200).json(website);
      }
    } else {
      res.status(404).send("Website not found!");
    }
  })
  .catch(err => {
    console.error('Error deleting website:', err);
    res.status(500).send(err);
  });
};

exports.deletePage = (req, res) => {
  Website.findOne({ _id: req.body.webId })
  .then(website => {
      if (website) {
          website.pages.remove(req.body.page);
          website.save()
            .then(() => {
              if(page.status === 'Avaliado'){
                // Delete the statistics for the page
                Statistics.deleteMany({ idPage: req.body.page })
                .then(() => {
                  console.log('Statistics by page id deleted successfully');
                  res.status(200).json("Page Removed Successfully!");
                })
                .catch(err => {
                  console.error('Error deleting statistics by page id:', err);
                  res.status(500).send(err);
                });
              } else {
                res.status(200).json("Page Removed Successfully!");
              }
            })
            .catch(err => {
              console.error('Error saving website:', err);
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
