import React from 'react';
import { withRouter } from 'react-router-dom';
import { Typography } from 'antd';

const { Title } = Typography;

class ServiceList extends React.Component {

    render () {
        return (<Title>Services</Title>)
    }
}

export default withRouter(ServiceList);