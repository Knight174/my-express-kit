const express = require("express");
const app = new express();

app.use(express.json()); // 解析请求体中的 json 数据变成对象
app.use(express.urlencoded({ extended: false })); // 解析 url 编码数据（表单数据）
app.use(express.static("./public")); // 指定静态目录，先去这里找，找不到就 next()

// 中间件
app.use((req, res, next) => {
  console.log("req", req.body);
  next();
});

// 路由
app.get("/", (request, response) => {
  response.send("hello world");
});
app.get("/yo", (request, response) => {
  response.send("YO!");
});
// GET 请求
app.get("/api/v1/test", (request, response) => {
  console.log("get /test");
  response.end();
});
// POST 请求
app.post("/api/v1/test", (request, response) => {
  console.log("post /test");
  response.end();
});
// PUT 请求
app.put("/api/v1/test/1", (request, response) => {
  console.log("put /test/1");
  response.end();
});
// DELETE 请求
app.delete("/api/v1/test/1", (request, response) => {
  console.log("delete /test/1");
  response.end();
});
const server = app.listen(3000, () => {
  console.log("Server running at http://localhost:" + server.address().port);
});
