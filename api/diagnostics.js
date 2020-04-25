const config = require('../config');

const runDiagnostics = async (req, res) => {
  const databasePath = process.env.DEPLOYMENT === 'NOW' ? 'build/database.db' : config.databasePath;
  console.log('PROCESS ENV', process.env);
  const diagnosticsData = {
    deploymentEnv: process.env.DEPLOYMENT,
    databasePath
  };
  console.log('diagnosticsData', diagnosticsData);

  res.json(diagnosticsData);
};

module.exports = runDiagnostics;
