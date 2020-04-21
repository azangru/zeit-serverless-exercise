// const fs = require('fs');
const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');

const searchIndex = require('../scripts/searchIndex');
const getArticleFromDB = require('../scripts/get-from-database/getArticle');

const config = require('../config');

// const articlesIndex = require(config.articlesIndexPath);
const articlesIndexPath = 'build/indices/articlesIndexName.json';
const articlesIndex = require(articlesIndexPath);
const databasePath = 'build/database.db';

module.exports = async (req, res) => {
  let index;
  // try {
  //   index = require('build/indices/index.json');
  // } catch (error) {
  //   const files = fs.readdirSync('.');
  //   res.json({ error, files });
  // }

  const { query } = req.query;
  if (!query) {
    res.status(400);
    return res.json({
      error: 'Query parameter cannot be empty'
    });
  }

  const searchResults = searchIndex(query, articlesIndex);
  console.log('searchResults', searchResults);

  try {
    const db = await sqlite.open({
      filename: databasePath,
      driver: sqlite3.Database
    });
    const slugs = searchResults.map(result => result.ref);
    const resultPromises = slugs.map(async (slug) => await getArticleFromDB(db, slug));
    const results = await Promise.all(resultPromises);

    res.json({
      data: results,
      query: req.query,
      // body: req.body,
      // cookies: req.cookies
    })
  } catch (error) {
    res.status(404);
    res.json({
      error,
      searchResults
    })
  }
}
