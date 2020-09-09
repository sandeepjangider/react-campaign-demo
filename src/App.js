import React, { Component } from 'react';
import Header from './components/Header/Header';
import Campaigns from './components/Campaigns/Campaigns';

class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <Campaigns />
      </div>
    );
  }
}

export default App;
