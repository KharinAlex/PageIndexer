import React, {Component} from 'react';
import {connect} from 'react-redux';
import {startSearch, getPages, searchFail} from '../actions/search_bar_actions';
import Message from './flash_message_component';
import Parser from 'html-react-parser';

const FLASH_MESSAGE_TIMEOUT = 10000;


class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.prev_data_len = 0;
    this.inputRef = React.createRef();
    this.doSearch = this.doSearch.bind(this);
    this.doSearchMore = this.doSearchMore.bind(this);
    this.doOrderChange = this.doOrderChange.bind(this);
    this.renderContent = this.renderContent.bind(this);
  }

  componentDidMount() {
    this.props.getPages('/api/');
  }

  doOrderChange() {
    this.prev_data_len = 0;
    this.props.startSearch('/api/search_change_order', `q=${this.inputRef.current.value}`);
  }

  doSearch() {
    this.prev_data_len = 0;
    this.props.startSearch('/api/search', `q=${this.inputRef.current.value}`);
  }

  doSearchMore() {
    this.prev_data_len = this.props.data.length;
    this.props.startSearch('/api/search', `q=${this.inputRef.current.value}&offset=${this.props.offset}`);
  }

  renderContent() {
    let content = [
    ];
    if(this.props.isSearching) {
      return ([
        <b>Searching...</b>,
        <div className="spinner-border text-info">
          <span className="sr-only"></span>
        </div>,
      ]);
    }
    if(this.props.isFailed) {
      content.push(
          <Message timeout={FLASH_MESSAGE_TIMEOUT}
            class={'alert alert-danger'}
            message={this.props.errMsg}
            onTimeout={this.props.hideFailStatus}
          />
      );
    }
    if(this.props.isSucceeded) {
      if(this.props.data && (this.props.data.length > 0)) {
        content.push(...[
          <div>
            <p>
              <input type="button" className="btn btn-primary"
                value="Switch sort method" onClick={this.doOrderChange}/>
            </p>
          </div>,
          <div id="searchResults">
            {this.props.data.map((el, id) => ([
              <a href={el.uri} style={{all: 'unset'}}>
                <div id={`item_${id}`}>
                  <b>{Parser(el.title)}</b><br/>
                  {el.uri}<br/>
                  {Parser(el.content)}
                </div>
              </a>,
              <div><p></p></div>,
            ]))}
          </div>,
          <div>
            {!(this.props.data.length - this.prev_data_len < 10)
              && <p>
                <input type="button" className="btn btn-info"
                  value="View more..." onClick={this.doSearchMore}/>
              </p>
            }
          </div>,
        ]);
      }else{
        content.push(<p>No matches found</p>);
      }
    }

    return content;
  }


  render() {
    let header = ([
      <div className="input-group mb-3" style={{width: '40%'}}>
        <input id="searchInput" type="text" maxLength="80"
          ref={this.inputRef} className="form-control"
          placeholder="Enter keywords..."
          aria-describedby="basic-addon2"/>
        <div className="input-group-append">
          <button id="searchBtn" className="btn btn-outline-secondary" type="button" onClick={this.doSearch}>Search</button>
        </div>
        <input type="button" className="btn btn-link" value="Go to index" onClick={this.props.switcher}/>
      </div>,
      <div>Pages in index: {this.props.pages}</div>,
    ]);


    return [
      header,
      <p></p>,
      ...this.renderContent(),
    ];
  }
}

const mapStateToProps = (state) => {
  return {
    isSucceeded: state.searchBarReducer.isSucceeded,
    isFailed: state.searchBarReducer.isFailed,
    isSearching: state.searchBarReducer.isSearching,
    errMsg: state.searchBarReducer.errMsg,
    data: state.searchBarReducer.data,
    pages: state.searchBarReducer.pages,
    offset: state.searchBarReducer.offset,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    startSearch: (url, params) => dispatch(startSearch(url, params)),
    getPages: (url) => dispatch(getPages(url)),
    hideFailStatus: () => dispatch(searchFail({isFailed: false, errMsg: ''})),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
