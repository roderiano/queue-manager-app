import React from 'react';
import { withRouter, } from 'react-router-dom';
import { Button, message, Statistic, Card, Row, Col, DatePicker, } from 'antd';
import api from '../../services/api';
import moment from 'moment';
import { BellOutlined, FieldTimeOutlined, ClockCircleOutlined, } from '@ant-design/icons';
import Chart from 'chart.js';

const { RangePicker, } = DatePicker


class Dashboard extends React.Component {

    constructor(props) {
        super(props)

        this.backgroundColor = [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
        ];
        this.borderColor = [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
        ];

        this.state = {
            tokensData: [],
            startDate: moment().hour(0).minutes(0).seconds(0),
            endDate:  moment().add(1, 'days').hour(0).minutes(0).seconds(0), 
            generalInfo: { totalTokens: "-", averageWaiting: "-", averageInAttendance: "-" },
        };
    }

    componentDidMount = () => {
        this.buildDashboard();
    }

    buildDashboard = async e => {
        var canvasTokensAmountPerDepartment = document.getElementById('tokensAmountPerDepartmentChart');
        var canvasTokensAmountPerClerk = document.getElementById('tokensAmountPerClerkChart');
        var canvasTotalTimePerClerk = document.getElementById('totalTimePerClerkChart');
        var canvasServicesAmount = document.getElementById('servicesAmountChart');

        try {
            let response = await api.get("tokens/dashboard_data/?start_date=" + this.state.startDate.format() + "&end_date=" + this.state.endDate.format());

            if(response.status === 200) {

                // General info
                let durationAverageWaiting = moment.duration(response.data.general_info.average_waiting);     
                let durationAverageInAttendance = moment.duration(response.data.general_info.average_in_attendace); 

                let labelWaiting =  moment.utc(durationAverageWaiting.as('milliseconds')).format('HH:mm:ss');
                let labelInAttendance =  moment.utc(durationAverageInAttendance.as('milliseconds')).format('HH:mm:ss');

                this.setState({generalInfo: { 
                                                totalTokens: response.data.general_info.total_tokens, 
                                                averageWaiting: labelWaiting, 
                                                averageInAttendance: labelInAttendance 
                                            }
                                });

                // Tokens amount per department
                if(this.tokensAmountPerDepartmentChart != null){
                    this.tokensAmountPerDepartmentChart.destroy();
                }
                
                this.tokensAmountPerDepartmentChart = new Chart(canvasTokensAmountPerDepartment, {
                    type: 'pie',
                    data: {
                        labels: response.data.tokens_amount_per_department.labels,
                        datasets: [{
                            data: response.data.tokens_amount_per_department.data,
                            backgroundColor: this.backgroundColor,
                            borderColor: this.borderColor,
                            borderWidth: 1,
                        }]
                    },
                });

                // Service amount
                if(this.servicesAmountChart != null){
                    this.servicesAmountChart.destroy();
                }

                this.servicesAmountChart = new Chart(canvasServicesAmount, {
                    type: 'pie',
                    data: {
                        labels: response.data.services_amount.labels,
                        datasets: [{
                            data: response.data.services_amount.data,
                            backgroundColor: this.backgroundColor,
                            borderColor: this.borderColor,
                            borderWidth: 1,
                        }]
                    },
                });

                // Total time per clerk
                if(this.totalTimePerkClerChart != null){
                    this.totalTimePerkClerChart.destroy();
                }

                this.totalTimePerkClerChart = new Chart(canvasTotalTimePerClerk, {
                    type: 'bar',
                    data: {
                        labels: response.data.total_time_per_clerk.labels,
                        datasets: [{
                            label: "Clerks",
                            data: response.data.total_time_per_clerk.data,
                            backgroundColor: this.backgroundColor,
                            borderColor: this.borderColor,
                            borderWidth: 1,
                        }]
                    },
                    options: {
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true
                                }
                            }]
                        },
                        tooltips: {
                            callbacks: {
                                label: function(tooltipItem, data) {
                                    var label;
                                    var seconds;
                                    var duration;
                                    
                                    seconds = Math.round(tooltipItem.yLabel * 100) / 100;
                                    duration = moment.duration(seconds, 'seconds');
                                    
                                    label =  moment.utc(duration.as('milliseconds')).format('HH:mm:ss');
                                    
                                    return label;
                                }
                            }
                        }
                    }
                });

                // Tokens amount per clerk
                if(this.tokensAmountPerClerkChart != null){
                    this.tokensAmountPerClerkChart.destroy();
                }

                console.log(response.data.total_time_per_clerk.data);
                this.tokensAmountPerClerkChart = new Chart(canvasTokensAmountPerClerk, {
                    type: 'bar',
                    data: {
                        labels: response.data.tokens_amount_per_clerk.labels,
                        datasets: [{
                            label: "Clerks",
                            data: response.data.tokens_amount_per_clerk.data,
                            backgroundColor: this.backgroundColor,
                            borderColor: this.borderColor,
                            borderWidth: 1,
                        }]
                    },
                    options: {
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true
                                }
                            }]
                        },
                    }
                });

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
            
            this.setState({ waitingResponse: false });
        }
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
                <div className="form-container" style={{width: '50%', marginLeft: '25%', marginRight: '25%', marginBottom: '1%'}}>
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
                <Row gutter={16}>
                    <Col span={8}>
                        <Card>
                        <Statistic
                            title="Total tokens"
                            prefix={<BellOutlined />}
                            value={this.state.generalInfo.totalTokens}
                        />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card>
                        <Statistic
                            title="Average waiting"
                            prefix={<FieldTimeOutlined />}
                            value={this.state.generalInfo.averageWaiting}
                        />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card>
                        <Statistic
                            title="Average in attendance"
                            prefix={<ClockCircleOutlined />}
                            value={this.state.generalInfo.averageInAttendance}
                        />
                        </Card>
                    </Col>
                    
                </Row>
                <Row style={{ marginTop: 25 }} gutter={16}>
                    <Col span={12}>
                        <Card title="Token amount per department">
                            <canvas id="tokensAmountPerDepartmentChart" width="100%" height="50"></canvas>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card title="Service amount">
                        <canvas id="servicesAmountChart" width="100%" height="50"></canvas>
                        </Card>
                    </Col>
                </Row>

                <Row style={{ marginTop: 25 }} gutter={16}>
                <Col span={12}>
                        <Card title="Total time in attendance per Clerk">
                        <canvas id="totalTimePerClerkChart" width="100%" height="50"></canvas>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card title="Token amount per Clerk">
                            <canvas id="tokensAmountPerClerkChart" width="100%" height="50"></canvas>
                        </Card>
                    </Col>
                </Row>
            </>
        )
    }
}

export default withRouter(Dashboard);