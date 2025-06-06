const express = require('express');
const mongoose = require('mongoose');
const app = express();
const Article = require('./models/Article');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: true }));
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

app.post('/articles', async (req, res) => {
  const {
    title,
    authors,
    datePublished,
    content,
    tags
  } = req.body;

  try {
    const article = new Article({
      title,
      authors: authors.split(',').map(a => a.trim()).filter(Boolean),
      datePublished: new Date(datePublished),
      content,
      tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : []
    });

    await article.save();
    res.redirect('/articles');
  } catch (err) {
    console.error(err);
    res.status(500).send('Ошибка при сохранении статьи');
  }
});

app.get('/articles/new', (req, res) => {
  res.render('newArticle');
});

app.get('/articles/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).send('Статья не найдена');
    }

    res.render('articleDetails', { article });
  } catch (err) {
    console.error(err);
    res.status(500).send('Ошибка сервера');
  }
});

app.delete('/articles/:id', async (req, res) => {
  try {
    await Article.findByIdAndDelete(req.params.id);
    res.redirect('/articles');
  } catch (err) {
    console.error(err);
    res.status(500).send('Ошибка при удалении статьи');
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});