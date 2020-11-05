import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { message, Table, Typography, Button, Divider, Space, Popconfirm } from 'antd';
import api from '../../services/api';
import { PlusOutlined, EditOutlined, DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';

const { Title, } = Typography

class DepartmentList extends React.Component {

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
                        <Link to={ "/departments/department/" + record.id } >
                            <Button icon={ <EditOutlined /> } size="small" type="primary">Edit</Button>
                        </Link>
                        
                        <Popconfirm title="Are you sure?" icon={<QuestionCircleOutlined style={{ color: 'red' }} />} onConfirm={() => this.deleteDepartment(record.id, record.name)}>
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
        departmentsData: [],
        waitingResponse: true,
        modalDeleteVisible: false,
        deleteId: null,
        deleteName: "",
        deleteModalVisible: false,
    }

    componentDidMount = () => {  
        this.getDepartments();
    }

    showDeleteModal = (id, name) => {
        this.setState({
            deleteId: id,
            deleteName: name,
            deleteModalVisible: true,
        });
    };

    getDepartments = async e => {
        try {
            this.setState({ waitingResponse: true });

            let response = await api.get("departments/");
            
            this.setState({ departmentsData: response.data });
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

    deleteDepartment = async (id, name) => {
        try {
            let response = await api.delete("departments/" + id + "/",);

            if(response.status === 204) {
                message.success('Department "' + name + '" was deleted successfully.');
                this.props.history.push('/departments');   
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
            <Title level={2} style={{ marginBottom: 0 }}>Departments</Title>
            <Divider orientation="right" style={{ marginTop: 0 }}>
                <Link to="/departments/department" >
                    <Button icon={<PlusOutlined /> } shape="round">Create Service</Button>
                </Link>
            </Divider>

            <Table dataSource={ this.state.departmentsData } 
                columns={ this.columns } 
                bordered={ true } 
                size="middle" 
                loading={ this.state.waitingResponse }
                rowKey="id"  
            />
        </div>)
    }
}

export default withRouter(DepartmentList);