import React from 'react';
import PointEstimateForm from '../components/Home';
import UserResults from '../components/HomeResults';

class HomePage extends React.Component {
  constructor() {
    super();
    this.state = {
      user: '',
      name: '',
      isUserLoaded: false,
      errorMessage: '',
    };

    this.releaseUser = this.releaseUser.bind(this);
    this.assignUserWrapper = this.assignUserWrapper.bind(this);
    this.assignUser = this.assignUser.bind(this);
    this.handleChangeAndResize = this.handleChangeAndResize.bind(this);

    this.changeNameTimeout = null;
    this.assignUserDefered = false;
    this.assignUserLock = false;
  }

  releaseUser(callback = false) {
    const form = new FormData();
    form.append('user', this.state.user);
    fetch('/api/user/release', { method: 'POST', body: form }).then(() => {
      if (callback) this.assignUserWrapper();
    });
  }

  assignUserWrapper() {
    if (this.assignUserLock === true) {
      this.assignUserDefered = true;
      return;
    }
    this.assignUserLock = true;
    this.assignUser();
  }

  assignUser() {
    const form = new FormData();
    if (this.state.name !== '') {
      form.append('name', this.state.name);
    }

    fetch('/api/user/assign', { method: 'POST', body: form })
      .then((r) => {
        if (r.ok) {
          return r.json();
        } else {
          this.assignUserLock = false;
          console.error(r);
          throw new Error("Server can't be reached!");
        }
      })
      .then((data) => {
        this.setState({ user: data.user }, () => {
          document.title = `${data.user} - TPE for Teams`;
          this.assignUserLock = false;
          if (this.assignUserDefered === true) {
            this.assignUserDefered = false;
            if (this.state.user !== this.state.name) {
              this.assignUserWrapper();
            }
          }
        });
      });
  }

  handleChangeAndResize(e) {
    this.setState({ [e.target.name]: e.target.value.trim() || '' }, () => {
      if (this.changeNameTimeout != null) {
        clearTimeout(this.changeNameTimeout);
      }
      this.changeNameTimeout = setTimeout(() => {
        this.releaseUser(true);
        this.changeNameTimeout = null;
      }, 300);
    });

    var spanElm = e.target.nextElementSibling;
    spanElm.textContent = e.target.value;
    e.target.style.width =
      (spanElm.scrollWidth > 100 ? spanElm.scrollWidth : 100) + 'px';
  }

  componentDidMount() {
    this.assignUserWrapper();
    window.onbeforeunload = this.releaseUser;
  }

  componentWillUnmount() {
    // Only works with Chrome
    this.releaseUser();
    window.onbeforeunload = this.releaseUser;
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <>
            {this.state.errorMessage && (
              <h3 className="error"> {this.state.errorMessage} </h3>
            )}
            Your name is {this.state.user}.
            <label>
              Change Name{' '}
              <input
                className="adaptative-size"
                type="text"
                name="name"
                autoComplete="off"
                value={this.state.name}
                onChange={this.handleChangeAndResize}
              />
              <span className="adaptative-measure"></span>
            </label>
          </>
        </header>
        <div>
          <PointEstimateForm username={this.state.user} />
          <UserResults />
        </div>
      </div>
    );
  }
}
export default HomePage;
