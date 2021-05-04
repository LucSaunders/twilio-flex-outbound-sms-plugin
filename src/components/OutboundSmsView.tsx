import React from "react"
import * as Flex from "@twilio/flex-ui"
import styled from "react-emotion"
import TextField from "@material-ui/core/TextField"
import Button from "@material-ui/core/Button"
const url = process.env.FLEX_OUTBOUND_SERVICE_BASE_URL

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
    To: "",
    From: "",
    Message: "",
  }

  // Validate phone number is all digits
  async isNumeric(str: string) {
    try {
      // Accept only entered phone numbers of minimum length 10 digits
      if (typeof str != "string" || str.length < 10) return false
      // Scrub "+" from number if present, before confirming it's a number
      if (str.charAt(0) === "+") {
        console.log("Removing '+' from number")
        let sanitizedNumber = str.substring(1)
        console.log(sanitizedNumber)
        const validity = !isNaN(parseInt(sanitizedNumber))
        console.log(`number validation is ${validity}`)
        return validity
      } else {
        return !isNaN(parseInt(str))
      }
    } catch (error) {
      console.log(error)
    }
  }

  // TODO: Verify via testing
  // Ensure E.164 Format and encoding for phone number
  // async formatNumber(number: string) {
  //   try {
  //     if (number.length === 10) {
  //       console.log("Adding +1 to number")
  //       // return `+1${number}`
  //       number = `+1${number}`
  //     }
  //     if (number.charAt(0) !== "+") {
  //       console.log("Adding + to number")
  //       // return `+${number}`
  //       number = `+${number}`
  //     }
  //     return encodeURIComponent(number)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  async startSMS() {
    const to = encodeURIComponent(this.state.To)
    const from = encodeURIComponent(this.state.From)
    const message = encodeURIComponent(this.state.Message)
    try {
      if (
        this.state.To.length > 9 &&
        this.isNumeric(this.state.To) &&
        this.state.From.length > 9 &&
        this.isNumeric(this.state.From)
      ) {
        // if (this.isNumeric(this.state.To) && this.isNumeric(this.state.From)) {
        // if ((this.state.To.length == 12) && (this.state.From.length == 12)) {

        // const to = this.formatNumber(this.state.To)
        // const from = this.formatNumber(this.state.To)
        // const message = encodeURIComponent(this.state.Message)

        await fetch(`${url}/send-sms`, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          method: "POST",
          body: `from=${from}&to=${to}&message=${message}`,
        })
        Flex.Actions.invokeAction("NavigateToView", {
          viewName: "agent-desktop",
        })
      } else {
        console.log("number format validation didn't pass, and")
        throw new Error()
      }
    } catch (error) {
      // TODO: trigger notification bar that sms didn't go through/not valid phone number
      // Flex.NotificationBar.arguments(error)
      console.log(error)
    }
  }

  handleChange = (name: any) => (event: any) => {
    this.setState({
      [name]: event.target.value,
    })
  }

  render() {
    return (
      <SmsCanvas>
        <div>
          <SmsInput>
            <TextField
              id="To"
              label="To"
              value={this.state.To}
              onChange={this.handleChange("To")}
              margin="normal"
              variant="outlined"
            />
          </SmsInput>
          <SmsInput>
            <TextField
              id="From"
              label="From"
              value={this.state.From}
              onChange={this.handleChange("From")}
              margin="normal"
              variant="outlined"
            />
          </SmsInput>
          <SmsInput>
            <TextField
              id="Message"
              label="Message"
              multiline
              rows="4"
              value={this.state.Message}
              onChange={this.handleChange("Message")}
              margin="normal"
              variant="outlined"
            />
          </SmsInput>
        </div>
        <Button
          variant="contained"
          color="primary"
          onClick={(e) => this.startSMS()}
        >
          Submit
        </Button>
      </SmsCanvas>
    )
  }
}

export default OutboundSmsView
