import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Typography, Button, message, Statistic, Card, List, Row, Col, DatePicker, Affix } from 'antd';
import api from '../../services/api';
import AuthenticationManager from '../../services/auth';
import moment from 'moment';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

const { Title, } = Typography
const { RangePicker, } = DatePicker


class Dashboard extends React.Component {

    state = {
        
    };

    componentDidMount = () => {  
        
    }

    render () {
        return (
            <>
                <Affix offsetTop={10} style={{marginBottom: '1%'}}>
                    <div className="form-container" style={{width: '50%', marginLeft: '25%', marginRight: '25%'}}>
                        <div className="form-margin">
                            <RangePicker style={{ marginRight: '1%', width: '69%' }}  showTime/>
                            <Button type="primary" style={{width: '30%'}}>Search</Button>
                        </div>
                    </div>  
                </Affix>
                <Row gutter={16}>
                    <Col span={8}>
                        <Card>
                        <Statistic
                            title="Active"
                            value={11.28}
                            precision={2}
                            valueStyle={{ color: '#3f8600' }}
                            prefix={<ArrowUpOutlined />}
                            suffix="%"
                        />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card>
                        <Statistic
                            title="Idle"
                            value={9.3}
                            precision={2}
                            valueStyle={{ color: '#cf1322' }}
                            prefix={<ArrowDownOutlined />}
                            suffix="%"
                        />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card>
                        <Statistic
                            title="Idle"
                            value={9.3}
                            precision={2}
                            valueStyle={{ color: '#cf1322' }}
                            prefix={<ArrowDownOutlined />}
                            suffix="%"
                        />
                        </Card>
                    </Col>
                </Row>
            </>
        )
    }
}

export default withRouter(Dashboard);