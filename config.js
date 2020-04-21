const path = require('path');

const docsPath = path.resolve(__dirname, 'docs');
const databaseDirectory = path.resolve(__dirname, 'build');
const databaseName = 'database.db';

module.exports = {
  docsPath,
  articlesPath: path.join(docsPath, 'article'),
  videosPath: path.join(docsPath, 'video'),
  indexOutputPath: path.resolve(__dirname, 'build/indices'),
  indexName: 'index.json',
  databaseDirectory,
  databaseName,
  databasePath: path.join(databaseDirectory, databaseName)
};
