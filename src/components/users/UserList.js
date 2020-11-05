import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { message, Table, Typography, Button, Divider, Space, Popconfirm } from 'antd';
import api from '../../services/api';
import { PlusOutlined, EditOutlined, DeleteOutlined, QuestionCircleOutlined, } from '@ant-design/icons';

const { Title, } = Typography

class UserList extends React.Component {

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
                title: 'Username',
                dataIndex: 'username',
            },
            {
                title: 'Action',
                render: (record) => (
                  <Space size="middle">
                        <Link to={ "/users/user/" + record.id } >
                            <Button icon={ <EditOutlined /> } size="small" type="primary">Edit</Button>
                        </Link>
                        
                        <Popconfirm title="Are you sure?" icon={<QuestionCircleOutlined style={{ color: 'red' }} />} onConfirm={() => this.deleteUser(record.id, record.username)}>
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
        usersData: [],
        waitingResponse: true,
        modalDeleteVisible: false,
        deleteId: null,
        deleteName: "",
        deleteModalVisible: false,
    }

    componentDidMount = () => {  
        this.getUsers();
    }

    showDeleteModal = (id, name) => {
        this.setState({
            deleteId: id,
            deleteName: name,
            deleteModalVisible: true,
        });
    };

    getUsers = async e => {
        try {
            this.setState({ waitingResponse: true });

            let response = await api.get("users/");
            this.setState({ usersData: response.data });
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

    deleteUser = async (id, username) => {
        try {
            let response = await api.delete("users/" + id + "/",);

            if(response.status === 204) {
                message.success('User "' + username + '" was deleted successfully.');
                this.props.history.push('/users');   
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
            <Title level={2} style={{ marginBottom: 0 }}>Users</Title>
            <Divider orientation="right" style={{ marginTop: 0 }}>
                <Link to="/users/user" >
                    <Button icon={<PlusOutlined /> } shape="round">Create User</Button>
                </Link>
            </Divider>

            <Table dataSource={ this.state.usersData } 
                columns={ this.columns } 
                bordered={ true } 
                size="middle" 
                loading={ this.state.waitingResponse } 
                rowKey="id"
            />
        </div>)
    }
}

export default withRouter(UserList);