import BaseService from './baseService';

class RoleService extends BaseService {
  // 获取角色列表
  queryRoleList = async () => {
    return this.get('/api/nj/roles');
  };

  // 创建角色
  createRole = async (body: { name: string; description?: string }) => {
    return this.post<{
      success: boolean;
      errorCode: number;
    }>('/api/nj/roles', body);
  };

  // 更新角色
  updateRole = async (id: string, body: { name: string; description?: string }) => {
    return this.put<{
      success: boolean;
      errorCode: number;
    }>(`/api/nj/roles/${id}`, body);
  };
}

export const roleService = new RoleService();
