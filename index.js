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
  const { search, author, dateFrom, dateTo } = req.query;

  // Поиск по названию
  if (search?.trim()) {
    const regex = new RegExp(search.trim(), 'i');
    query.title = regex;
  }

  // Поиск по автору
  if (author?.trim()) {
    query.authors = author.trim();
  }

  // Поиск по дате: от
  if (dateFrom?.trim()) {
    query.datePublished = { ...query.datePublished, $gte: new Date(dateFrom) };
  }

  // Поиск по дате: до
  if (dateTo?.trim()) {
    query.datePublished = { ...query.datePublished, $lte: new Date(dateTo) };
  }

  try {
    const articles = await Article.find(query);
    const allAuthors = await Article.distinct('authors');

    res.render('articles', {
      articles,
      searchQuery: search || '',
      authorQuery: author || '',
      dateFrom: dateFrom || '',
      dateTo: dateTo || '',
      allAuthors
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Ошибка сервера');
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});