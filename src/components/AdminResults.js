import React from 'react';
import { closestEstimationValue } from '../tools/helpers';

class DisplayResults extends React.Component {
  constructor() {
    super();
    this.state = {
      forceResults: false,
      hashCode: 0,
      results: '',
      partialResults: '',
      ticketNumber: '',
      prefixLink: '',
    };

    this.resetUsers = this.resetUsers.bind(this);
    this.getResults = this.getResults.bind(this);
    this.nextTicket = this.nextTicket.bind(this);
    this.handleChangeAndResize = this.handleChangeAndResize.bind(this);
  }

  getResults() {
    const form = new FormData();
    if(this.state.prefixLink !== ''){
      form.append('url', this.state.prefixLink+this.state.ticketNumber);
    }else{
      form.append('url', '');
    }
    fetch('/api/points/total', {
      method: "POST",
      body: form,
    })
    .then((r) => {
      if(r.ok){
        return r.json();
      }else{
        console.error(r);
        throw new Error("Server can't be reached!");
      }
    })
    .then((data) => {
      if (data.status === "waiting") {
        this.setState({results: ''});
        this.setState({partialResults: data.results});
        this.setState({fibo: ''});
        this.setState({waitingFor: data.waitingFor});
      }
      else if(data.status === "empty") {
        this.setState({results: ''});
        this.setState({partialResults: ''});
        this.setState({fibo: ''});
        this.setState({waitingFor: data.waitingFor});
      }
      else if(data.status === "ready" || this.state.forceResults) {
        if(this.state.forceResults) {
          this.setState({partialResults: data.results});
          this.setState({results: ''});
        } else {
          this.setState({partialResults: ''});
          this.setState({results: data.results});
        }
        this.setState({fibo: closestEstimationValue(data.results)});
        this.setState({waitingFor: data.waitingFor});
        
        if(this.state.hashCode !== data.hashCode) {
          fetch('/api/points/raw')
            .then((r) => r.json())
            .then((d) => {
              this.setState({rawData: d.dict});
              this.setState({users: d.users});
              this.setState({hashCode: data.hashCode});
            })
        }
      }
    });
  }

  resetUsers() {
    fetch('/api/all/reset')
    .then((r) => r.json())
    .then(this.getResults)
  }

  nextTicket() {
    fetch('/api/points/reset')
    .then((r) => r.json())
    .then(()=>{
      this.setState({ticketNumber: ""});
    })
  }

  componentDidMount() {
    this.getResults();
    this.interval = setInterval(() => this.getResults(), 5000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }
  
  handleChangeAndResize(e) {
    this.setState({[e.target.name]: e.target.value || ''})
    var spanElm = e.target.nextElementSibling;
    spanElm.textContent = e.target.value;
    e.target.style.width = (spanElm.scrollWidth > 60 ? spanElm.scrollWidth - 40 : 60) + 'px'; // apply width of the span to the input
  }

  render() {
    const displayTicketUrl = this.state.prefixLink===''?'':this.state.prefixLink+this.state.ticketNumber;
    return (
      <div>
        <hr />
        { this.state.waitingFor && <h3 className="error"> We are waiting for { this.state.waitingFor } </h3> }
        <div>
          { this.state.results !== '' && <h3 className="global-results">Global results: {closestEstimationValue(this.state.results)}. ({this.state.results})</h3> }
          { this.state.partialResults !== '' && <h3 className="partial-results">Partial results: {closestEstimationValue(this.state.partialResults)}. ({this.state.partialResults})</h3> }
          { this.state.results === '' && this.state.partialResults === '' && <span>Not available.</span> }
        </div>
        <hr />
          <label><input type="checkbox" checked={this.state.forceResults} onChange={() => this.setState({forceResults: !this.state.forceResults})} />Force results</label>
          <div></div>
          <button onClick={this.resetUsers}>Reset Users</button>
          <div></div>
          <button onClick={this.nextTicket}>Reset Results</button>
          <div>
            <label>Prefix Link <input className="adaptative-size" type="text" name="prefixLink" value={this.state.prefixLink} onChange={this.handleChangeAndResize} style={{borderRight: "1px"}} /><span className="adaptative-measure"></span></label>
            <label><input className="adaptative-size" type="text" name="ticketNumber" value={this.state.ticketNumber} onChange={this.handleChangeAndResize} style={{borderLeft: "none", width : "60px"}} /><span className="adaptative-measure"></span> Ticket Number</label>
          </div>
          <a href={this.state.prefixLink+this.state.ticketNumber} target="_blank" rel="noopener noreferrer">{displayTicketUrl}</a>
        <hr />
        <div>
          {(this.state.results || this.state.forceResults) && this.state.users && <span>Users: {this.state.users.join(', ')}</span>}
          {(this.state.results || this.state.forceResults) && this.state.rawData && 
            <table>
              <thead>
                <tr><th>Name</th><th>Optimistic</th><th>Most Likely</th><th>Pessimistic</th></tr>
              </thead>
              <tbody>
              {
                Object.entries(this.state.rawData).map(([key, values]) => {
                  return (
                    <tr key={key}>
                      <td key={key}>{key}</td>
                      {
                        values.map((y, index) => {
                          return (
                            <td key={key+index}>{y}</td>
                          );
                        })
                      }
                    </tr>
                  );
                })
              }
              </tbody>
            </table>
          }
        </div>
      </div>
    );
  }
}
export default DisplayResults;
