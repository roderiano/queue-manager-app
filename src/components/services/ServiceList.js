import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { message, Table, Typography, Button, Divider, Space, Popconfirm } from 'antd';
import api from '../../services/api';
import { PlusOutlined, EditOutlined, DeleteOutlined, QuestionCircleOutlined, } from '@ant-design/icons';

const { Title, } = Typography

class ServiceList extends React.Component {

    constructor(props) {
        super(props);
        this.columns = [
            {
              title: 'Id',
              dataIndex: 'id',
              width: '5%',
              align: 'center',
            },
            {
                title: 'Name',
                dataIndex: 'name',
            },
            {
                title: 'Action',
                render: (record) => (
                  <Space size="middle">
                        <Link to={ "/services/service/" + record.id } >
                            <Button icon={ <EditOutlined /> } size="small" type="primary">Edit</Button>
                        </Link>
                        
                        <Popconfirm title="Are you sure?" icon={<QuestionCircleOutlined style={{ color: 'red' }} />} onConfirm={() => this.deleteService(record.id, record.name)}>
                        <Button icon={ <DeleteOutlined /> } size="small" type="danger">Delete</Button>
                        </Popconfirm>
                  </Space>
                ),
                width: '10%',
                align: 'center',
            },
        ];
    }

    state  = {
        servicesData: [],
        waitingResponse: true,
        modalDeleteVisible: false,
        deleteId: null,
        deleteName: "",
        deleteModalVisible: false,
    }

    componentDidMount = () => {  
        this.getServices();
    }

    showDeleteModal = (id, name) => {
        this.setState({
            deleteId: id,
            deleteName: name,
            deleteModalVisible: true,
        });
    };

    getServices = async e => {
        try {
            this.setState({ waitingResponse: true });

            let response = await api.get("services/");
            this.setState({ servicesData: response.data });
            this.setState({ waitingResponse: false });
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

    deleteService = async (id, name) => {
        try {
            let response = await api.delete("services/" + id + "/",);

            if(response.status === 204) {
                message.success('Service "' + name + '" was deleted successfully.');
                this.props.history.push('/services');   
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

    render () {
        return (
        <div className="list-container">
            <Title level={2} style={{ marginBottom: 0 }}>Services</Title>
            <Divider orientation="right" style={{ marginTop: 0 }}>
                <Link to="/services/service" >
                    <Button icon={<PlusOutlined /> } shape="round">Create Service</Button>
                </Link>
            </Divider>

            <Table dataSource={ this.state.servicesData } 
                columns={ this.columns } 
                bordered={ true } 
                size="middle" 
                loading={ this.state.waitingResponse } 
                rowKey="id"
            />
        </div>)
    }
}

export default withRouter(ServiceList);