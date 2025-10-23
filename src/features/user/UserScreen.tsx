import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Button, StyleSheet } from 'react-native';
import { useService } from '../../core/hooks/useService';
import { UserRepository } from './UserRepository';
import { ApiResult } from '../../core/api/ApiResult';
import { TYPES } from '../../core/di/types';

export const UserScreen: React.FC = () => {
  const userRepo = useService<UserRepository>(TYPES.UserRepository);
  const [result, setResult] = useState<ApiResult<any>>({ type: 'Loading' });
  const load = async () => { setResult({ type: 'Loading' }); const res = await userRepo.getUser('1'); setResult(res); };
  useEffect(() => { load(); }, []);
  if (result.type === 'Loading') return (<View style={styles.center}><ActivityIndicator /><Text>Loading...</Text></View>);
  if (result.type === 'Success') return (<View style={styles.container}><Text style={styles.title}>User Profile</Text><Text>Name: {result.data.name}</Text><Text>Email: {result.data.email}</Text><Button title='Reload' onPress={load} /></View>);
  return (<View style={styles.center}><Text style={{ color: 'red' }}>Error: {result.message}</Text><Button title='Retry' onPress={load} /></View>);
};
const styles = StyleSheet.create({ center: { flex: 1, justifyContent: 'center', alignItems: 'center' }, container: { padding: 16 }, title: { fontSize: 20, marginBottom: 8 }, });
