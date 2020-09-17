import React, { Component } from 'react';
import { Row, Input, Form, Card, Button, Space, Typography, message } from 'antd';
import { withRouter, } from 'react-router-dom';
import { LoginOutlined, } from '@ant-design/icons';
import api from './../../../services/api';
import { login, } from './../../../services/auth';

const { Title } = Typography;

class Authentication extends Component {

    state = {
        username: "",
        password: "",
        token: "",
    };


    handleAuthenticate = async e => {
        const {username, password} = this.state;

        try {
            const response = await api.post("token-auth/", { username, password });
            login(response.data.token);
            this.props.history.push('/app');
        } catch (err) {
            message.error("There was a problem with the login, check your credentials.");
        }
    };

    render() {
        return (
            <Row type="flex" justify="center" align="middle" style={{height: '50%'}}>
                <Space direction="vertical" style={{ width: '30%', height:'100%', textAlign: 'center' }}>
                        <Card title={<Title level={5}>USER AUTHENTICATION</Title>} style={{ width: '100%', height:'100%', marginTop: '50%'}}>
                        <Form onFinish={this.handleAuthenticate}>
                            <Form.Item name="username" rules={[{ required: true, message: 'Please input your username.'}]}>
                                <Input placeholder="Username" autoComplete="off" autoFocus="enabled" onChange={e => this.setState({ username: e.target.value })}/>
                            </Form.Item>
                            <Form.Item name="password" rules={[{ required: true, message: 'Please input your password.'}]}>
                                <Input.Password placeholder="Password" visibilityToggle="true" onChange={e => this.setState({ password: e.target.value })}/>
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
    }
};

export default withRouter(Authentication);