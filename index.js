const express = require('express');
const res = require('express/lib/response');
const app = new express();
app.get('/', (request, response) => {
  response.send('hello world');
})
app.get('/yo', (request, response) => {
  response.send('YO!');
})
const server = app.listen(3000, () => {
  console.log('Server running at http://localhost:' + server.address().port);
});