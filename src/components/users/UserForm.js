import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Typography, Form, Input, Divider, Button, message, Checkbox } from 'antd';
import { SaveOutlined, CloseCircleOutlined, } from '@ant-design/icons';
import api from '../../services/api';

const { Title, } = Typography

const layoutDefault = {
    labelCol: { span: 2 },
    wrapperCol: { span: 6 },
};


class UserForm extends React.Component {

    state = {
        username: "",
        password: "",
        first_name: "",
        last_name: "",
        email: "",
        is_superuser: false,
        place: "",
    };

    componentDidMount() {
        if(this.props.method === "update") {
            this.getUser();   
        }
    }

    submitUser = async e => {
        const { username, password, first_name, last_name, email, is_superuser, place } = this.state;

        try {
            let response;
            await this.setState({ waitingResponse: true });

            if(this.props.method === "create") {
                response = await api.post("users/", { username, password, first_name, last_name, email, is_superuser, place });

                if(response.status === 200) {
                    message.success("User \"" + response.data.username + "\" was created successfully.");
                    this.props.history.push("/users");
                }
            }
            else if(this.props.method === "update") {
                response = await api.put("users/" + this.props.match.params.id + "/", { username, password, first_name, last_name, email, is_superuser, place });

                if(response.status === 200) {
                    message.success("User \"" + response.data.username + "\" was updated successfully.");
                    this.props.history.push("/users");
                }
            }
        } catch (err) { 
            if (err.response) {
                Object.keys(err.response.data).map(function(keyName) {
                    message.error(keyName + ": " + err.response.data[keyName]);  
                    return keyName;
                }) 
            }
            else {
                message.error(err.message);   
            }

            await this.setState({ waitingResponse: false });
        }
    };

    getUser = async e => {
        try {
            let response = await api.get("users/" + this.props.match.params.id  + "/");
            if(response.status === 200) {
                this.setState({ id: response.data.id,
                                    username: response.data.username, 
                                    password: response.data.password, 
                                    first_name: response.data.first_name, 
                                    last_name: response.data.last_name, 
                                    email: response.data.email, 
                                    is_superuser: response.data.is_superuser, 
                                });
            }

            response = await api.get("users/" + this.props.match.params.id  + "/profile/");
            if(response.status === 200) {
                await this.setState({ place: response.data[0].place, });
            }
        } catch (err) {
            if (err.response) {
                Object.keys(err.response.data).map(function(keyName) {
                    message.error(keyName + ": " + err.response.data[keyName]);  
                    return keyName;
                }) 
            }
            else {
                message.error(err.message);   
            }
        }
    };

    onChange = e => {
        this.setState({ is_superuser: e.target.checked });
    };

    render () {
        return (
        <div className="list-container">
            <Title level={2} >Users</Title>
            <Divider orientation="right" style={{ marginTop: 15, marginBottom: 30 }}></Divider>
            <Form className="form-container" onFinish={ this.submitUser }>
                <div className="form-margin">
                    <Form.Item label="Id" {...layoutDefault}>
                        <Input value={this.state.id}  disabled={ true }/>
                    </Form.Item>

                    <Form.Item label="Username" {...layoutDefault}>
                        <Input value={this.state.username} onChange={e => this.setState({ username: e.target.value })}/>
                    </Form.Item>

                    <Form.Item label="Password" {...layoutDefault}>
                        <Input.Password value={this.state.password} onChange={e => this.setState({ password: e.target.value })}/>
                    </Form.Item>

                    <Form.Item label="First Name" {...layoutDefault}>
                        <Input value={this.state.first_name} onChange={e => this.setState({ first_name: e.target.value })}/>
                    </Form.Item>

                    <Form.Item label="Last Name" {...layoutDefault}>
                        <Input value={this.state.last_name} onChange={e => this.setState({ last_name: e.target.value })}/>
                    </Form.Item>

                    <Form.Item label="Email" {...layoutDefault}  rules={[{ type: 'email' }]}>
                        <Input value={this.state.email} onChange={e => this.setState({ email: e.target.value })}/>
                    </Form.Item>

                    <Form.Item label="Place" {...layoutDefault}  rules={[{ type: 'email' }]}>
                        <Input value={this.state.place} onChange={e => this.setState({ place: e.target.value })}/>
                    </Form.Item>

                    <Form.Item label="Super User" {...layoutDefault}  rules={[{ type: 'email' }]}>
                        <Checkbox checked={this.state.is_superuser} onChange={this.onChange} />
                    </Form.Item>

                    <Form.Item style={{ float: 'right', marginTop: 10 }}>
                        <Form.Item style={{ display: 'inline-block', }}>
                            <Link to="/users" >
                                <Button type="danger" htmlType="submit">
                                    <CloseCircleOutlined /> Cancel
                                </Button>
                            </Link>
                        </Form.Item>
                        <Form.Item style={{ display: 'inline-block', marginLeft: 10 }}>
                            <Button type="primary" htmlType="submit" loading={ this.state.waitingResponse }>
                                <SaveOutlined /> Save
                            </Button>
                        </Form.Item>
                    </Form.Item>
                </div>
            </Form>
        </div>)
    }
}

export default withRouter(UserForm);