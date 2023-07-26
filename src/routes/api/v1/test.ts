import Router from 'express';
const router = Router();

// GET 请求
router.get('/test', (request, response, next) => {
  // if (request.method === "GET" && request.path === "/api/v1/test") {
  //   console.log("get /test");
  //   response.send("get /test");
  // }
  // next();
  console.log('get /test');
  response.send('get /test');
});

// POST 请求
router.post('/test', (request, response) => {
  console.log('post /test');
  response.send('post /test');
});
// PUT 请求
router.put('/test/1', (request, response) => {
  console.log('put /test/1');
  response.send('put /test/1');
});
// DELETE 请求
router.delete('/test/1', (request, response) => {
  console.log('delete /test/1');
  response.send('delete /test/1');
});

export default router;
