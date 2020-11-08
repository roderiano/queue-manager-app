import React from 'react';
import { withRouter, } from 'react-router-dom';
import { Typography, Button, Image, message, Result  } from 'antd';
import { } from '@ant-design/icons';
import api from '../../services/api';

const { Title, } = Typography

class Monitor extends React.Component {

    state = {
        departmentsData: [],
        department: null,
        token_type: "",
        screen: "token_type",
        key: "",
    };

    componentDidMount = () => {  
        this.getDepartments();
    }

    getDepartments = async e => {
        try {
            let response = await api.get("departments/");
            await this.setState({ departmentsData: response.data });
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
            
            await this.setState({ waitingResponse: false });
        }
    }

    setTokenType = (option) => {
        this.setState({ token_type: option, screen: "department" })
    }

    setDepartment = async option => {
        await this.setState({ department: option, })
        this.submitToken();
    }

    submitToken = async e => {
        const { department, token_type, } = this.state;

        try {
            await this.setState({ waitingResponse: true });
            let response = await api.post("tokens/", { department, token_type });

            if(response.status === 201) {
                await this.setState({ key: response.data.key, screen: "token_view" });
                setTimeout(() => {
                    this.props.history.push("/totem");
                }, 5000);
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

            await this.setState({ waitingResponse: false });
        }
    };

    render () {
        return (
            <>
                <div className={this.state.screen === "token_type" ? 'totem-container' : 'totem-container hidden'}>
                    <Title>SELECT TOKEN TYPE</Title>
                    <Button onClick={ e => this.setTokenType("P")} className="totem-button" type="primary" block>
                        <Image preview={false} width={50} src={process.env.PUBLIC_URL + '/preferential.png'}/>
                        Preferential
                    </Button>
                    <Button onClick={e => this.setTokenType("N")} className="totem-button" type="secondary" block>Normal</Button>
                </div>

                <div className={this.state.screen === "department" ? 'totem-container' : 'totem-container hidden'}>
                    <Title>SELECT DEPARTMENT</Title>
                    {
                        this.state.departmentsData.map(department => <Button key={department.id} onClick={e => this.setDepartment(department.id)} className="totem-button" type="secondary" block>{department.name}</Button>)
                    }
                </div>

                <div className={this.state.screen === "token_view" ? 'totem-container' : 'totem-container hidden'}>
                <Result
                    status="success"
                    title="Token Created Succefully!"
                    subTitle={"Key: " + this.state.key}
                />
                </div>
            </>
        )
    }
}

export default withRouter(Monitor);