const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send(`
    <div style="text-align: center; font-family: sans-serif; margin-top: 50px;">
      <h1>🚀 Simple Web App Deployed Successfully!</h1>
      <p>Automated with GitHub Actions and Podman</p>
    </div>
  `);
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', uptime: process.uptime() });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;