// const fs = require('fs');
const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');
const fs = require('fs');
const path = require('path');

const searchIndex = require('../../scripts/searchIndex');
const getArticleFromDB = require('../../scripts/get-from-database/getArticle');

const config = require('../../config');

const databasePath = path.resolve(process.env.ROOT, 'build', 'database.db');
const database = fs.readFileSync(databasePath);

const articlesIndexPath = path.resolve(process.env.ROOT, 'build/indices/articlesIndex.json')
const articlesIndex = JSON.parse(fs.readFileSync(articlesIndexPath), 'utf-8');

module.exports = async (req, res) => {
  let index;

  const { query } = req.query;
  if (!query) {
    res.status(400);
    return res.json({
      error: 'Query parameter cannot be empty'
    });
  }

  const searchResults = searchIndex(query, articlesIndex);

  try {
    const db = await sqlite.open({
      filename: databasePath,
      driver: sqlite3.Database
    });
    const slugs = searchResults.map(result => result.ref);
    const resultPromises = slugs.map(async (slug) => await getArticleFromDB(db, slug));
    const results = await Promise.all(resultPromises);

    res.setHeader('Access-Control-Allow-Origin', '*');
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
