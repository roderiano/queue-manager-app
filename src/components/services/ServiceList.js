import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { message, Table, Typography, Button, Divider, Space, Modal, Popconfirm } from 'antd';
import api from '../../services/api';
import { PlusOutlined, EditOutlined, DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';

const { Title, } = Typography
const { confirm, } = Modal;

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
                        
                        <Popconfirm title="Are you sure?" icon={<QuestionCircleOutlined style={{ color: 'red' }} />} onConfirm={() => this.delete(record.id, record.name)}>
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
        waiting_response: true,
        modalDeleteVisible: false,
        delete_id: null,
        delete_name: "",
        delete_modal_visible: false,
    }

    componentDidMount = () => {  
        this.getServices();
    }

    showDeleteModal = (id, name) => {
        this.setState({
            delete_id: id,
            delete_name: name,
            delete_modal_visible: true,
        });
    };

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

    delete = async (id, name) => {
        try {
            let response = await api.delete("services/" + id + "/",);
            message.success('Service "' + name + '" was deleted successfully.');
            this.props.history.push('/services');
        } catch (err) {
            if (typeof err.response !== 'undefined') {
                if (err.response.data.detail !== 'undefined')
                    message.error(err.response.data.name);
            }
            else {
                message.error(err.message);   
            }
            this.setState({ waiting_response: false });
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
                loading={ this.state.waiting_response } 
            />
        </div>)
    }
}

export default withRouter(ServiceList);