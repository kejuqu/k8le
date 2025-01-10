type Request = any;
type Response = any;

// 模拟用户数据
let users = [
  { id: 1, username: '张三', nickName: '小张', gender: '男' },
  { id: 2, username: '李四', nickName: '小李', gender: '男' },
  { id: 3, username: '王五', nickName: '小王', gender: '女' },
];

export default {
  // 查询用户列表
  'GET /api/v1/queryUserList': (req: Request, res: Response) => {
    res.json({
      success: true,
      data: { list: users },
      errorCode: 0,
    });
  },

  // 更新用户信息
  'PUT /api/v1/user': (req: Request, res: Response) => {
    res.json({
      success: true,
      data: null,
      errorCode: 0,
    });
  },

  // 删除用户
  'DELETE /api/v1/user': (req: Request, res: Response) => {
    res.json({
      success: true,
      data: null,
      errorCode: 0,
    });
  },
};
