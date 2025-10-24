import React from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useService } from '../../../core/hooks/useService';
import { UserRepository } from '../repositories/UserRepository';
import { UserTypes } from '../di/types';
import { useUserViewModel } from '../viewmodels/UserViewModel';

export const UserScreen: React.FC = () => {
  const userRepo = useService<UserRepository>(UserTypes.UserRepository);
  const viewModel = useUserViewModel(userRepo);

  if (viewModel.isLoading && !viewModel.user) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (viewModel.error && !viewModel.user) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorText}>{viewModel.error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={viewModel.refresh}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={viewModel.isLoading} onRefresh={viewModel.refresh} />
      }
    >
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {viewModel.user?.name?.charAt(0).toUpperCase() || 'U'}
          </Text>
        </View>
        <Text style={styles.name}>{viewModel.user?.name || 'Unknown'}</Text>
        <Text style={styles.username}>@{viewModel.user?.username || 'user'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>📧 Email</Text>
            <Text style={styles.infoValue}>{viewModel.user?.email || 'N/A'}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>📞 Phone</Text>
            <Text style={styles.infoValue}>{viewModel.user?.phone || 'N/A'}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>🌐 Website</Text>
            <Text style={styles.infoValue}>{viewModel.user?.website || 'N/A'}</Text>
          </View>
        </View>
      </View>

      {viewModel.user?.address && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Address</Text>
          <View style={styles.card}>
            <Text style={styles.addressText}>
              {viewModel.user.address.street}, {viewModel.user.address.suite}
            </Text>
            <Text style={styles.addressText}>
              {viewModel.user.address.city}, {viewModel.user.address.zipcode}
            </Text>
          </View>
        </View>
      )}

      {viewModel.user?.company && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Company</Text>
          <View style={styles.card}>
            <Text style={styles.companyName}>{viewModel.user.company.name}</Text>
            <Text style={styles.companyInfo}>{viewModel.user.company.catchPhrase}</Text>
            <Text style={styles.companyInfo}>{viewModel.user.company.bs}</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
  },
  addressText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  companyName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  companyInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
});
