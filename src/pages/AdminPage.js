import React from 'react';
import DisplayResults from '../components/AdminResults';

class AdminPage extends React.Component {
  componentDidMount() {
    document.title = `Results - TPE for Teams` 
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          Admin mode
        </header>
        <div>
          <DisplayResults />
        </div>
      </div>
    )
  }
}
export default AdminPage;
