import Router from 'express';
const router = Router();

/*
 * req.params 🌰
 * /api/v1/users/:id
 *   e.g. /api/v1/users/1 => {id: 1}
 * /api/v1/users/:id/:action
 *   e.g. /api/v1/users/1/edit => {id: 1, action: 'edit'}
 */
router.get('/:id/:action', (request, response) => {
  // 只包含 :id, :action
  console.log('request.params => ', request.params);
  response.json({
    data: request.params,
  });
});

/*
 * req.query 🌰
 * /api/v1/users/search => {}
 * /api/v1/users/search?name=xxx => {name: 'xxx'}
 * /api/v1/users/search?name=xxx&age=18 => {name: 'xxx', age: 18}
 */
router.get('/search', (request, response) => {
  console.log('request.query => ', request.query);
  response.json({
    data: request.query,
  });
});

export default router;
