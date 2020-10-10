import React from 'react';
import { withRouter, } from 'react-router-dom';
import { message, Table, Typography, Button, Divider, Space } from 'antd';
import api from '../../services/api';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      width: '5%',
      align: 'center',
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Action',
        key: 'action',
        render: (record) => (
          <Space size="middle">
                <Button icon={ <EditOutlined /> } size="small" type="primary">Edit</Button>
                <Button icon={ <DeleteOutlined /> } size="small" type="danger">Delete</Button>
          </Space>
        ),
        width: '10%',
        align: 'center',
    },
    ];
const { Title, } = Typography

class ServiceList extends React.Component {

    state  = {
        servicesData: null,
        waiting_response: true,
    }

    componentDidMount = () => {  
        this.getServices();
    }

    getServices = async e => {
        try {
            this.setState({ waiting_response: true });
            let response = await api.get("services/");
            this.setState({ servicesData: response.data });
            this.setState({ waiting_response: false });
        } catch (err) {
            message.error("There was a communication problem with the service, try again.");
            this.setState({ waiting_response: false });
        }
    }

    render () {
        return (
        <div className="list-container">
            <Title level={2} style={{ marginBottom: 0 }}>Services</Title>

            <Divider orientation="right" style={{ marginTop: 0 }}>
                <Button icon={<PlusOutlined /> } shape="round">Create Service</Button>
            </Divider>

            <Table dataSource={ this.state.servicesData } 
                    columns={ columns } 
                    bordered={ true } 
                    size="middle" 
                    loading={ this.state.waiting_response } />
        </div>)
    }
}

export default withRouter(ServiceList);