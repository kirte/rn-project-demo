/**
 * Notification Screen
 * 
 * Displays list of notifications with navigation support
 */

import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useService } from '../../../core/hooks/useService';
import { NotificationTypes } from '../di/types';
import { NotificationService } from '../services/NotificationService';
import { Notification, NotificationType } from '../models/NotificationModel';
import { NotificationStackParamList } from '../navigation/navigation';

type NotificationScreenNavigationProp = NativeStackNavigationProp<
    NotificationStackParamList,
    'NotificationList'
>;

export const NotificationScreen: React.FC = () => {
    const navigation = useNavigation<NotificationScreenNavigationProp>();
    const notificationService = useService<NotificationService>(NotificationTypes.NotificationService);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        // Add some sample notifications on first load
        const existing = notificationService.getNotifications();
        if (existing.length === 0) {
            notificationService.addNotification(
                'Welcome!',
                'Welcome to the notifications feature',
                NotificationType.INFO
            );
            notificationService.addNotification(
                'New Message',
                'You have a new message from Admin',
                NotificationType.CHAT
            );
            notificationService.addNotification(
                'System Update',
                'Your app has been updated to the latest version',
                NotificationType.SYSTEM
            );
        }

        loadNotifications();
    }, []);

    const loadNotifications = () => {
        setNotifications(notificationService.getNotifications());
    };

    const handleNotificationPress = (notification: Notification) => {
        navigation.navigate('NotificationDetail', { notificationId: notification.id });
        loadNotifications(); // Refresh to show read status
    };

    const handleClearAll = () => {
        notificationService.clearAll();
        loadNotifications();
    };

    const handleSettings = () => {
        navigation.navigate('NotificationSettings');
    };

    const getTypeColor = (type: NotificationType): string => {
        switch (type) {
            case NotificationType.SUCCESS: return '#4CAF50';
            case NotificationType.WARNING: return '#FF9800';
            case NotificationType.ERROR: return '#f44336';
            case NotificationType.CHAT: return '#9C27B0';
            case NotificationType.USER: return '#00BCD4';
            case NotificationType.SYSTEM: return '#607D8B';
            default: return '#2196F3';
        }
    };

    const renderNotification = ({ item }: { item: Notification }) => (
        <TouchableOpacity
            style={[styles.notificationItem, item.read && styles.notificationRead]}
            onPress={() => handleNotificationPress(item)}
        >
            <View style={[styles.typeIndicator, { backgroundColor: getTypeColor(item.type) }]} />
            <View style={styles.notificationContent}>
                <View style={styles.notificationHeader}>
                    <Text style={styles.notificationTitle}>{item.title}</Text>
                    {!item.read && <View style={styles.unreadIndicator} />}
                </View>
                <Text style={styles.notificationMessage} numberOfLines={2}>
                    {item.message}
                </Text>
                <View style={styles.notificationFooter}>
                    <Text style={styles.notificationType}>{item.type.toUpperCase()}</Text>
                    <Text style={styles.notificationTime}>
                        {item.timestamp.toLocaleTimeString()}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Notifications</Text>
                <View style={styles.headerButtons}>
                    <TouchableOpacity onPress={handleSettings} style={styles.settingsButton}>
                        <Text style={styles.settingsButtonText}>⚙️</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleClearAll} style={styles.clearButton}>
                        <Text style={styles.clearButtonText}>Clear All</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.statBox}>
                    <Text style={styles.statValue}>{notifications.length}</Text>
                    <Text style={styles.statLabel}>Total</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={[styles.statValue, styles.unreadValue]}>
                        {notificationService.getUnreadCount()}
                    </Text>
                    <Text style={styles.statLabel}>Unread</Text>
                </View>
            </View>

            <FlatList
                data={notifications}
                renderItem={renderNotification}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyEmoji}>📭</Text>
                        <Text style={styles.emptyText}>No notifications</Text>
                    </View>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    headerButtons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingsButton: {
        padding: 8,
        marginRight: 8,
    },
    settingsButtonText: {
        fontSize: 20,
    },
    clearButton: {
        padding: 8,
    },
    clearButtonText: {
        color: '#007AFF',
        fontWeight: '600',
    },
    statsContainer: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    statBox: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
    },
    unreadValue: {
        color: '#007AFF',
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    list: {
        padding: 16,
    },
    notificationItem: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    notificationRead: {
        opacity: 0.6,
    },
    typeIndicator: {
        width: 4,
    },
    notificationContent: {
        flex: 1,
        padding: 16,
    },
    notificationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    notificationTitle: {
        fontSize: 16,
        fontWeight: '600',
        flex: 1,
        color: '#333',
    },
    unreadIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#007AFF',
        marginLeft: 8,
    },
    notificationMessage: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
        lineHeight: 20,
    },
    notificationFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    notificationType: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#999',
        letterSpacing: 0.5,
    },
    notificationTime: {
        fontSize: 12,
        color: '#999',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 64,
    },
    emptyEmoji: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyText: {
        textAlign: 'center',
        color: '#999',
        fontSize: 16,
    },
});

