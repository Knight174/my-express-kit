import Router from 'express';
import path from 'path';
const router = Router();

router.get('/', (request, response) => {
  response.send('hello world');
});
router.get('/yo', (request, response) => {
  response.send('YO!');
});
router.get('/blog', (request, response) => {
  response.send('hello, blog');
});

// 设置重定向：重定向到 /blog
router.get('/posts', (request, response) => {
  // response.status(301).location("/blog").end();
  // 等价于：
  response.redirect('/blog');
  response.end();
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
router.get('/example.pdf', (request, response) => {
  const filePath = path.join(__dirname, 'public/pdfs', 'example.pdf');
  response.sendFile(filePath);
});

export default router;
