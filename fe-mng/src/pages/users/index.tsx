// 生成用户列表页面，包含新增、编辑、删除、查看详情
import { userService } from '@/services/userService';
import { useRequest } from '@umijs/max';
import { Button, Form, Input, Modal, Space, Table, message } from 'antd';
import { useState } from 'react';

export default () => {
  const {
    data,
    loading,
    run: refreshList,
  } = useRequest(userService.queryUserList);

  // 添加状态控制 Modal 显示
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  // 处理删除操作
  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个用户吗？',
      onOk: async () => {
        try {
          await userService.deleteUser(id);
          message.success('删除成功');
          refreshList();
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  // 处理新增用户
  const handleAdd = async (values: any) => {
    try {
      if (values.id) {
        await userService.updateUser(values);
      } else {
        await userService.createUser(values);
      }
      message.success('操作成功');
      setIsModalOpen(false);
      form.resetFields();
      refreshList();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: '姓名', dataIndex: 'username', key: 'username' },
    { title: '邮箱', dataIndex: 'email', key: 'email' },
    {
      title: '操作',
      key: 'action',
      render: (text: any, record: any) => (
        <Space>
          <Button
            type="primary"
            onClick={() => {
              form.setFieldsValue(record);
              setIsModalOpen(true);
            }}
          >
            编辑
          </Button>
          <Button danger onClick={() => handleDelete(record.id)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      {/* 添加新增按钮 */}
      <div className="mb-4">
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          新增用户
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={data?.list}
        loading={loading}
        rowKey="id"
      />

      {/* 新增用户的 Modal */}
      <Modal
        title="新增用户"
        open={isModalOpen}
        onCancel={() => {
          form.resetFields();
          setIsModalOpen(false);
        }}
        onOk={() => {
          form.submit();
        }}
      >
        {/* 新增 id 为 0 */}
        <Form form={form} onFinish={handleAdd}>
          <Form.Item name="id" hidden>
            <Input type="hidden" />
          </Form.Item>

          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
