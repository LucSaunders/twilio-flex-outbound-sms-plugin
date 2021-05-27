import React from "react";
import * as Flex from "@twilio/flex-ui";
import styled from "react-emotion";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { NotificationType, NotificationBar } from "@twilio/flex-ui";
const URL = process.env.FLEX_APP_OUTBOUND_SERVICE_BASE_URL;

const SmsCanvas = styled("div")`
	width: 300px;
	margin-left: 50px;
`;

const SmsInput = styled("div")`
	width: 100%;
	textarea {
		padding: 6px 12px 7px 12px !important;
	}
`;

export class OutboundSmsView extends React.Component {
	state = {
		To: "",
		From: "",
		Message: "",
	};

	componentDidMount() {
		Flex.Notifications.registerNotification({
			id: "phoneNumberErrorMessage",
			closeButton: true,
			content: "Error! Phone numbers need to be a 10 digit US number. (e.g. 555-555-5555)",
			timeout: 0,
			type: NotificationType.error,
			actions: [
				<NotificationBar.Action
					onClick={(_, notification) => {
						Flex.Notifications.dismissNotification(notification);
					}}
					label=""
					icon="Error"
				/>,
			],
			options: {
				browser: {
					title: "Error! Phone numbers need to be a 10 digit US number. (e.g. 555-555-5555)",
					body: "",
				},
			},
		});
	}

	componentWillUnmount() {
		Flex.Notifications.registeredNotifications.delete("phoneNumberErrorMessage");
	}

	async sendSMS() {
		let to = this.state.To.replaceAll(/[^A-Za-z0-9]/g, "");
		let from = this.state.From.replaceAll(/[^A-Za-z0-9]/g, "");
		let message = encodeURIComponent(this.state.Message);

		if (
			!this.isTenDigitNumber(to) ||
			!this.isTenDigitNumber(from) ||
			typeof to !== "string" ||
			typeof from !== "string"
		) {
			return Flex.Notifications.showNotification("phoneNumberErrorMessage");
		}

		try {
			to = encodeURIComponent(`+1${to}`);
			from = encodeURIComponent(`+1${from}`);

			return this.sendRequestSMSAndGoToAgentView(from, to, message);
		} catch (error) {
			console.log(error);
			throw new Error();
		}
	}

	isTenDigitNumber(num: string) {
		const tenDigitNumber = /^[0-9]{10}$/g;

		const nonDigits = /\D/;

		if (num.match(nonDigits)) return false;

		if (num.match(tenDigitNumber)) return true;

		return false;
	}

	async sendRequestSMSAndGoToAgentView(from: string, to: string, message: string) {
		await fetch(`${URL}/send-sms`, {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			method: "POST",
			body: `from=${from}&to=${to}&message=${message}`,
		});

		Flex.Actions.invokeAction("NavigateToView", {
			viewName: "agent-desktop",
		});
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
				<Button variant="contained" color="primary" onClick={(e) => this.sendSMS()}>
					Submit
				</Button>
			</SmsCanvas>
		);
	}
}

export default OutboundSmsView;
