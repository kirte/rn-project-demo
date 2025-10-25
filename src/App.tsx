/**
 * App Entry Point
 * 
 * 1. Initialize core DI container first
 * 2. Import all features to trigger self-registration
 * 3. Render main app navigation
 */

// STEP 1: Initialize core DI container FIRST
import './core/di/container';

// STEP 2: Import all features to trigger self-registration
// These imports just register metadata in the feature registry
// Features are NOT loaded yet (lazy loading) - they load when first accessed
import './features/auth';
import './features/user';
import './features/admin';
import './features/chat';

// Log registered features
import { getRegisteredFeatures } from './core/di/featureManager';
console.log('[App] Registered features:', getRegisteredFeatures());

import React from 'react';
import { AppNavigation } from './navigation';

export default function App() {
  return <AppNavigation />;
}
