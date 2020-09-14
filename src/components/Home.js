import React from 'react';
import PropTypes from 'prop-types';
import {validEstimation,  closestEstimationValue } from '../tools/helpers';

class PointEstimateForm extends React.Component{
  constructor(props) {
    super()
    this.state = {
      optimistic: '',
      mostLikely: '',
      pessimistic: '',
      globalSetValue: '',
      globalSetName: 'optimistic',
      submitted: false,
      hasChanged: false,
      showCheckmark: false,
      user: props.username,
    };

    this.globalSetTimeout = null;
    this.tempGlobalSetValue = '';
    this.previousTempGlobalSetValue = '';
    this.logGlobalSetKey = this.logGlobalSetKeyChange.bind(this);

    this.submitCheckmarkTimeout = null;

    this.handleChange = this.handleInputRadioChange.bind(this);
    this.handleSubmit = this.handleFormSubmit.bind(this);
    this.handleGlobalSet = this.handleGlobalSetChange.bind(this);
  }
  
  static getDerivedStateFromProps(props, state) {
    state.user = props.username;
    return state;
  }
  
  componentDidMount() {
    document.onkeyup = this.logGlobalSetKey;
  }
  
  componentWillUnmount(){
    document.onkeyup = null;
  }

  logGlobalSetKeyChange (event) {
    let applyGlobalSetValue = () =>  {
      if (this.tempGlobalSetValue === '' && this.previousTempGlobalSetValue !== '') {
        this.tempGlobalSetValue = this.previousTempGlobalSetValue;
      }
      if (this.tempGlobalSetValue !== '') {
        this.setState({ globalSetValue: this.tempGlobalSetValue });
        this.previousTempGlobalSetValue = this.tempGlobalSetValue;
        this.tempGlobalSetValue = '';
        clearTimeout(this.globalSetTimeout);
        this.globalSetTimeout = null;
        this.handleGlobalSet();
      }
    }
    let key = event.key;
    if (event.keyCode === 13) {
      event.preventDefault();
      applyGlobalSetValue();
      return;
    }
    if(!(key in ['0','1','2','3','4','5','6','7','8','9','.',','])){
      return;
    }
    clearTimeout(this.globalSetTimeout);
    this.tempGlobalSetValue += key;
    this.globalSetTimeout = setTimeout(applyGlobalSetValue, 500);
  }

  handleGlobalSetChange() {
    const value = this.state.globalSetValue;
    const name = this.state.globalSetName;
    let floatValue = parseFloat(value);
    if(isNaN(floatValue)){
      return;
    }
    
    let fibo = closestEstimationValue(floatValue);
    this.setState({ [name]: fibo }, this.handleFormSubmit);

    let names = ['optimistic', 'mostLikely', 'pessimistic'];
    let index = names.indexOf(name)
    this.setState({ globalSetName: names[(index+1)%3] });
    this.setState({ globalSetValue: '' });
  }

  handleInputRadioChange (event) {
    const target = event.currentTarget;
    const value = target.value;
    const name = target.name;

    let floatValue = parseFloat(value);
    if(isNaN(floatValue)){
      this.setState({ [name]: '' });
      return;
    }

    this.setState({ submitted: false, showCheckmark: false });

    this.setState({ [name]: floatValue }, this.handleFormSubmit);
  }

  handleFormSubmit(event) {
    if(this.state.optimistic === '' || this.state.mostLikely === '' || this.state.pessimistic === ''){
      return;
    }

    if(event) { event.preventDefault(); }

    const form = new FormData();
    form.append('user', this.state.user);
    form.append('o', this.state.optimistic);
    form.append('m', this.state.mostLikely);
    form.append('p', this.state.pessimistic);
    fetch("/api/points/submit", {
      method: "POST",
      body: form,
    }).then(() => {
      this.setState({ submitted: true, showCheckmark: true, });
      clearTimeout(this.submitCheckmarkTimeout);
      this.submitCheckmarkTimeout = setTimeout(() => this.setState({ showCheckmark: false }), 3000);
    })
  }

  render() {
    const styleDisplayNone = {display:'none'};
    return (
      <form onSubmit={this.handleSubmit} id="pointsForm">
        <InputEstimate name="optimistic" value={this.state.optimistic} handleChange={this.handleChange} globalSetName={this.state.globalSetName} />
        <InputEstimate name="mostLikely" value={this.state.mostLikely} handleChange={this.handleChange} globalSetName={this.state.globalSetName} />
        <InputEstimate name="pessimistic" value={this.state.pessimistic} handleChange={this.handleChange} globalSetName={this.state.globalSetName} />
        <input id="globalSetKeyup" type="tel" value={this.state.globalSetValue} onChange={this.handleGlobalSet} style={styleDisplayNone} />
        <input id="submitButton" type="submit" style={styleDisplayNone} />
        <span>{`${this.state.optimistic} . ${this.state.mostLikely} . ${this.state.pessimistic}`}</span>
        <span className={this.state.showCheckmark ? "checkmark" : ""} />
      </form>
    );
  }
}

PointEstimateForm.propTypes = { 
  username: PropTypes.string.isRequired,
};

export default PointEstimateForm;


class InputEstimate extends React.Component{
  constructor() {
    super()
    this.inputValues = validEstimation();
    this.state = {showSetCheck: true};
  }

  render() {
    let activeSetName = this.props.globalSetName === this.props.name;
    return (
    <>
      <div className={activeSetName ? "global-set-name" : ''}><div className={activeSetName ? "global-set-check reset" : ''}></div>{this.props.name}</div>
      <div className="radio-toolbar">
        {
          this.inputValues.map((n) => {
            let uniqueIdentifier = `radio${this.props.name}${n.toString()}`;
            let activeValue = this.props.value === n;
            return (
              <label htmlFor={uniqueIdentifier} key={`label${this.props.name}${n.toString()}`} className={activeValue ? "colored-background" : undefined}>{n}
                <input type="radio" id={uniqueIdentifier} key={uniqueIdentifier} name={this.props.name} value={n} onChange={this.props.handleChange} checked={activeValue}/>
              </label>
            );
          })
        }
      </div>
    </>
    );
  }
}

InputEstimate.propTypes = { 
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  globalSetName: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
};
