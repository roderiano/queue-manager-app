import React from 'react';
import { Layout, Menu, Modal, Typography, } from 'antd';
import {
  PieChartOutlined,
  ClockCircleOutlined,
  LogoutOutlined,
  SettingOutlined
} from '@ant-design/icons';
import AuthenticationManager from '../services/auth'
import { Switch, Route, Link, withRouter, } from "react-router-dom";
import DepartmentList from './modules/departments/DepartmentList'
import UserList from './modules/users/UserList'
import ServiceList from './modules/services/ServiceList'


const { Content, Footer, Sider, Header, } = Layout;
const { Title, } = Typography;
const { SubMenu } = Menu;

class AppLayout extends React.Component {
    
    constructor(props) {
        super(props);
        this.authManager = new AuthenticationManager();
    }

    state = {
        siderCollapsed: true,
        modalLogoutVisible: false,
        confirmLogoutLoading: false,
        activedModule: null,
    };

    showLogoutModal = () => {
        this.setState({ modalLogoutVisible: true, });
    };

    handleLogoutConfirm = () => {
        this.setState({ confirmLogoutLoading: true, });
        let authManager = new AuthenticationManager();
        
        setTimeout(() => {
          this.setState({ modalLogoutVisible: false, confirmLogoutLoading: false, });
          authManager.logout();
          this.props.history.push('/');
        }, 1000);

    };

    handleLogoutCancel = () => {
        this.setState({ modalLogoutVisible: false, });
    };

    activeModule = (module) => {
        this.setState({ activedModule: module, });
    };
    
    onSiderCollapse = siderCollapsed => {
        this.setState({ siderCollapsed });
    };
  
    render () {
        return (
            <Layout style={{ minHeight: '100vh' }} >
                <Sider collapsible collapsed={this.state.siderCollapsed} onCollapse={this.onSiderCollapse}>
                    <div className="logo" />
                    <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                        <Menu.Item key="1" icon={<ClockCircleOutlined />}>
                            Tokens
                        </Menu.Item>
                        <Menu.Item key="2" icon={<PieChartOutlined />} disabled={ !this.authManager.getUser().is_superuser }>
                            Dashboard
                        </Menu.Item>
                        
                        <SubMenu key="sub2" icon={<SettingOutlined />} title="Settings" disabled={ !this.authManager.getUser().is_superuser }>
                            <Menu.Item key="3">
                                Users
                                <Link to="/users" />
                            </Menu.Item>

                            <Menu.Item key="4">
                                Services
                                <Link to="/services" />
                            </Menu.Item>

                            <Menu.Item key="5">
                                Departments
                                <Link to="/departments" />
                            </Menu.Item>
                        </SubMenu>

                        <Menu.Item key="6" icon={<LogoutOutlined />} onClick={this.showLogoutModal}>
                            Logout {"(" + this.authManager.getUser().username + ")"}
                        </Menu.Item>
                    </Menu> 
                </Sider>

                <Layout className="site-layout">
                    <Modal okText="Confirm" 
                        title={<Title level={5}>CONFIRM LOGOUT</Title>} 
                        visible={this.state.modalLogoutVisible} 
                        onOk={this.handleLogoutConfirm} 
                        onCancel={this.handleLogoutCancel}
                        confirmLoading={this.state.confirmLogoutLoading} >
                            <p>Do you really want to leave the system?</p>
                    </Modal>

                    <Header className="header-layout" />

                    <Content className="content-layout" >
                        <Switch>
                            <Route path="/users" component={UserList} />
                            <Route path="/services" component={ServiceList} />
                            <Route path="/departments" component={DepartmentList} />
                        </Switch> 
                    </Content>

                    <Footer style={{ textAlign: 'center' }}>Queue Manager ©2020 Created by Gabriel Silveira</Footer>
                </Layout>
            </Layout>
            
        );
    };
  
  }

  export default withRouter(AppLayout);
