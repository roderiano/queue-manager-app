import React from 'react';
import { Layout, Menu, Modal, Typography } from 'antd';
import { withRouter } from 'react-router-dom';
import {
  PieChartOutlined,
  ClockCircleOutlined,
  LogoutOutlined,
  SettingOutlined
} from '@ant-design/icons';
import AuthenticationManager from './../services/auth'


const { Content, Footer, Sider } = Layout;
const { Title } = Typography;
const { SubMenu } = Menu;

class AppLayout extends React.Component {


    state = {
        siderCollapsed: true,
        modalLogoutVisible: false,
        confirmLogoutLoading: false,
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
          this.props.history.push('/auth');
        }, 1000);

    };

    handleLogoutCancel = e => {
        this.setState({ modalLogoutVisible: false, });
    };
    
    onSiderCollapse = siderCollapsed => {
        this.setState({ siderCollapsed });
    };
  
    render () {
        return (
            <Layout style={{ minHeight: '100vh' }}>
                <Sider collapsible collapsed={this.state.siderCollapsed} onCollapse={this.onSiderCollapse}>
                    <div className="logo"/>
                    <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                        <Menu.Item key="1" icon={<ClockCircleOutlined />}>
                            Tokens
                        </Menu.Item>
                        <Menu.Item key="2" icon={<PieChartOutlined />}>
                            Dashboard
                        </Menu.Item>
                        
                        <SubMenu key="sub2" icon={<SettingOutlined />} title="Settings">
                            <Menu.Item key="3">Users</Menu.Item>
                            <Menu.Item key="4">Services</Menu.Item>
                            <Menu.Item key="5">Departments</Menu.Item>
                        </SubMenu>
                        <Menu.Item key="6" icon={<LogoutOutlined />} onClick={this.showLogoutModal}>
                            Logout
                        </Menu.Item>
                    </Menu>
                </Sider>

                <Layout className="site-layout">
                    <Content style={{ margin: '0 16px' }}>
                        <Modal okText="Confirm" 
                        title={<Title level={5}>CONFIRM LOGOUT</Title>} 
                        visible={this.state.modalLogoutVisible} 
                        onOk={this.handleLogoutConfirm} 
                        onCancel={this.handleLogoutCancel}
                        confirmLoading={this.state.confirmLogoutLoading} >
                            <p>Do you really want to leave the system?</p>
                        </Modal>
                        
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>Queue Manager ©2020 Created by Gabriel Silveira</Footer>
                </Layout>
            </Layout>
        );
    };
  
  }

  export default withRouter(AppLayout);
