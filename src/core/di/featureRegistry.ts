/**
 * Feature Registry
 * 
 * Central registry where features self-register with metadata.
 * No hardcoded feature names in core - fully dynamic!
 * 
 * Features register themselves by calling featureRegistry.register() in their index.ts
 */

import { Container } from 'inversify';

/**
 * Feature metadata describing how to load a feature
 */
export interface FeatureMetadata {
    name: string;
    description?: string;
    loader: () => Promise<FeatureModule>;
    dependencies?: string[]; // Other features this depends on
    version?: string;
    tags?: string[]; // e.g., ['core', 'admin-only', 'experimental']
}

/**
 * Feature module interface - what each feature module must export
 */
export interface FeatureModule {
    name: string;
    register: (container: Container) => void;
}

/**
 * Feature registry - stores all registered features
 * Features self-register during module initialization
 */
class FeatureRegistry {
    private features = new Map<string, FeatureMetadata>();

    /**
     * Register a feature with its metadata
     * Called by each feature's index.ts during module initialization
     * 
     * @example
     * featureRegistry.register({
     *   name: 'user',
     *   description: 'User profile management',
     *   version: '1.0.0',
     *   loader: async () => import('./di/user.module'),
     *   dependencies: ['auth'],
     * });
     */
    register(metadata: FeatureMetadata): void {
        if (this.features.has(metadata.name)) {
            console.warn(
                `[FeatureRegistry] Feature "${metadata.name}" already registered, skipping. ` +
                `This usually means the feature was imported multiple times.`
            );
            return;
        }

        this.features.set(metadata.name, metadata);
        console.log(
            `[FeatureRegistry] 📝 Registered feature: ${metadata.name}` +
            (metadata.description ? ` - ${metadata.description}` : '')
        );
    }

    /**
     * Get feature metadata by name
     */
    get(name: string): FeatureMetadata | undefined {
        return this.features.get(name);
    }

    /**
     * Check if feature is registered in the registry
     */
    has(name: string): boolean {
        return this.features.has(name);
    }

    /**
     * Get all registered feature names
     */
    getAll(): string[] {
        return Array.from(this.features.keys());
    }

    /**
     * Get all feature metadata
     */
    getAllMetadata(): FeatureMetadata[] {
        return Array.from(this.features.values());
    }

    /**
     * Get features by tag
     * 
     * @example
     * const coreFeatures = featureRegistry.getByTag('core');
     */
    getByTag(tag: string): FeatureMetadata[] {
        return Array.from(this.features.values())
            .filter(f => f.tags?.includes(tag));
    }

    /**
     * Clear registry (for testing)
     */
    clear(): void {
        this.features.clear();
        console.log('[FeatureRegistry] Registry cleared');
    }

    /**
     * Get registry statistics
     */
    getStats() {
        return {
            total: this.features.size,
            features: this.getAll(),
        };
    }
}

// Singleton instance
export const featureRegistry = new FeatureRegistry();

