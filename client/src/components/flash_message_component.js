import React, {Component} from 'react';

class Message extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    setTimeout(() => this.props.onTimeout(), this.props.timeout);
  }

  render() {
    return (

      <div className={this.props.class}>
        {this.props.message}
      </div>
    );
  }
}

export default Message;
