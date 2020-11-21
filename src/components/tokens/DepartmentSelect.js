import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Typography, Button, message, Statistic, Card, List, Row, Col, Divider, Modal } from 'antd';
import api from '../../services/api';
import AuthenticationManager from '../../services/auth';
import moment from 'moment';
import { ExclamationCircleOutlined, } from '@ant-design/icons';

const { Title, } = Typography
const { confirm, } = Modal

class DepartmentSelect extends React.Component {

    state = {
        departmentsData: [],
    };

    componentDidMount = () => {  
        this.getDepartments();
        this.getInAttendenceTokens();
    }

    getDepartments = async e => {
        try {
            let response = await api.get("departments/");
            await this.setState({ departmentsData: response.data });
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
    }

    getInAttendenceTokens = async e => {
        try {
            let authManager = new AuthenticationManager();
            let response = await api.get("tokens?status=IAT&clerk=" + authManager.getUser().id);

            if (response.data.length > 0) {
                confirm({
                    title: 'Token pendent since ' + moment(response.data[0].issue_date).format("DD/MM/YYYY HH:mm:ss"),
                    icon: <ExclamationCircleOutlined />,
                    content: 'Do you want open this attendence?',
                    okText: 'Yes',
                    okType: 'danger',
                    cancelText: 'No',
                    onOk: () => {
                        this.props.history.push("/tokens/token/" + response.data[0].id);
                    }
                })
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
    }

    render () {
        return (
            <>
                <List
                    grid={{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 6, xxl: 4, }}
                    dataSource={this.state.departmentsData}
                    renderItem={instance => (
                        <List.Item>
                            <Card 
                                actions={[
                                    <Link to={ "/tokens/" + instance.department.id } >
                                        <Button style={{float: 'right', marginRight: 10}}>Open</Button>
                                    </Link>
                                ]}
                            >
                                <Title level={4}>{instance.department.name.toUpperCase()}</Title>
                                <Divider />
                                <Row gutter={16}>
                                    <Col span={8}>
                                        <Statistic title="ISSUED" value={instance.tokens_info.issued} suffix="tokens" />
                                    </Col>
                                    <Col span={8}>
                                        <Statistic title="ATTENDENCE" value={instance.tokens_info.in_attendence} suffix="tokens" />
                                    </Col>
                                    <Col span={8}>
                                        <Statistic title="ARCHIVED" value={instance.tokens_info.archived} suffix="tokens" />
                                    </Col>
                                </Row>
                            </Card>
                        </List.Item>
                    )}
                />
            </>
        )
    }
}

export default withRouter(DepartmentSelect);