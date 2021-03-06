import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Typography, Form, Input, Divider, Button, message, Select, Row, Col } from 'antd';
import { SaveOutlined, CloseCircleOutlined, } from '@ant-design/icons';
import api from '../../services/api';

const { Title, } = Typography
const { Option } = Select;


class DepartmentForm extends React.Component {

    state = {
        name: "",
        code: "",
        available_services: [],
        servicesData: [],
        waitingResponse: false,
    };

    componentDidMount() {
        this.getDepartment();
    }

    submitDepartment = async e => {
        const { name, available_services, code } = this.state;

        try {
            let response;
            await this.setState({ waitingResponse: true });

            if(this.props.method === "create") {
                response = await api.post("departments/", { name, available_services, code });

                if(response.status === 201) {
                    message.success("Department \"" + response.data.name + "\" was created successfully.");
                    this.props.history.push("/departments");
                }
            }
            else if(this.props.method === "update") {
                response = await api.put("departments/" + this.props.match.params.id + "/", { name, available_services, code });

                if(response.status === 200) {
                    message.success("Department \"" + response.data.name + "\" was updated successfully.");
                    this.props.history.push("/departments");
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

    getDepartment = async e => {
        try {
            let response; 

            response = await api.get("services/");
            if(response.status === 200) {
                await this.setState({ servicesData: response.data });
            }

            if(this.props.method === "update")
            {
                response = await api.get("departments/" + this.props.match.params.id  + "/");
                if(response.status === 200) {
                    await this.setState({ id: response.data.id, name: response.data.name, code: response.data.code,});
                }

                response = await api.get("departments/" + this.props.match.params.id  + "/available_services/");

                if(response.status === 200) {
                    let services = [];

                    Object.keys(response.data).map(function(key) {
                        services.push(response.data[key]["id"].toString());
                        return key;
                    })
                    await this.setState({ available_services: services, });
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
        }
    };

    handleChange = (value) => {
        this.setState({ available_services: value })
    }

    render () {
        return (
        <div className="list-container">
            <Title level={2} >Departments</Title>
            <Divider orientation="right" style={{ marginTop: 15, marginBottom: 30 }}></Divider>
            <Form layout="vertical" className="form-container" onFinish={ this.submitDepartment } >
                <div className="form-margin">
                    <Row>
                        <Col span={1}/>
                        <Col span={2}>
                            <Form.Item label="Id">
                                <Input value={this.state.id}  disabled={ true }/>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={1}/>
                        <Col span={9}>
                            <Form.Item label="Name">
                                <Input value={this.state.name} onChange={e => this.setState({ name: e.target.value })}/>
                            </Form.Item>
                        </Col>
                        <Col span={1}/>
                        <Col span={9}>
                            <Form.Item label="Code">
                                <Input value={this.state.code} onChange={e => this.setState({ code: e.target.value })}/>
                            </Form.Item>
                        </Col> 
                    </Row>

                    <Row>
                        <Col span={1}/>
                        <Col span={19}>
                            <Form.Item label="Available Services">
                            <Select
                                mode="multiple"
                                placeholder="Select available services"
                                style={{ width: '100%' }}
                                value={ this.state.available_services }
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                                onChange={ this.handleChange }
                            >
                                {this.state.servicesData.map(service => (
                                    <Option key={service['id']} mode="multiple">{service['name']}</Option>
                                ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item style={{ float: 'right', marginTop: 10 }}>
                        <Form.Item style={{ display: 'inline-block', }}>
                            <Link to="/departments" >
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

export default withRouter(DepartmentForm);