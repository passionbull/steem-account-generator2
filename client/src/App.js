import React, { Component } from 'react'
import './App.css'

class App extends Component {
  state = {
    cow: '',
    text: '',
    pw:''
  }

  componentDidMount() {
    this.fetchCow()
  }

  fetchCow = async () => {
    const response = await fetch(`/api/cow`)
    const initialCow = await response.json()
    const cow = initialCow.moo
    console.log(cow);
    this.setState({ cow })
  }

  customCow = async evt => {
    evt.preventDefault()
    const text = this.state.text
    const pw = this.state.pw
    if(pw == '' || text == ''){
      const cow = `Fill both ID and password.`
      this.setState({ cow, text: '', pw: ''})
      return;
    }
    console.log(text,pw);
    const response = await fetch(`/signin?id=${text}&pw=${pw}`)
    const custom = await response.json()
    console.log(custom);
    if(custom.account.success){
      const cow = `ID: ${custom.account.name}\nPW: ${custom.account.pw}\n`
      this.setState({ cow, text: '', pw: ''})
    }
    else {
      const cow = `Fail to create account\nInfo: ${custom.account.info}`
      this.setState({ cow, text: '', pw: ''})
    }
  }

  handleChange = evt => {
    this.setState({ [evt.target.name]: evt.target.value })
  }

  render() {
    return (
      <div className="App">
        <h3>Steem account creator</h3>
        <code>{this.state.cow}</code>
        <form onSubmit={this.customCow}>
          <label>ID:</label>
          <input
            type="text"
            name="text"
            value={this.state.text}
            onChange={this.handleChange}
          />
          <label>Password:</label>
          <input
            type="text"
            name="pw"
            value={this.state.pw}
            onChange={this.handleChange}
          />
          <button type="submit">Create an account</button>
        </form>
      </div>
    )
  }
}

export default App
