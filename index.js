const express = require('express');
const mongoose = require('mongoose');
const app = express();
const Article = require('./models/Article');

app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost:27017/scientificJournal', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/articles', async (req, res) => {
  try {
    const articles = await Article.find();
    res.render('articles', { articles });
  } catch (err) {
    res.status(500).send(err);
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});