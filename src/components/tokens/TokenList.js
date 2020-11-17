import React from 'react';
import { withRouter, } from 'react-router-dom';
import { message, Table, Typography, Tag, Button, } from 'antd';
import api from '../../services/api';
import moment from 'moment';
import { PlayCircleOutlined, } from '@ant-design/icons';

import Timer from '../custom/Timer';

const { Text, } = Typography

class TokenList extends React.Component {

    constructor(props) {
        super(props);
        this.columns = [
            {
              title: 'Key',
              dataIndex: 'key',
              width: '10%',
              align: 'center',
            },
            {
                title: 'Issue Date',
                width: '40%',
                align: 'center',
                render: (record) => (
                                    <Text>{moment(record.issue_date).format("dddd, MMMM Do YYYY, h:mm:ss a")}</Text>
                                )
            },
            {
                title: 'Type',
                align: 'center',
                width: '3%',
                render: (record) => (
                    <Tag style={{width: 100}} 
                        color={record.token_type === "P" ? "processing" : "default"}>
                        {record.token_type === "P" ? "Preferential" : "Normal"}
                    </Tag>
                )
            },
            {
                title: 'Waiting Time',
                width: '5%',
                align: 'center',
                render: (record) => (
                                    <Timer ts={record.issue_date}/>
                                )
            },
            {
                title: 'Action',
                align: 'center',
                width: '1%',
                render: (record) => (
                    <Button type="text" icon={<PlayCircleOutlined />} size={"large"} onClick={e => this.startAttendence(record.id)}>
                        Start Attendence
                    </Button>
                )
            },
        ];
    }

    state  = {
        tokensData: [],
        waitingResponse: true,
        modalDeleteVisible: false,
        deleteId: null,
        deleteName: "",
        deleteModalVisible: false,
    }

    componentDidMount = () => {  
        this.getTokens();
    }

    getTokens = async e => {
        try {
            this.setState({ waitingResponse: true });
            let response = await api.get("tokens?ordering=-token_type,issue_date&status=TIS&department=" + this.props.id);
            await this.setState({ tokensData: response.data, waitingResponse: false });
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

    startAttendence = async (id) => {
        try {
            let response = await api.put("tokens/" + id + "/start_attendence/");

            if(response.status === 200) 
            {
                message.success("Token \"" + response.data.key + "\" in attendence.");
                this.props.history.push("/tokens/token/" + id);
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
        <div className="list-container">
            <Table dataSource={ this.state.tokensData } 
                columns={ this.columns } 
                bordered={ true } 
                size="middle" 
                loading={ this.state.waitingResponse } 
                rowKey="id"
            />
        </div>)
    }
}

export default withRouter(TokenList);