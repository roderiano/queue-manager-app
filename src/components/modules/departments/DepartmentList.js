import React from 'react';
import { withRouter } from 'react-router-dom';
import { Typography } from 'antd';

const { Title } = Typography;

class DepartmentList extends React.Component {

    render () {
        return (<Title>Departments</Title>)
    }
}

export default withRouter(DepartmentList);