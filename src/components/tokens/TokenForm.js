import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Typography, Form, Input, Divider, Button, message, Select, Steps, Col, Row } from 'antd';
import { CheckOutlined, CloseCircleOutlined, } from '@ant-design/icons';
import api from '../../services/api';
import moment from 'moment';
import Timer from '../custom/Timer';


const { Title, } = Typography
const { Option } = Select;
const { Step } = Steps;


class TokenForm extends React.Component {

    constructor() {
        super()
        this.interval = 1000
        this.startTime = new Date()
    }


    state = {
        key: "",
        department: "",
        department_name: "",
        issue_date: "",
        token_type: "",
        service: null,
        servicesData: [],
        timerText: "",
    };

    componentDidMount = () => {
        this.getToken();

        this.timer = setInterval( () => {
          this.updateText();
        }, this.interval)
    }

    updateText = () => {
        let duration = moment.utc(moment().diff(moment(this.state.issue_date)));
        let days = parseInt(duration.format("D"));

        this.setState({timerText: days === 1 ? duration.format("HH:mm:ss") : days.toString() + "D " + duration.format("HH:mm:ss")});
    }

    endAttendence = async e => {
        const { service, } = this.state;

        try {
            let response = await api.put("tokens/" + this.props.match.params.id  + "/end_attendence/", { service, });

            if(response.status === 200) {
                message.success("Token \"" + response.data.key + "\" was archived successfully.");
                this.props.history.push("/tokens/" + response.data.department);
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

    getToken = async e => {
        try {
            let response; 

            response = await api.get("tokens/" + this.props.match.params.id  + "/");
            if(response.status === 200) {
                await this.setState({ key: response.data.key, department: response.data.department, issue_date: response.data.issue_date, token_type: response.data.token_type });
            }

            response = await api.get("departments/" + this.state.department  + "/available_services/");
            if(response.status === 200) {
                await this.setState({ servicesData: response.data });
            }

            response = await api.get("departments/" + this.state.department  + "/");
            if(response.status === 200) {
                await this.setState({ department_name: response.data.name });
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
        this.setState({ service: value })
    }


    render () {
        return (
            <div className="list-container">
                <Title level={2} >Token {this.state.key}</Title>
                <div className="form-container">
                    <div className="form-margin">
                        <Row>
                            <Col span={7}/>
                            <Col span={10}>
                                <Steps current={1}>
                                    <Step title="Waiting Attendence"/>
                                    <Step title="In Attendence" subTitle={this.state.timerText}/>
                                    <Step title="Archived" />
                                </Steps>
                            </Col>
                            <Col span={7}/>
                        </Row>
                        <Divider dashed />
                        <Row>
                            <Col span={1}/>
                            <Col span={9}>Key<Input value={this.state.key}/></Col>
                            <Col span={4}/>
                            <Col span={9}>Department<Input value={this.state.department_name}/></Col>
                            <Col span={1}/>
                        </Row>
                        <Row style={{ marginTop: 10 }}>
                            <Col span={1}/>
                            <Col span={9}>Issue Date<Input value={moment(this.state.issue_date).format("DD/MM/YYYY HH:mm:ss")}/></Col>
                            <Col span={4}/>
                            <Col span={9}>Token Type<Input value={this.state.token_type === "N" ? "Normal" : "Preferential"}/></Col>
                            <Col span={1}/>
                        </Row>
                        <Divider dashed />
                        <Row style={{ marginBottom: 15 }}>
                            <Col span={4}/>
                            <Col span={14}>
                                <Select
                                    showSearch
                                    placeholder="Select provided service"
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    value={this.state.service} 
                                    onChange={ this.handleChange }
                                    style={{ width: '100%' }}
                                >
                                    {this.state.servicesData.map(service => (
                                        <Option key={service['id']} mode="multiple">{service['name']}</Option>
                                    ))}
                                </Select>
                                
                            </Col>
                            <Col span={4} style={{ paddingLeft: 10 }}>
                                <Button type="primary" htmlType="submit" onClick={e => this.endAttendence()}>
                                    <CheckOutlined /> Finish
                                </Button>
                            </Col>
                            <Col span={4}/>
                        </Row>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(TokenForm);