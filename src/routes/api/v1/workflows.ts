import Router from 'express';
const router = Router();

// 响应头（设置响应头参数、设置状态码）
router.get('/workflows', (request, response) => {
  response.set('X-Eric', 'node'); // 设置响应头
  response.append('X-Eric', 'node2'); // 追加响应头
  // response.append("X-Eric2", "node2"); // 追加新的响应头

  response.status(401); // 设置状态码

  response.json({
    data: response.get('X-Eric'), // 获取请求头，如果是多个则返回一个数组
  });
});

export default router;
