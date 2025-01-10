import BaseService from './baseService';

class UserService extends BaseService {
  // 新增 prompts
  auth = async (body: any) => {
    return this.post('/api/v1/user/auth', body);
  };

  // 获取用户列表
  queryUserList = async () => {
    return this.get<{
      success: boolean;
      data: {
        list: Array<{
          id: number;
          username: string;
          nickName: string;
          gender: 'MALE' | 'FEMALE';
        }>;
      };
      errorCode: number;
    }>('/api/v1/queryUserList');
  };

  // 更新用户信息
  updateUser = async (body: {
    id: number;
    username?: string;
    nickName?: string;
    gender?: 'MALE' | 'FEMALE';
  }) => {
    return this.put<{
      success: boolean;
      errorCode: number;
    }>(`/api/v1/user`, body);
  };

  // 新增用户
  createUser = async (body: { username: string; email: string }) => {
    return this.post<{
      success: boolean;
      errorCode: number;
    }>('/api/v1/user', {
      ...body,
      id: Math.random().toString().replace('.', ''),
    });
  };

  // 删除用户
  deleteUser = async (userId: number) => {
    return this.del<{
      success: boolean;
      errorCode: number;
    }>(`/api/v1/user/${userId}`);
  };
}

export const userService = new UserService();
