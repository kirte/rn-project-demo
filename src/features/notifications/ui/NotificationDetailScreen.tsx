/**
 * Notification Detail Screen
 * 
 * Shows detailed view of a single notification
 */

import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useService } from '../../../core/hooks/useService';
import { NotificationTypes } from '../di/types';
import { NotificationService } from '../services/NotificationService';
import { Notification } from '../models/NotificationModel';
import { NotificationStackParamList } from '../navigation/navigation';

type NotificationDetailRouteProp = RouteProp<NotificationStackParamList, 'NotificationDetail'>;

export const NotificationDetailScreen: React.FC = () => {
    const route = useRoute<NotificationDetailRouteProp>();
    const navigation = useNavigation();
    const notificationService = useService<NotificationService>(NotificationTypes.NotificationService);

    const [notification, setNotification] = useState<Notification | null>(null);

    useEffect(() => {
        const { notificationId } = route.params;
        const found = notificationService.getNotifications().find(n => n.id === notificationId);

        if (found) {
            setNotification(found);
            // Mark as read when viewing
            if (!found.read) {
                notificationService.markAsRead(notificationId);
            }
        }
    }, [route.params.notificationId]);

    const handleDelete = () => {
        if (notification) {
            notificationService.deleteNotification(notification.id);
            navigation.goBack();
        }
    };

    if (!notification) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Notification not found</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={[styles.typeBadge, styles[`typeBadge_${notification.type}`]]}>
                    <Text style={styles.typeBadgeText}>{notification.type.toUpperCase()}</Text>
                </View>
            </View>

            <Text style={styles.title}>{notification.title}</Text>

            <Text style={styles.timestamp}>
                {notification.timestamp.toLocaleString()}
            </Text>

            <View style={styles.divider} />

            <Text style={styles.message}>{notification.message}</Text>

            {notification.metadata && Object.keys(notification.metadata).length > 0 && (
                <>
                    <View style={styles.divider} />
                    <Text style={styles.metadataTitle}>Additional Information</Text>
                    {Object.entries(notification.metadata).map(([key, value]) => (
                        <View key={key} style={styles.metadataItem}>
                            <Text style={styles.metadataKey}>{key}:</Text>
                            <Text style={styles.metadataValue}>{JSON.stringify(value)}</Text>
                        </View>
                    ))}
                </>
            )}

            <View style={styles.divider} />

            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                <Text style={styles.deleteButtonText}>Delete Notification</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 16,
    },
    header: {
        marginBottom: 16,
    },
    typeBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    typeBadge_info: {
        backgroundColor: '#2196F3',
    },
    typeBadge_success: {
        backgroundColor: '#4CAF50',
    },
    typeBadge_warning: {
        backgroundColor: '#FF9800',
    },
    typeBadge_error: {
        backgroundColor: '#f44336',
    },
    typeBadge_chat: {
        backgroundColor: '#9C27B0',
    },
    typeBadge_user: {
        backgroundColor: '#00BCD4',
    },
    typeBadge_system: {
        backgroundColor: '#607D8B',
    },
    typeBadgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    timestamp: {
        fontSize: 14,
        color: '#999',
        marginBottom: 16,
    },
    divider: {
        height: 1,
        backgroundColor: '#e0e0e0',
        marginVertical: 16,
    },
    message: {
        fontSize: 16,
        lineHeight: 24,
        color: '#666',
    },
    metadataTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
        color: '#333',
    },
    metadataItem: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    metadataKey: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        marginRight: 8,
    },
    metadataValue: {
        fontSize: 14,
        color: '#333',
        flex: 1,
    },
    deleteButton: {
        backgroundColor: '#f44336',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    errorText: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
        marginTop: 32,
    },
});

