import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useService } from '../../../core/hooks/useService';
import { AuthService } from '../../../core/auth/AuthService';
import { CoreTypes } from '../../../core/di/types';
import { useLoginViewModel } from '../viewmodels/LoginViewModel';

export const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const authService = useService<AuthService>(CoreTypes.AuthService);

  const viewModel = useLoginViewModel(authService, {
    onLoginSuccess: () => {
      navigation.replace('MainTabs');
    },
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              value={viewModel.username}
              onChangeText={viewModel.setUsername}
              style={styles.input}
              placeholder="Enter your username"
              placeholderTextColor="#999"
              autoCapitalize="none"
              editable={!viewModel.isLoading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              value={viewModel.password}
              onChangeText={viewModel.setPassword}
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#999"
              secureTextEntry
              editable={!viewModel.isLoading}
            />
          </View>

          {viewModel.error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{viewModel.error}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={[styles.button, viewModel.isLoading && styles.buttonDisabled]}
            onPress={viewModel.handleLogin}
            disabled={viewModel.isLoading}
          >
            {viewModel.isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.hint}>
            Hint: Use any username/password to login (demo mode)
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  errorContainer: {
    backgroundColor: '#ffe6e6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#99c2ff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  hint: {
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
    marginTop: 16,
  },
});
