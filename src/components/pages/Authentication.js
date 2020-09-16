import React from 'react';
import { Row, Input, Form, Card, Button, Space, Typography } from 'antd';
import { LoginOutlined, } from '@ant-design/icons';
const { Title } = Typography;

const Authentication = () => (
    <Row type="flex" justify="center" align="middle" style={{height: '50%'}}>
        <Space direction="vertical" style={{ width: '30%', height:'100%', textAlign: 'center' }}>
                <Card title={<Title level={5}>USER AUTHENTICATION</Title>} style={{ width: '100%', height:'100%', marginTop: '50%'}}>
                <Form theme="dark" initialValues={{ remember: true }}>
                    <Form.Item name="username" rules={[{ required: true, message: 'Please input your username.'}]}>
                        <Input placeholder="Username" autoComplete="off" autoFocus="true"/>
                    </Form.Item>
                    <Form.Item name="password" rules={[{ required: true, message: 'Please input your password.'}]}>
                        <Input.Password placeholder="Password" visibilityToggle="true"/>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block="true">
                            <LoginOutlined /> Log In
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </Space>
    </Row>
);

export default Authentication;