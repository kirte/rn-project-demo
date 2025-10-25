/**
 * Notification Settings Screen
 * 
 * Manage notification preferences
 */

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Switch,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { useService } from '../../../core/hooks/useService';
import { NotificationTypes } from '../di/types';
import { NotificationService } from '../services/NotificationService';
import { NotificationSettings } from '../models/NotificationModel';

export const NotificationSettingsScreen: React.FC = () => {
    const notificationService = useService<NotificationService>(NotificationTypes.NotificationService);
    const [settings, setSettings] = useState<NotificationSettings>(
        notificationService.getSettings()
    );

    const updateSetting = (key: keyof NotificationSettings, value: boolean) => {
        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings);
        notificationService.updateSettings({ [key]: value });
    };

    const clearAllNotifications = () => {
        notificationService.clearAll();
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Notification Settings</Text>

                <View style={styles.settingItem}>
                    <View style={styles.settingInfo}>
                        <Text style={styles.settingLabel}>Enable Notifications</Text>
                        <Text style={styles.settingDescription}>
                            Receive all notifications
                        </Text>
                    </View>
                    <Switch
                        value={settings.enabled}
                        onValueChange={(value) => updateSetting('enabled', value)}
                    />
                </View>

                <View style={styles.settingItem}>
                    <View style={styles.settingInfo}>
                        <Text style={styles.settingLabel}>Sound</Text>
                        <Text style={styles.settingDescription}>
                            Play sound for new notifications
                        </Text>
                    </View>
                    <Switch
                        value={settings.soundEnabled}
                        onValueChange={(value) => updateSetting('soundEnabled', value)}
                        disabled={!settings.enabled}
                    />
                </View>

                <View style={styles.settingItem}>
                    <View style={styles.settingInfo}>
                        <Text style={styles.settingLabel}>Vibration</Text>
                        <Text style={styles.settingDescription}>
                            Vibrate for new notifications
                        </Text>
                    </View>
                    <Switch
                        value={settings.vibrationEnabled}
                        onValueChange={(value) => updateSetting('vibrationEnabled', value)}
                        disabled={!settings.enabled}
                    />
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Actions</Text>

                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={clearAllNotifications}
                >
                    <Text style={styles.actionButtonText}>Clear All Notifications</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Statistics</Text>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>
                        {notificationService.getNotifications().length}
                    </Text>
                    <Text style={styles.statLabel}>Total Notifications</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>
                        {notificationService.getUnreadCount()}
                    </Text>
                    <Text style={styles.statLabel}>Unread Notifications</Text>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    section: {
        backgroundColor: '#fff',
        marginBottom: 16,
        padding: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    settingInfo: {
        flex: 1,
        marginRight: 16,
    },
    settingLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
        color: '#333',
    },
    settingDescription: {
        fontSize: 14,
        color: '#666',
    },
    actionButton: {
        backgroundColor: '#f44336',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    statCard: {
        backgroundColor: '#f5f5f5',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 12,
    },
    statValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#007AFF',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 14,
        color: '#666',
    },
});

