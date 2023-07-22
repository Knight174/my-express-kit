const express = require("express");
const app = new express();
const fn1 = require("./fn1"); // 外部中间件

// 定义 app 变量，通过任意中间件的 res.app.locals.title 来获取
app.locals.title = "this is a title";

app.use(express.json()); // 解析请求体中的 json 数据变成对象
app.use(express.urlencoded({ extended: false })); // 解析 url 编码数据（表单数据）
app.use(express.static("./public")); // 指定静态目录，先去这里找，找不到就 next()

// 中间件
// 本地中间件：打印 request 请求体数据
app.use((req, res, next) => {
  console.log("req", req.body);
  next();
});
// 外部中间件
app.use(fn1);

// 路由
app.get("/", (request, response) => {
  response.send("hello world");
});
app.get("/yo", (request, response) => {
  response.send("YO!");
});

// GET 请求
// app.get("/api/v1/test", (request, response) => {
//   console.log("get /test");
//   response.end();
// });
// 上面的 GET 请求等价于下面这个中间件：
app.use((request, response, next) => {
  if (request.method === "GET" && request.path === "/api/v1/test") {
    console.log("get /test");
    response.send("get /test");
  }
  next();
});

// POST 请求
app.post("/api/v1/test", (request, response) => {
  console.log("post /test");
  response.send("post /test");
});
// PUT 请求
app.put("/api/v1/test/1", (request, response) => {
  console.log("put /test/1");
  response.send("put /test/1");
});
// DELETE 请求
app.delete("/api/v1/test/1", (request, response) => {
  console.log("delete /test/1");
  response.send("delete /test/1");
});

/*
 * req.params 🌰
 * /api/v1/users/:id
 *   e.g. /api/v1/users/1 => {id: 1}
 * /api/v1/users/:id/:action
 *   e.g. /api/v1/users/1/edit => {id: 1, action: 'edit'}
 */
app.get("/api/v1/users/:id/:action", (request, response) => {
  // 只包含 :id, :action
  console.log("request.params => ", request.params);
  console.log("get /api/v1/users/:id/:action");
  // response.send("get /api/v1/users/:id/:action");
  response.json({
    data: request.params,
  });
});

/*
 * req.query 🌰
 * /api/v1/works/search => {}
 * /api/v1/works/search?name=xxx => {name: 'xxx'}
 * /api/v1/works/search?name=xxx&age=18 => {name: 'xxx', age: 18}
 */
app.get("/api/v1/works/search", (request, response) => {
  console.log("request.query => ", request.query);
  console.log("get /api/v1/works/search");
  // response.send("get /api/v1/works/search");
  response.json({
    data: request.query,
  });
});

const server = app.listen(3000, () => {
  console.log("Server running at http://localhost:" + server.address().port);
});
