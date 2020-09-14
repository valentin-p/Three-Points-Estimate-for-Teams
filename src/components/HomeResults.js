import React from 'react';
import { closestEstimationValue } from '../tools/helpers';

class UserResults extends React.Component {
  constructor() {
    super();
    this.state = {
      forceResults: false,
    };
  }

  getResults() {
    fetch('/api/points/total')
      .then((r) => r.json())
      .then((data) => {
        if (data.status === "ready" || this.state.forceResults) {
          this.setState({ results: data.results });
          this.setState({ fibo: closestEstimationValue(data.results) });
          this.setState({ waitingFor: "" });
        }
        else if (data.status === "waiting") {
          this.setState({ results: '' });
          this.setState({ waitingFor: data.waitingFor });
        }
      });
  }

  componentDidMount() {
    this.interval = setInterval(() => this.getResults(), 5000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div>
        <hr />
        {this.state.waitingFor && <h3 className="error"> We are waiting for {this.state.waitingFor} </h3>}
        <div>
          {this.state.results && <span>Global results: {closestEstimationValue(this.state.results)}. ({this.state.results})</span>}
          {this.state.results === '' && <span>Not available.</span>}
          <hr />
          <label><input type="checkbox" checked={this.state.forceResults} onChange={() => this.setState({ forceResults: !this.state.forceResults })} />Force results</label>
        </div>
      </div>
    );
  }
}

export default UserResults;
