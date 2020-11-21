import React from 'react';
import { withRouter, } from 'react-router-dom';
import { Button, message, Statistic, Card, Row, Col, DatePicker, Affix } from 'antd';
import api from '../../services/api';
import moment from 'moment';
import { BellOutlined, FieldTimeOutlined, ClockCircleOutlined, } from '@ant-design/icons';

const { RangePicker, } = DatePicker


class Dashboard extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            tokensData: [],
            startDate: moment().hour(0).minutes(0).seconds(0),
            endDate:  moment().add(1, 'days').hour(0).minutes(0).seconds(0), 
            generalInfo: { totalTokens: "-", averageWaiting: "-", averageInAttendance: "-" }
        };
    }

    buildDashboard = async e => { 
        await this.getTokens();

        if(this.state.tokensData.length > 0) {
            await this.refreshGeneralInfo();
        }
    }

    getTokens = async e => {
        try {
            let response = await api.get("tokens?start_date=" + this.state.startDate.format() + "&end_date=" + this.state.endDate.format());
            this.setState({ tokensData: response.data });
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
            
            this.setState({ waitingResponse: false });
        }
    }

    refreshGeneralInfo = async e => {
        let totalTokens;
        let averageWaiting;
        let averageInAttendance;
        let duration = moment.duration();
        

        // Total tokens
        totalTokens = this.state.tokensData.length;

        // Average waiting
        duration = moment.duration();
        this.state.tokensData.forEach(token => {
            duration.add(token.time_waiting_attendence);   
        });
        averageWaiting = moment.utc(duration.as('milliseconds') / this.state.tokensData.length).format('HH:mm:ss');

        // Average in attendance
        duration = moment.duration();
        this.state.tokensData.forEach(token => {
            duration.add(token.time_in_attendence);   
            
        });
        averageInAttendance = moment.utc(duration.as('milliseconds') / this.state.tokensData.length).format('HH:mm:ss');

        this.setState({ generalInfo: { totalTokens: totalTokens, averageWaiting: averageWaiting, averageInAttendance: averageInAttendance} })
    }
    
    onChange = (value, dateString) => {
        this.setState({
                        startDate: moment(dateString[0]), 
                        endDate: moment(dateString[1]),
                    });
    }

    render () {
        return (
            <>
                <Affix offsetTop={10} style={{marginBottom: '1%'}}>
                    <div className="form-container" style={{width: '50%', marginLeft: '25%', marginRight: '25%'}}>
                        <div className="form-margin">
                            <RangePicker 
                                style={{ marginRight: '1%', width: '69%' }}
                                onChange={this.onChange}
                                defaultValue={[this.state.startDate, this.state.endDate]}
                                showTime
                            />
                            <Button type="primary" style={{width: '30%'}} onClick={e => this.buildDashboard()}>Search</Button>
                        </div>
                    </div>  
                </Affix>
                <Row gutter={16}>
                    <Col span={8}>
                        <Card>
                        <Statistic
                            title="Tokens"
                            prefix={<BellOutlined />}
                            value={this.state.generalInfo.totalTokens}
                        />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card>
                        <Statistic
                            title="Average Waiting"
                            prefix={<FieldTimeOutlined />}
                            value={this.state.generalInfo.averageWaiting}
                        />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card>
                        <Statistic
                            title="Average in Attendance"
                            prefix={<ClockCircleOutlined />}
                            value={this.state.generalInfo.averageInAttendance}
                        />
                        </Card>
                    </Col>
                    
                </Row>
                <Row style={{ marginTop: 25 }} gutter={16}>
                    <Col span={12}>
                        <Card title="Attendance per Department">
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card title="Average in Attendance">
                        </Card>
                    </Col>
                </Row>
            </>
        )
    }
}

export default withRouter(Dashboard);