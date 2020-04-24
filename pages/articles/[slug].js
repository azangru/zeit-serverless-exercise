const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');
const path = require('path');

const getConfig = require('next/config');
console.log(getConfig.default());
const { serverRuntimeConfig } = getConfig.default();

const config = require('../../config');

const ArticlePage = (props) => {
  console.log('props', props);
  return <div>Welcome to Next.js!</div>
}

export default ArticlePage;

const databasePath = path.resolve(serverRuntimeConfig.PROJECT_ROOT, 'build/database.db');
console.log('databasePath', databasePath);

export const getStaticPaths = async () => {
  const db = await sqlite.open({
    filename: databasePath,
    driver: sqlite3.Database
  });
  const articleSlugs = await db.all('SELECT filename FROM articles');

  const paths = articleSlugs.map(slug => `/articles/${slug}`);

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false }
};

export async function getStaticProps({ params }) {
  const db = await sqlite.open({
    filename: databasePath,
    driver: sqlite3.Database
  });
  const article = await db.get('SELECT * FROM articles WHERE filename = ?', params.slug);

  return { props: { article } };
}
