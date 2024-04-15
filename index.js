/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import App from './navigation/app'
import {MainScreen} from './screens';
AppRegistry.registerComponent(appName, () => () => <App />);
