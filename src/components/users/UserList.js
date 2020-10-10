import React from 'react';
import { withRouter } from 'react-router-dom';
import { Typography } from 'antd';

const { Title } = Typography;

class UserList extends React.Component {

    render () {
        return (<Title>Users</Title>)
    }
}

export default withRouter(UserList);