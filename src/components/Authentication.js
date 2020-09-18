import React, { Component } from 'react';
import { Row, Input, Form, Card, Button, Space, Typography, message } from 'antd';
import { withRouter, } from 'react-router-dom';
import { LoginOutlined, } from '@ant-design/icons';
import api from '../services/api';
import AuthenticationManager from '../services/auth';

const { Title } = Typography;

class Authentication extends Component {

    state = {
        username: "",
        password: "",
        token: "",
        waiting_response: false,
    };


    handleAuthenticate = async e => {
        const { username, password } = this.state;

        try {
            let authManager = new AuthenticationManager();

            this.setState({ waiting_response: true });
            const response = await api.post("token-auth/", { username, password });
            await authManager.login(response.data.token);
            this.props.history.push('/app');
        } catch (err) {
            message.error("There was a problem with the login, check your credentials.");
            this.setState({ waiting_response: false });
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
                                <Button type="primary" htmlType="submit" block="true" loading={ this.state.waiting_response }>
                                    <LoginOutlined /> Login
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