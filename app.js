const express = require('express');
const app = express();

app.get('/', (req, res) => res.status(200).send('index sayfasi'));
app.get('/contact', (req, res) => res.status(200).send('contact sayfasi'));
const port = 3000;
app.listen(port, () => console.log(`App started on port ${port}`));