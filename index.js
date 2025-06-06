const express = require('express');
const mongoose = require('mongoose');
const app = express();
const Article = require('./models/Article');

app.use(express.static('public'));

app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost:27017/scientificJournal', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/articles', async (req, res) => {
  let query = {};
  const searchQuery = req.query.search || '';
  const authorQuery = req.query.author || '';

  // Поиск по названию статьи
  if (searchQuery.trim() !== '') {
    const regex = new RegExp(searchQuery.trim(), 'i');
    query.title = regex;
  }

  // Поиск по автору
  if (authorQuery.trim() !== '') {
    query.authors = authorQuery.trim();
  }

  try {
    const articles = await Article.find(query);
    const allAuthors = await Article.distinct('authors');

    res.render('articles', {
      articles,
      searchQuery,
      authorQuery,
      allAuthors
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});