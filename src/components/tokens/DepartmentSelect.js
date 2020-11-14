import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Typography, Button, message, Statistic, Card, List, Row, Col, Divider, } from 'antd';
import api from '../../services/api';

const { Title, } = Typography

class DepartmentSelect extends React.Component {

    state = {
        departmentsData: [],
    };

    componentDidMount = () => {  
        this.getDepartments();
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
            
            await this.setState({ waitingResponse: false });
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
                                        <Statistic title="ARCHIVED" value={instance.tokens_info.archived} suffix="tokens" />
                                    </Col>
                                    <Col span={8}>
                                        <Statistic title="IN ATTENDENCE" value={instance.tokens_info.in_attendence} suffix="tokens" />
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