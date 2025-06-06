const fs = require('fs');
const mongoose = require('mongoose');
const Article = require('./models/Article');

mongoose.connect('mongodb://localhost:27017/scientificJournal', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const data = JSON.parse(fs.readFileSync(`${__dirname}/data/articles.json`, 'utf-8'));

async function importData() {
  try {
    await Article.deleteMany({});
    await Article.insertMany(data);
    console.log('Data is loaded');
    process.exit();
  } catch (err) {
    console.error('Import error:', err);
    process.exit(1);
  }
}

importData();