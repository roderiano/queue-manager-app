import React from 'react';
import { Layout, Menu, Modal, Typography, } from 'antd';
import {
  PieChartOutlined,
  ClockCircleOutlined,
  LogoutOutlined,
  SettingOutlined,
  ApartmentOutlined
} from '@ant-design/icons';
import AuthenticationManager from '../services/auth'
import { Route, Link, withRouter } from "react-router-dom";
import ServiceList from './services/ServiceList'
import ServiceForm from './services/ServiceForm'
import DepartmentTokens from './tokens/DepartmentSelect'
import TokenList from './tokens/TokenList'
import DepartmentList from './departments/DepartmentList'
import DepartmentForm from './departments/DepartmentForm'
import UserList from './users/UserList'
import UserForm from './users/UserForm'
import TokenForm from './tokens/TokenForm';
import Dashboard from './dashboard/Dashboard';


const { Content, Footer, Sider, Header, } = Layout;
const { Title, } = Typography;
const { SubMenu } = Menu;

class AppTemplate extends React.Component {
    
    constructor(props) {
        super(props);
        this.authManager = new AuthenticationManager();
    }

    state = {
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
  
    render () {
        const { location } = this.props
        
        let selectedKeys = [];
        let openedSubmenu = /(users)|(services)|(departments)/i.test(location.pathname) ? ['manager'] : [];

        if(/(department-select)|(tokens)/i.test(location.pathname))
            selectedKeys = ['/tokens']
        else if(/dashboard/i.test(location.pathname))
            selectedKeys = ['/dashboard']
        else if(/users/i.test(location.pathname))
            selectedKeys = ['/users']
        else if(/services/i.test(location.pathname))
            selectedKeys = ['/services']
        else if(/departments/i.test(location.pathname))
            selectedKeys = ['/departments']    

        return (
            <Layout style={{ minHeight: '100vh' }} >
                <Sider 
                    style={{
                            overflow: 'auto',
                            height: '100vh',
                            position: 'fixed',
                            left: 0,
                        }}
                >
                    <div className="logo"></div>
                    <Menu theme="dark" selectedKeys={selectedKeys} mode="inline" defaultOpenKeys={openedSubmenu}>
                        <Menu.Item key="/tokens" icon={<ClockCircleOutlined />}>
                            Tokens
                            <Link to="/department-select"/>
                        </Menu.Item>

                        <Menu.Item key="/dashboard" icon={<PieChartOutlined />} disabled={ !this.authManager.getUser().is_superuser }>
                            Dashboard
                            <Link to="/dashboard"/>
                        </Menu.Item>
                        
                        <SubMenu key="manager" icon={<SettingOutlined />} title="Settings" disabled={ !this.authManager.getUser().is_superuser }>
                            <Menu.Item key="/users">
                                Users
                                <Link to="/users" />
                            </Menu.Item>

                            <Menu.Item key="/services">
                                Services
                                <Link to="/services" />
                            </Menu.Item>

                            <Menu.Item key="/departments">
                                Departments
                                <Link to="/departments" />
                            </Menu.Item>
                        </SubMenu>

                        <SubMenu key="sub2" icon={<ApartmentOutlined />} title="Modules" disabled={ !this.authManager.getUser().is_superuser }>
                            <Menu.Item key="/monitor">
                                Monitor
                            </Menu.Item>

                            <Menu.Item key="/totem">
                                Totem
                                <Link to="/totem" />
                            </Menu.Item>
                        </SubMenu>

                        <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={this.showLogoutModal}>
                            Logout {"(" + this.authManager.getUser().username + ")"}
                        </Menu.Item>
                    </Menu> 
                </Sider>

                <Layout className="site-layout" style={{ marginLeft: 200 }}>
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
                        <Route exact path="/department-select" component={ () => <DepartmentTokens /> } />
                        <Route exact path="/tokens/:department" component={ ({match}) => <TokenList id={ match.params.department } /> } />
                        <Route exact path="/tokens/token/:id" render={ ({match}) => ( <TokenForm id={ match.params.id } /> ) } />

                        <Route exact path="/services" component={ () => <ServiceList /> } />
                        <Route exact path="/services/service"  component={ () => <ServiceForm method="create" /> } />
                        <Route exact path="/services/service/:id" render={ ({match}) => ( <ServiceForm id={ match.params.id } method="update" /> ) } />

                        <Route exact path="/departments" component={ () => <DepartmentList /> } />
                        <Route exact path="/departments/department"  component={ () => <DepartmentForm method="create" /> } />
                        <Route exact path="/departments/department/:id" render={ ({match}) => ( <DepartmentForm id={ match.params.id } method="update" /> ) } />

                        <Route exact path="/users" component={ () => <UserList /> } />
                        <Route exact path="/users/user"  component={ () => <UserForm method="create" /> } />
                        <Route exact path="/users/user/:id" render={ ({match}) => ( <UserForm id={ match.params.id } method="update" /> ) } />

                        <Route exact path="/dashboard" component={ () => <Dashboard /> } />
                    </Content>

                    <Footer style={{ textAlign: 'center' }}>Queue Manager ©2020 Created by Gabriel Silveira</Footer>
                </Layout>
            </Layout>
            
        );
    };
  
  }

  export default withRouter(AppTemplate);
