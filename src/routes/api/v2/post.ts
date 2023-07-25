import Router from 'express';
import prisma from '../../../config/prisma';
import {
  sendSuccessResponse,
  sendErrorResponse,
  handlePrismaError,
} from '../../../utils/response-util';

const router = Router();

// 新增 post
router.post('/posts', async (req, res) => {
  const { title, content, authorId, likesCount, viewsCount } = req.body;
  const newPost = await prisma.post.create({
    data: {
      title,
      content,
      likesCount,
      viewsCount,
      author: { connect: { id: authorId } },
    },
  });
  if (newPost) {
    sendSuccessResponse(res, '创建成功');
  }
});

// 更新 post 发布状态
router.put('/publish/:id', async (req, res) => {
  const { id } = req.params;
  const post = await prisma.post.update({
    where: { id },
    data: { published: true },
  });
  if (post) {
    sendSuccessResponse(res, '状态修改成功');
  }
});

// 删除 post
router.delete(`/posts/:id`, async (req, res) => {
  const { id } = req.params;
  const post = await prisma.post.delete({
    where: {
      id,
    },
  });
  res.json(post);
  if (post) {
    sendSuccessResponse(res, '删除成功');
  }
});

// 获取指定 post
router.get(`/posts/:id`, async (req, res) => {
  const { id } = req.params;
  const post = await prisma.post.findUnique({
    where: {
      id,
    },
  });
  if (post) {
    sendSuccessResponse(res, '获取成功', post);
  }
});

// 获取所有 post
router.get('/posts', async (req, res) => {
  const posts = await prisma.post.findMany({
    where: { published: true },
  });
  sendSuccessResponse(res, '获取成功', posts);
});

// 获取筛选的 post（模糊查询）
router.get('/posts', async (req, res) => {
  const { title, content } = req.query;
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
});
