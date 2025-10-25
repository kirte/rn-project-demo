/**
 * Feature Manager - Dynamic Version
 * 
 * No hardcoded feature names! Features self-register in the registry.
 * This manager dynamically loads any registered feature.
 * 
 * Benefits:
 * - Add new features without modifying core code
 * - Features are singleton-safe (load once)
 * - Automatic dependency loading
 * - Race condition safe
 * 
 * Usage:
 *   await ensureFeatureLoaded('user');
 *   await ensureFeatureLoaded('anyNewFeature'); // Works automatically!
 */

import { container } from './container';
import { featureRegistry, FeatureMetadata } from './featureRegistry';

// Track loaded features to prevent duplicate registration
const loadedFeatures = new Set<string>();

// Track features currently being loaded to prevent race conditions
const loadingFeatures = new Map<string, Promise<void>>();

/**
 * Ensures a feature is loaded and its DI bindings are registered.
 * Works with ANY registered feature - no hardcoding needed!
 * Safe to call multiple times - will only load once.
 * 
 * @param featureName - Name of the feature to load
 * @returns Promise that resolves when feature is loaded
 * 
 * @example
 * // Load existing feature
 * await ensureFeatureLoaded('user');
 * 
 * // Load any new feature (no core changes needed!)
 * await ensureFeatureLoaded('notifications');
 * await ensureFeatureLoaded('billing');
 */
export async function ensureFeatureLoaded(featureName: string): Promise<void> {
    // Already loaded - return immediately
    if (loadedFeatures.has(featureName)) {
        return;
    }

    // Currently being loaded - wait for existing promise
    if (loadingFeatures.has(featureName)) {
        return loadingFeatures.get(featureName)!;
    }

    // Start loading
    const loadPromise = loadFeature(featureName);
    loadingFeatures.set(featureName, loadPromise);

    try {
        await loadPromise;
        loadedFeatures.add(featureName);
        console.log(`[FeatureManager] ✅ Feature loaded: ${featureName}`);
    } catch (error) {
        console.error(`[FeatureManager] ❌ Failed to load feature: ${featureName}`, error);
        throw error;
    } finally {
        loadingFeatures.delete(featureName);
    }
}

/**
 * Internal function to dynamically load and register a feature
 * Uses feature registry - NO switch/case needed!
 */
async function loadFeature(featureName: string): Promise<void> {
    // Get feature metadata from registry
    const metadata = featureRegistry.get(featureName);

    if (!metadata) {
        const available = featureRegistry.getAll();
        throw new Error(
            `[FeatureManager] Feature "${featureName}" not found in registry.\n` +
            `Available features: ${available.length > 0 ? available.join(', ') : 'none'}\n` +
            `Did you forget to import the feature in App.tsx?`
        );
    }

    // Load dependencies first (if any)
    if (metadata.dependencies && metadata.dependencies.length > 0) {
        console.log(
            `[FeatureManager] 🔗 Loading dependencies for ${featureName}:`,
            metadata.dependencies
        );

        // Load all dependencies in parallel
        await Promise.all(metadata.dependencies.map(ensureFeatureLoaded));
    }

    // Dynamically import the feature module using the loader
    console.log(`[FeatureManager] 📦 Importing module: ${featureName}`);
    const featureModule = await metadata.loader();

    // Verify the module has the correct structure
    if (!featureModule.register || typeof featureModule.register !== 'function') {
        throw new Error(
            `[FeatureManager] Feature "${featureName}" module is invalid. ` +
            `It must export an object with a 'register' function.`
        );
    }

    // Register with DI container
    console.log(`[FeatureManager] 🔧 Registering DI bindings: ${featureName}`);
    featureModule.register(container);
}

/**
 * Check if a feature is currently loaded
 * 
 * @example
 * if (isFeatureLoaded('user')) {
 *   // User feature is available
 * }
 */
export function isFeatureLoaded(featureName: string): boolean {
    return loadedFeatures.has(featureName);
}

/**
 * Preload multiple features in parallel
 * Useful for eager loading critical features (e.g., after login)
 * 
 * @param featureNames - Array of feature names to preload
 * 
 * @example
 * // Preload all main features after login
 * await preloadFeatures(['user', 'admin', 'chat']);
 */
export async function preloadFeatures(featureNames: string[]): Promise<void> {
    await Promise.all(featureNames.map(ensureFeatureLoaded));
    console.log(
        `[FeatureManager] ✅ Preloaded ${featureNames.length} features: ${featureNames.join(', ')}`
    );
}

/**
 * Get list of all loaded features
 * Useful for debugging and monitoring
 */
export function getLoadedFeatures(): string[] {
    return Array.from(loadedFeatures);
}

/**
 * Get list of all registered features (loaded or not)
 * Shows what features are available in the app
 */
export function getRegisteredFeatures(): string[] {
    return featureRegistry.getAll();
}

/**
 * Get feature metadata
 * Useful for inspecting feature information
 */
export function getFeatureMetadata(featureName: string): FeatureMetadata | undefined {
    return featureRegistry.get(featureName);
}

/**
 * Get loading statistics
 * Shows which features are loaded vs registered
 */
export function getFeatureStats() {
    const registered = getRegisteredFeatures();
    const loaded = getLoadedFeatures();

    return {
        registered: registered.length,
        loaded: loaded.length,
        notLoaded: registered.filter(f => !loaded.includes(f)),
        registeredList: registered,
        loadedList: loaded,
    };
}

/**
 * Reset feature manager (useful for testing)
 * Clears all loaded feature tracking
 */
export function resetFeatureManager(): void {
    loadedFeatures.clear();
    loadingFeatures.clear();
    console.log('[FeatureManager] Reset complete');
}
