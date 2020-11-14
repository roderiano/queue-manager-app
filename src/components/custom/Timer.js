import React from 'react';
import moment from 'moment';
import { Typography, } from 'antd';

const { Text, } = Typography;

class Timer extends React.Component {
    constructor(p) {
      super(p)
      this.interval = 1000
      this.startTime = new Date(p.ts)

      this.state = {
        timerText: ""
      }
    }

    componentDidMount() {
      this.updateText();

      this.timer = setInterval( () => {
        this.updateText();
      }, this.interval)
    }

    updateText = () => {
        let duration = moment.utc(moment().diff(moment(this.startTime))); //.format("HH:mm:ss");
        let days = parseInt(duration.format("D"));

        this.setState({timerText: days === 1 ? duration.format("HH:mm:ss") : days.toString() + "D " + duration.format("HH:mm:ss")});
    }

    render() {
      return (
        <Text strong style={{ fontSize: 15 }} level={5}>{this.state.timerText}</Text>
      )
    }
  }

  export default(Timer);