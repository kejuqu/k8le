import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message } from 'antd';
import { roleService } from '@/services/roleService';

interface RoleData {
  id: string;
  name: string;
  description?: string;
}

const RolePage: React.FC = () => {
  const [roles, setRoles] = useState<RoleData[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleData | null>(null);
  const [form] = Form.useForm();

  const fetchRoles = async () => {
    try {
      const res = await roleService.queryRoleList();

      console.log(res);
      
      if (res) {
        setRoles(res);
      }
    } catch (error) {
      message.error('获取角色列表失败');
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleAdd = () => {
    setEditingRole(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: RoleData) => {
    setEditingRole(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingRole) {
        await roleService.updateRole(editingRole.id, values);
        message.success('更新角色成功');
      } else {
        await roleService.createRole(values);
        message.success('创建角色成功');
      }
      setIsModalVisible(false);
      fetchRoles();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const columns = [
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: RoleData) => (
        <Button type="link" onClick={() => handleEdit(record)}>
          编辑
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-4 flex justify-between">
        <h1 className="text-2xl font-bold">角色管理</h1>
        <Button type="primary" onClick={handleAdd}>
          新增角色
        </Button>
      </div>

      <Table columns={columns} dataSource={roles} rowKey="id" />

      <Modal
        title={editingRole ? '编辑角色' : '新增角色'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="角色名称"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RolePage;
