import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Typography, Form, Input, Divider, Button, message } from 'antd';
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
        waiting_response: false,
    };

    submit = async e => {
        const { name, } = this.state;

        try {

            this.setState({ waiting_response: true });
            if(this.props.method === "create")
            {
                let response = await api.post("services/", { name,  });
                message.success("Service \"" + response.data.name + "\" was created successfully.");
            }
            else if(this.props.method === "update")
            {
                message.error("funçao nao implementada");    
            }
            
            this.props.history.push('/services');
        } catch (err) {
            if (typeof err.response !== 'undefined') {
                if (err.response.data.name !== 'undefined')
                    message.error("Name: " + err.response.data.name);
            }
            else {
                message.error(err.message);   
            }
            this.setState({ waiting_response: false });
        }
    };

    render () {
        return (
        <div className="list-container">
            <Title level={2} >Services { this.props.match.params.id }</Title>
            <Divider orientation="right" style={{ marginTop: 15, marginBottom: 30 }}></Divider>
            <Form className="form-container" onFinish={ this.submit }>
                <div className="form-margin">
                    <Form.Item label="Id" {...layoutId}>
                        <Input disabled={ true }/>
                    </Form.Item>

                    <Form.Item label="Name" {...layoutName}>
                        <Input onChange={e => this.setState({ name: e.target.value })}/>
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
                            <Button type="primary" htmlType="submit" loading={ this.state.waiting_response }>
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