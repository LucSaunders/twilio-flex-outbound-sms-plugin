import * as React from "react"
import { SideLink, Actions } from "@twilio/flex-ui"

export default class OutboundSmsButton extends SideLink {
  render() {
    return (
      <SideLink
        {...this.props}
        icon="Message"
        iconActive="MessageBold"
        isActive={this.props.activeView === "sms"}
        onClick={() =>
          Actions.invokeAction("NavigateToView", { viewName: "sms" })
        }
      >
        SMS
      </SideLink>
    )
  }
}
