import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { useService } from '../../core/hooks/useService';
import { AuthService } from '../../core/auth/AuthService';
import { TYPES } from '../../core/di/types';

export const LoginScreen: React.FC = () => {
  const auth = useService<AuthService>(TYPES.AuthService);
  const [user, setUser] = useState('demo');
  const [pass, setPass] = useState('password');
  const [msg, setMsg] = useState('');
  const onLogin = async () => { await auth.login(user, pass); setMsg(`Logged in token: ${auth.getToken()?.slice(0,10)}...`); };
  return (<View style={styles.container}><Text style={styles.title}>Login</Text><TextInput value={user} onChangeText={setUser} style={styles.input} /><TextInput value={pass} onChangeText={setPass} secureTextEntry style={styles.input} /><Button title='Login (mock)' onPress={onLogin} /><Text>{msg}</Text></View>);
};
const styles = StyleSheet.create({ container: { padding: 16 }, title: { fontSize: 20, marginBottom: 8 }, input: { borderWidth: 1, padding: 8, marginBottom: 8 }, });
