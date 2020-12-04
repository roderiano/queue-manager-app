import React from 'react';
import { withRouter, } from 'react-router-dom';
import { List, Row, Col, message, Typography, Divider } from 'antd';
import api from '../../services/api';
import moment from 'moment';
import { BellOutlined, FieldTimeOutlined, ClockCircleOutlined,  } from '@ant-design/icons';
import Chart from 'chart.js';

const { Title, } = Typography

class Monitor extends React.Component {

    state = {
        lastTokensData: [],
        actualToken: null,
    };

    componentDidMount = () => {
        this.timer = setInterval( () => {
            this.getLastTokens();
        }, 1000)
    }

    getLastTokens = async e => {
        try {
            let response;
            let lastTokensData;
            let actualToken;

            response = await api.get("tokens/monitor/");

            if(response.data.length > 0) {
                lastTokensData = response.data;
                actualToken = lastTokensData[0];
                this.setState({ lastTokensData: lastTokensData, actualToken: actualToken });
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
    }

    render () {
        return (
            <Row gutter={16} style={{ height: '100%', margin: '0'}}>
                <Col span={19} style={{ paddingTop: '10%'}}>
                    <Title style={{textAlign: 'center'}}>KEY: { this.state.lastTokensData.length === 0 ? "-" : this.state.actualToken.key  }</Title>
                    <Title style={{textAlign: 'center'}}>PLACE: { this.state.lastTokensData.length === 0 ? "-" : this.state.actualToken.place  }</Title>
                </Col>
                <Col span={5}>
                    <Title strong style={{ height: '5%', textAlign: 'center'}}>Recent Tokens</Title>
                    <Divider style={{margin: '0'}} />
                    <List
                        className="monitor-list"
                        style={{ height: '90%', margin: '0'}}
                        dataSource={this.state.lastTokensData}
                        renderItem={item => (
                        <List.Item key={item.id} style={{ height: '18%',}}>
                            <Title level={4} style={{textAlign: 'center', width: '100%'}}>KEY: {item.key}<br/>PLACE: {item.place}</Title>
                        </List.Item>
                        )}
                        >
                    </List>
                </Col>
                
            </Row>
        )
    }
}

export default withRouter(Monitor);