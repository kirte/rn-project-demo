import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { useService } from '../../core/hooks/useService';
import { AdminRepository } from './AdminRepository';
import { ApiResult } from '../../core/api/ApiResult';
import { TYPES } from '../../core/di/types';

export const AdminScreen: React.FC = () => {
  const repo = useService<AdminRepository>(TYPES.AdminRepository);
  const [res, setRes] = useState<ApiResult<any>>({ type: 'Loading' });
  const load = async () => { const r = await repo.getDashboard(); setRes(r); };
  useEffect(() => { load(); }, []);
  if (res.type === 'Loading') return <Text>Loading admin...</Text>;
  if (res.type === 'Success') return (<View><Text>Admin data loaded</Text><Text>{JSON.stringify(res.data)}</Text></View>);
  return (<View><Text>Admin error: {res.message}</Text><Button title='Retry' onPress={load} /></View>);
};
