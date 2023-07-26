import Router from 'express';
import prisma from '../../../config/prisma';
import { sendSuccessResponse } from '../../../utils/response-util';

const router = Router();

// 新增 post
router.post('/posts', async (req, res, next) => {
  const { title, content, authorId, likesCount, viewsCount } = req.body;
  try {
    await prisma.post.create({
      data: {
        title,
        content,
        likesCount,
        viewsCount,
        author: { connect: { id: authorId } },
      },
    });
    sendSuccessResponse(res, '创建成功');
  } catch (err) {
    next(err);
  }
});

// 更新 post 发布状态
router.put('/publish/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    await prisma.post.update({
      where: { id },
      data: { published: true },
    });
    sendSuccessResponse(res, '状态修改成功');
  } catch (err) {
    next(err);
  }
});

// 删除 post
router.delete(`/posts/:id`, async (req, res, next) => {
  const { id } = req.params;
  try {
    await prisma.post.delete({
      where: {
        id,
      },
    });
    sendSuccessResponse(res, '删除成功');
  } catch (err) {
    next(err);
  }
});

// 获取指定 post
router.get(`/posts/:id`, async (req, res, next) => {
  const { id } = req.params;
  try {
    const post = await prisma.post.findUnique({
      where: {
        id,
      },
    });
    sendSuccessResponse(res, '获取成功', post);
  } catch (err) {
    next(err);
  }
});

// 获取所有 post
router.get('/posts', async (req, res, next) => {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
    });
    sendSuccessResponse(res, '获取成功', posts);
  } catch (err) {
    next(err);
  }
});

// 获取筛选的 post（模糊查询）
router.get('/posts', async (req, res, next) => {
  const { title, content } = req.query;
  try {
    const draftPosts = await prisma.post.findMany({
      where: {
        // OR：或，满足数组中的某一项
        OR: [
          {
            title: { contains: String(title) },
          },
          {
            content: { contains: String(content) },
          },
        ],
      },
    });
    sendSuccessResponse(res, '获取成功', draftPosts);
  } catch (err) {
    next(err);
  }
});

export default router;
