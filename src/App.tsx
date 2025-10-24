// Initialize core DI container FIRST before any feature code runs
import './core/di/container';

import React from 'react';

// Import the main navigation container
import { AppNavigation } from './navigation';

export default function App() {
  return <AppNavigation />;
}
