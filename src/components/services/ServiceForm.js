import React from 'react';
import { withRouter, } from 'react-router-dom';
import { message, Table, Typography, Button, Divider, Space } from 'antd';
import api from '../../../services/api';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title, } = Typography

class ServiceForm extends React.Component {


    render () {
        return (<Title level={2} style={{ marginBottom: 0 }}>FORTM</Title>)
    }
}

export default withRouter(ServiceList);