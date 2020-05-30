import React, {Component} from 'react';
import SearchBar from './search_bar_component';
import IndexBar from './index_bar_component';

const components = {
  IndexBar: 0,
  SearchBar: 1,
};

class IndexerApp extends Component {
  constructor(props) {
    super(props);
    this.state = {component: components.SearchBar};
    this.switchComponents = this.switchComponents.bind(this);
  }

  switchComponents() {
    let newValue;

    switch (this.state.component) {
      case components.IndexBar:
        newValue = components.SearchBar;
        break;
      case components.SearchBar:
        newValue = components.IndexBar;
        break;
    }

    this.setState({component: newValue});
  }

  render() {
    return (
      <div id="componentContainer">
        {this.state.component == components.IndexBar && <IndexBar switcher={this.switchComponents}/>}
        {this.state.component == components.SearchBar && <SearchBar switcher={this.switchComponents} />}
      </div>
    );
  }
}

export default IndexerApp;
