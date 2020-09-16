import React from 'react';
import PointEstimateForm from '../components/Home';
import UserResults from '../components/HomeResults';

class HomePage extends React.Component {
  constructor(){
    super()
    this.state = {
      user: '',
      isUserLoaded: false,
      errorMessage: ''
    }
    
    this.componentCleanup = this.releaseUser.bind(this);
  }

  releaseUser() {
    const form = new FormData();
    form.append('user', this.state.user);
    fetch('/api/user/release', {method: 'POST', body: form})
  }
  
  componentDidMount() {
    fetch('/api/user/assign')
      .then((r) => {
        if(r.ok){
          return r.json();
        }else{
          console.error(r);
          throw new Error("Server can't be reached!");
        }
      })
      .then((data) => {
        document.title = `${data.user} - TPE for Teams` 
        this.setState({user: data.user});
      });

    window.onbeforeunload = this.componentCleanup;
  }

  componentWillUnmount() {
    // Only works with Chrome
    this.componentCleanup();
    window.onbeforeunload = this.componentCleanup;
  }

  render() {
      return (
      <div className="App">
        <header className="App-header">
          <>
            { this.state.errorMessage && <h3 className="error"> { this.state.errorMessage } </h3> }
            Your name is {this.state.user}.
          </>
        </header>
        <div>
          <PointEstimateForm username={this.state.user} />
          <UserResults />
        </div>
      </div>
    )
  }
}
export default HomePage;
