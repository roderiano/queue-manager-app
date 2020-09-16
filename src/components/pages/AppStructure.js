import React from 'react';
import { Layout, Menu } from 'antd';
import {
  PieChartOutlined,
  ClockCircleOutlined,
  LogoutOutlined,
  SettingOutlined
} from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

class AppLayout extends React.Component {


    state = {
        collapsed: true,
      };
    
    onCollapse = collapsed => {
        console.log(collapsed);
        this.setState({ collapsed });
    };
  
    render () {
        return (
            <Layout style={{ minHeight: '100vh' }}>
                <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
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
                        <Menu.Item key="6" icon={<LogoutOutlined />}>
                            Logout
                        </Menu.Item>
                    </Menu>
                </Sider>

                <Layout className="site-layout">
                    <Content style={{ margin: '0 16px' }}>
                        
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>Queue Manager ©2020 Created by Gabriel Silveira</Footer>
                </Layout>
            </Layout>
        );
    };
  
  }

  export default AppLayout;
