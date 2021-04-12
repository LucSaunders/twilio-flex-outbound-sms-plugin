import { AppState as FlexAppState } from '@twilio/flex-ui';
import { combineReducers, Action as ReduxAction } from 'redux';

// Register your redux store under a unique namespace
export const namespace = 'outbound-sms';

// Extend this payload to be of type that your ReduxAction is
export interface Action extends ReduxAction {
  payload?: any;
}

// Register all component states under the namespace
export interface AppState {
  flex: FlexAppState;
  'outbound-sms': {
    // Other states
  };
}

// Combine the reducers
export default combineReducers({
});
