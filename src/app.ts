import express, { Application, Request, Response, NextFunction } from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import cors from 'cors';
import consoleLogger from 'morgan';
import requestLogger from './middleware/request-logger';
// import errorLogger from './middleware/other-logger';
// errorLogger.error('abcdefg'); // 触发一个错误日志记录

// 自封装中间件
import logLocals from './middleware/log-locals';
import indexRouter from './routes/index';
import testRouter from './routes/api/v1/test';
import uploadRouter from './routes/api/v1/upload';

// 创建主应用实例
const app: Application = express();
// 定义 app 变量，通过任意中间件的 res.app.locals.title 来获取
app.locals.title = 'this is a title';

app.use(bodyParser.json({ limit: '150kb' })); // json 数据实体大小限制
app.use(bodyParser.urlencoded({ limit: '150kb', extended: true })); // 二进制数据实体大小限制
app.use(express.json()); // 解析请求体中的 json 数据变成对象
app.use(express.urlencoded({ extended: false })); // 解析 url 编码数据（表单数据）
app.use(express.static('./public')); // 指定静态目录，先去这里找，找不到就 next()
app.use(cors()); // 处理 cors 跨域
app.use(consoleLogger('dev')); // 控制台中打印请求日志
app.use(requestLogger); // 请求日志记录到日志文件

// 本地中间件：任意请求，打印 request 请求体数据
app.use((req, res, next) => {
  console.log('req', req.body);
  next();
});
// 外部中间件
app.use(logLocals);

// 路由中间件
app.use('/', indexRouter);
app.use('/api/v1/test', testRouter);
app.use('/api/v1/upload', uploadRouter);

/*
 * req.params 🌰
 * /api/v1/users/:id
 *   e.g. /api/v1/users/1 => {id: 1}
 * /api/v1/users/:id/:action
 *   e.g. /api/v1/users/1/edit => {id: 1, action: 'edit'}
 */
app.get('/api/v1/users/:id/:action', (request, response) => {
  // 只包含 :id, :action
  console.log('request.params => ', request.params);
  console.log('get /api/v1/users/:id/:action');
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
app.get('/api/v1/works/search', (request, response) => {
  console.log('request.query => ', request.query);
  console.log('get /api/v1/works/search');
  // response.send("get /api/v1/works/search");
  response.json({
    data: request.query,
  });
});

// 响应头（设置响应头参数、设置状态码）
app.get('/api/v1/workflows', (request, response) => {
  response.set('X-Eric', 'node'); // 设置响应头
  response.append('X-Eric', 'node2'); // 追加响应头

  // response.append("X-Eric2", "node2"); // 追加新的响应头

  response.status(401); // 设置状态码

  response.json({
    data: response.get('X-Eric'), // 获取请求头，如果是多个则返回一个数组
  });
});

// 文件下载 /api/v1/download?name=example
app.get('/api/v1/download', (request, response) => {
  if (request.query.name === 'example') {
    const imagePath = path.join(__dirname, 'public/images', 'example.jpg');
    response.download(imagePath, 'example.jpg', (err) => {
      if (err) {
        // 发生错误时执行的操作
        console.log(err);
        response.status(500).send('Internal Server Error');
      } else {
        // 下载完成时执行的操作
        console.log('File downloaded successfully.');
      }
    });
  }
});

const server = app.listen(3000, () => {
  const address = server.address();
  const port =
    typeof address === 'string' ? parseInt(address, 10) : address?.port;
  console.log('Server running at http://localhost:' + port);
});
