import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import consoleLogger from 'morgan';
import requestLogger from './middleware/request-logger';
// import errorLogger from './middleware/other-logger';
// errorLogger.error('abcdefg'); // 触发一个错误日志记录
import logLocals from './middleware/log-locals';
import jwt from './middleware/jwt-auth';
import errorHandler from './middleware/error-handler';

import indexRouter from './routes/index';
import testRouter from './routes/api/v1/test';
import usersRouter from './routes/api/v1/users';
import workflowsRouter from './routes/api/v1/workflows';
import uploadRouter from './routes/api/v1/upload';

import authRouter from './routes/api/v2/auth';
import postRouter from './routes/api/v2/post';

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
app.use(jwt);

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
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/workflows', workflowsRouter);

app.use('/api/v2', authRouter);
app.use('/api/v2', postRouter);

// 异常处理中间件
app.use(errorHandler);

const server = app.listen(3000, () => {
  const address = server.address();
  const port =
    typeof address === 'string' ? parseInt(address, 10) : address?.port;
  console.log('Server running at http://localhost:' + port);
});
