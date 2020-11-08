import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Typography, Form, Input, Divider, Button, message, } from 'antd';
import { SaveOutlined, CloseCircleOutlined, } from '@ant-design/icons';
import api from '../../services/api';

const { Title, } = Typography

const layoutId = {
    labelCol: { span: 1 },
    wrapperCol: { span: 2 },
};

const layoutName = {
    labelCol: { span: 1 },
    wrapperCol: { span: 5 },
};

class ServiceForm extends React.Component {

    state = {
        name: "",
        waitingResponse: false,
    };

    componentDidMount() {
        if(this.props.method === "update") {
            this.getService();   
        }
    }

    submitService = async e => {
        const { name, } = this.state;

        try {
            let response;
            await this.setState({ waitingResponse: true });

            if(this.props.method === "create") {
                response = await api.post("services/", { name, });

                if(response.status === 201) {
                    message.success("Service \"" + response.data.name + "\" was created successfully.");
                    this.props.history.push("/services");
                }
            }
            else if(this.props.method === "update") {
                response = await api.put("services/" + this.props.match.params.id + "/", { name, });

                if(response.status === 200) {
                    message.success("Service \"" + response.data.name + "\" was updated successfully.");
                    this.props.history.push("/services");
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

    getService = async e => {
        try {
            let response = await api.get("services/" + this.props.match.params.id  + "/");
            if(response.status === 200) {
                await this.setState({ id: response.data.id, name: response.data.name });
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

    render () {
        return (
        <div className="list-container">
            <Title level={2} >Services</Title>
            <Divider orientation="right" style={{ marginTop: 15, marginBottom: 30 }}></Divider>
            <Form className="form-container" onFinish={ this.submitService }>
                <div className="form-margin">
                    <Form.Item label="Id" {...layoutId}>
                        <Input value={this.state.id}  disabled={ true }/>
                    </Form.Item>

                    <Form.Item label="Name" {...layoutName}>
                        <Input value={this.state.name} onChange={e => this.setState({ name: e.target.value })}/>
                    </Form.Item>

                    <Form.Item style={{ float: 'right', marginTop: 10 }}>
                        <Form.Item style={{ display: 'inline-block', }}>
                            <Link to="/services" >
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

export default withRouter(ServiceForm);