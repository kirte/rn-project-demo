import React, { useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { useChatViewModel } from '../viewmodels/ChatViewModel';

export const ChatScreen: React.FC = () => {
    const viewModel = useChatViewModel();
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        // Scroll to bottom when messages change
        if (viewModel.messages.length > 0) {
            flatListRef.current?.scrollToEnd({ animated: true });
        }
    }, [viewModel.messages]);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
            keyboardVerticalOffset={90}
        >
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Chat Support</Text>
                <View style={styles.statusBadge}>
                    <View style={styles.statusDot} />
                    <Text style={styles.statusText}>Online</Text>
                </View>
            </View>

            <FlatList
                ref={flatListRef}
                data={viewModel.messages}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View
                        style={[
                            styles.messageContainer,
                            item.sender === 'user' ? styles.userMessageContainer : styles.botMessageContainer,
                        ]}
                    >
                        <View
                            style={[
                                styles.messageBubble,
                                item.sender === 'user' ? styles.userMessage : styles.botMessage,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.messageText,
                                    item.sender === 'user' ? styles.userMessageText : styles.botMessageText,
                                ]}
                            >
                                {item.text}
                            </Text>
                            <Text
                                style={[
                                    styles.messageTime,
                                    item.sender === 'user' ? styles.userMessageTime : styles.botMessageTime,
                                ]}
                            >
                                {item.timestamp.toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </Text>
                        </View>
                    </View>
                )}
                contentContainerStyle={styles.messagesList}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={viewModel.inputText}
                    onChangeText={viewModel.setInputText}
                    placeholder="Type a message..."
                    placeholderTextColor="#999"
                    multiline
                    maxLength={500}
                    editable={!viewModel.isLoading}
                />
                <TouchableOpacity
                    style={[styles.sendButton, !viewModel.inputText.trim() && styles.sendButtonDisabled]}
                    onPress={viewModel.sendMessage}
                    disabled={!viewModel.inputText.trim() || viewModel.isLoading}
                >
                    <Text style={styles.sendButtonText}>➤</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
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
        borderBottomColor: '#eee',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e3f2fd',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#4caf50',
        marginRight: 6,
    },
    statusText: {
        fontSize: 12,
        color: '#333',
        fontWeight: '600',
    },
    messagesList: {
        padding: 16,
    },
    messageContainer: {
        marginBottom: 12,
    },
    userMessageContainer: {
        alignItems: 'flex-end',
    },
    botMessageContainer: {
        alignItems: 'flex-start',
    },
    messageBubble: {
        maxWidth: '75%',
        padding: 12,
        borderRadius: 16,
    },
    userMessage: {
        backgroundColor: '#007AFF',
        borderBottomRightRadius: 4,
    },
    botMessage: {
        backgroundColor: '#fff',
        borderBottomLeftRadius: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    messageText: {
        fontSize: 16,
        lineHeight: 22,
    },
    userMessageText: {
        color: '#fff',
    },
    botMessageText: {
        color: '#333',
    },
    messageTime: {
        fontSize: 11,
        marginTop: 4,
    },
    userMessageTime: {
        color: '#fff',
        opacity: 0.8,
        textAlign: 'right',
    },
    botMessageTime: {
        color: '#999',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 12,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 16,
        maxHeight: 100,
        marginRight: 8,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: '#ccc',
    },
    sendButtonText: {
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold',
    },
});

