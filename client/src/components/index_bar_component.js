import React, {Component} from 'react';
import {connect} from 'react-redux';
import {startIndexing, indexTaskFail, indexTaskSuccess} from '../actions/index_bar_actions';
import Message from './flash_message_component';

const FLASH_MESSAGE_TIMEOUT = 10000;

class IndexBar extends Component {
  constructor(props) {
    super(props);
    this.renderContent = this.renderContent.bind(this);
    this.doIndexing = this.doIndexing.bind(this);
    this.urlInputRef = React.createRef();
    this.depthInputRef = React.createRef();
  }

  doIndexing() {
    let body = {
      url: this.urlInputRef.current.value,
      depth: this.depthInputRef.current.value,
    };
    this.props.startIndexing('/api/index', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  renderContent() {
    let content = [
    ];

    if(this.props.isIndexing) {
      return ([
        <b>Indexing...</b>,
        <div className="spinner-border text-info">
          <span className="sr-only"></span>
        </div>,
      ]);
    }else{
      content.push([
        <div class="input-group" style={{width: '60%'}}>
          <input id="urlInput" type="text" style={{width: '50%'}} class="form-control" ref={this.urlInputRef} placeholder="Enter URL..."/>
          <input type="text" class="form-control" style={{width: '10%'}} ref={this.depthInputRef} placeholder="Enter depth..."/>
          <div class="input-group-prepend">
            <button id="indexBtn" class="btn btn-outline-secondary" type="button" onClick={this.doIndexing}>Index</button>
          </div>
          <div>
            <input type="button" className="btn btn-link" value="Go to search" onClick={this.props.switcher}/>
          </div>
        </div>,
        <p></p>,
      ]);
      if(this.props.isFailed) {
        content.push(
            <Message timeout={FLASH_MESSAGE_TIMEOUT}
              class={'alert alert-danger'}
              message={this.props.errMsg}
              onTimeout={this.props.hideFailMsg}
            />
        );
      }
      if(this.props.isSucceeded) {
        content.push(
            <Message timeout={FLASH_MESSAGE_TIMEOUT}
              class={'alert alert-success'}
              message={'Indexing complete'}
              onTimeout={this.props.hideSuccessMsg}
            />
        );
      }
    }

    return content;
  }

  render() {
    return this.renderContent();
  }
}

const mapStateToProps = (state) => {
  return {
    isSucceeded: state.indexBarReducer.isSucceeded,
    isFailed: state.indexBarReducer.isFailed,
    isIndexing: state.indexBarReducer.isIndexing,
    errMsg: state.indexBarReducer.errMsg,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    startIndexing: (url, options) => dispatch(startIndexing(url, options)),
    hideFailMsg: () => dispatch(indexTaskFail({isFailed: false, errMsg: ''})),
    hideSuccessMsg: () => dispatch(indexTaskSuccess({isSucceeded: false})),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(IndexBar);
