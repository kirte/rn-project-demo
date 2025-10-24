/**
 * @format
 */

// CRITICAL: Import reflect-metadata FIRST before anything else
// This is required for InversifyJS decorators to work properly
import 'reflect-metadata';

import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
