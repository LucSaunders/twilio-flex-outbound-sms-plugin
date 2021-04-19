import React from 'react';
import * as Flex from '@twilio/flex-ui';
import { FlexPlugin } from 'flex-plugin';
import reducers, { namespace } from './states';
import { OutboundSmsView } from './components/OutboundSmsView';
const url = process.env.FLEX_OUTBOUND_SERVICE_BASE_URL;
const outboundSmsWorkflowSid = process.env.OUTBOUND_SMS_WORKFLOW_SID;
const outbound_sms_permissions = process.env.OUTBOUND_SMS_PERMISSIONS;
const PLUGIN_NAME = 'OutboundSmsPlugin';

export default class OutboundSmsPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof Flex }
   * @param manager { Flex.Manager }
   */
   init(flex: typeof Flex, manager: Flex.Manager) {
    this.registerReducers(manager);
    const skills = manager.store.getState().flex.worker.attributes.routing.skills;

    flex.SideNav.Content.add(
      <Flex.SideLink 
        showLabel={true}
        icon="Message"
        isActive={true}
        onClick={() => {flex.Actions.invokeAction("HistoryPush", "/outbound-sms-page")}}
        key="OutboundSMSPageLink"
        >Outbound SMS</Flex.SideLink>, {
          if: () => 
            skills.includes(outbound_sms_permissions) 
        }
    )

    flex.ViewCollection.Content.add(
      <Flex.View name="outbound-sms-page" key="outbound-sms-page-key">
        <OutboundSmsView></OutboundSmsView>        
      </Flex.View>, {
          if: () => 
            skills.includes(outbound_sms_permissions) 
        }
    )

    flex.Actions.addListener("afterWrapupTask", (payload) => {
      // Only alter chat tasks:
      console.log("WRAP-UP TASK")
      console.log(payload.task)
      if (payload.task.workflowSid === outboundSmsWorkflowSid && (payload.task.taskChannelUniqueName === "chat" || payload.task.taskChannelUniqueName === "sms")) {
        return fetch(`${url}/close-proxy-session`, {   
                    headers: {
                      'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    method: 'POST',
                    body: `chatChannelSid=${payload.task.attributes.channelSid}`
                  })
        }
      })
    }

  /**
   * Registers the plugin reducers
   *
   * @param manager { Flex.Manager }
   */
  private registerReducers(manager: Flex.Manager) {
    if (!manager.store.addReducer) {
      // tslint: disable-next-line
      console.error(`You need FlexUI > 1.9.0 to use built-in redux; you are currently on ${Flex.VERSION}`);
      return;
    }

    manager.store.addReducer(namespace, reducers);
  }
}
