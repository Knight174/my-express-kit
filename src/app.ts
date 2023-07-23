import express, { Application, Request, Response, NextFunction } from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import cors from 'cors';
import consoleLogger from 'morgan';
import requestLogger from './middleware/request-logger';
// import errorLogger from './middleware/other-logger';
// errorLogger.error('abcdefg'); // 触发一个错误日志记录

import fn1 from './fn1'; // 外部中间件
import testRouter from './routes/api/v1/test';
import uploadRouter from './routes/api/v1/upload';

const app: Application = express();
// 定义 app 变量，通过任意中间件的 res.app.locals.title 来获取
app.locals.title = 'this is a title';

// 数据实体大小限制
app.use(bodyParser.json({ limit: '150kb' }));
app.use(bodyParser.urlencoded({ limit: '150kb', extended: true }));
app.use(express.json()); // 解析请求体中的 json 数据变成对象
app.use(express.urlencoded({ extended: false })); // 解析 url 编码数据（表单数据）
app.use(express.static('./public')); // 指定静态目录，先去这里找，找不到就 next()
app.use(cors()); // 处理 cors 跨域
app.use(consoleLogger('dev')); // 控制台日志中间件

// 中间件
// 本地中间件：打印 request 请求体数据
app.use((req, res, next) => {
  console.log('req', req.body);
  next();
});
// 外部中间件
app.use(fn1);
// 导入路由中间件
app.use('/api/v1/test', testRouter);
app.use('/api/v1/upload', uploadRouter);

app.use(requestLogger); // 请求日志中间件
console.info('requestLogger', requestLogger);

// 路由
app.get('/', (request, response) => {
  response.send('hello world');
});
app.get('/yo', (request, response) => {
  response.send('YO!');
});

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

// 文件发送（不会下载，会尝试帮你打开）：/example.pdf
/*
 * 文本文件：文本文件可以在浏览器中直接打开和查看，例如 .txt、.html、.css、.js 等文件。
 * 图像文件：常见的图像文件类型，如 .jpg、.png、.gif 等文件可以在浏览器中直接显示。大多数浏览器还支持 SVG 矢量图像格式。
 * 音频文件：音频文件类型，如 .mp3、.wav、.ogg 等文件可以在浏览器中直接播放。
 * 视频文件：视频文件类型，如 .mp4、.webm、.ogg 等文件可以在浏览器中直接播放。
 * 二进制文件：二进制文件类型，如 .pdf、.doc、.xls、.exe 等文件需要用户下载后使用相应的应用程序打开。
 * 压缩文件：压缩文件类型，如 .zip、.rar、.tar.gz 等文件需要用户下载后解压缩。
 */
app.get('/example.pdf', (request, response) => {
  const filePath = path.join(__dirname, 'public/pdfs', 'example.pdf');
  response.sendFile(filePath);
});

// 设置重定向：重定向到 /blog
app.get('/posts', (request, response) => {
  // response.status(301).location("/blog").end();
  // 等价于：
  response.redirect('/blog');
  response.end();
});
app.get('/blog', (request, response) => {
  response.send('hello, blog');
});

const server = app.listen(3000, () => {
  const address = server.address();
  const port =
    typeof address === 'string' ? parseInt(address, 10) : address?.port;
  console.log('Server running at http://localhost:' + port);
});
