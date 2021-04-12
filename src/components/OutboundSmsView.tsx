import React from 'react';
import { Actions } from '@twilio/flex-ui';
import styled from "react-emotion"
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const url = process.env.FLEX_OUTBOUND_SERVICE_BASE_URL;
// const url: string = `https://flex-outbound-4316-dev.twil.io`;

const SmsCanvas = styled("div")`
  width: 300px;
  margin-left: 50px;
`

const SmsInput = styled("div")`
  width: 100%;
  textarea {
    padding: 6px 12px 7px 12px !important;
  }
`

export class OutboundSmsView extends React.Component {

  state = {
    To: '',
    From: '',
    Message: ''
  }

  async startSMS() {
    const to = encodeURIComponent(this.state.To);
    const from = encodeURIComponent(this.state.From);
    const message = encodeURIComponent(this.state.Message);

    if (to.length > 0 && from.length > 0) {
      fetch(`${url}/send-sms`, {   
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        body: `from=${from}&to=${to}&message=${message}`
      })
      .then(await Actions.invokeAction('NavigateToView', { viewName: 'agent-desktop' }));
    } else {
      console.log('Invalid number entered');
    }
  }

  handleChange = (name: any) => (event: any) => {
    this.setState({
      [name]: event.target.value,
    });
  };

  render() {
    return (
      <SmsCanvas>
        <div>
          <SmsInput>
            <TextField
              id='To'
              label='To'
              value={this.state.To}
              onChange={this.handleChange('To')}
              margin='normal'
              variant='outlined'
            />
          </SmsInput>
          <SmsInput>
            <TextField
              id='From'
              label='From'
              value={this.state.From}
              onChange={this.handleChange('From')}
              margin='normal'
              variant='outlined'
            />
          </SmsInput>
          <SmsInput>
            <TextField
              id='Message'
              label='Message'
              multiline
              rows='4'
              value={this.state.Message}
              onChange={this.handleChange('Message')}
              margin='normal'
              variant='outlined'
            />
          </SmsInput>
        </div>
        <Button variant='contained' color='primary' onClick={e => this.startSMS()}>Submit</Button>
      </SmsCanvas>
    )
  }
}

export default OutboundSmsView;
