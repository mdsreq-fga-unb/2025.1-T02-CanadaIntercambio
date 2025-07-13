import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Toast } from '../../components/Toast';
import { useAuth } from '../../contexts/AuthContext';
import { profileService } from '../../services/profileService';
import { TextInputMask } from 'react-native-masked-text';

export default function EditarPerfilScreen() {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [nearestUnit, setNearestUnit] = useState('');

  const [toast, setToast] = useState({
    visible: false,
    message: '',
    type: 'info' as 'success' | 'error' | 'info',
  });

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ visible: true, message, type });
  };

  const hideToast = () => setToast(prev => ({ ...prev, visible: false }));

  useEffect(() => {
    if (!authLoading) {
      loadProfile();
    }
  }, [authLoading]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const profile = await profileService.getProfile();
      setFirstName(profile.firstName || '');
      setLastName(profile.lastName || '');
      setEmail(profile.email || '');
      setPhone(profile.phone || '');
      setNearestUnit(profile.nearestUnit || '');
    } catch (err) {
      console.error('Erro ao carregar perfil:', err);
      showToast('Erro ao carregar perfil', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await profileService.updateProfile({
        firstName,
        lastName,
        email,
        phone,
        nearestUnit,
      });
      showToast('Perfil atualizado com sucesso!', 'success');
    } catch (err: any) {
      console.error('Erro ao atualizar perfil:', err);
      showToast(err.message || 'Erro ao salvar perfil', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../../assets/images/login_logo.png')} style={styles.logo} resizeMode="contain" />
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Atualize suas informações:</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nome</Text>
          <Input placeholder="Nome" value={firstName} onChangeText={setFirstName} editable={!loading} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Sobrenome</Text>
          <Input placeholder="Sobrenome" value={lastName} onChangeText={setLastName} editable={!loading} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>E-mail</Text>
          <Input
            placeholder="E-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Telefone</Text>
          <TextInputMask
            type={'cel-phone'}
            options={{
              maskType: 'BRL',
              withDDD: true,
              dddMask: '(99) '
            }}
            value={phone}
            onChangeText={setPhone}
            style={styles.input}
            placeholder="(99) 99999-9999"
            keyboardType="phone-pad"
            editable={!loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Unidade mais próxima</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={nearestUnit}
              onValueChange={setNearestUnit}
              enabled={!loading}
              style={styles.picker}
            >
              <Picker.Item label="Selecione a unidade mais próxima" value="" />
              <Picker.Item label="São Paulo - SP" value="sao-paulo" />
              <Picker.Item label="Rio de Janeiro - RJ" value="rio-janeiro" />
              <Picker.Item label="Belo Horizonte - MG" value="belo-horizonte" />
              <Picker.Item label="Brasília - DF" value="brasilia" />
              <Picker.Item label="Porto Alegre - RS" value="porto-alegre" />
            </Picker>
          </View>
        </View>

        <Button
          title={loading ? 'Salvando...' : 'Salvar'}
          onPress={handleSave}
          loading={loading}
          disabled={loading}
          style={styles.button}
        />
      </ScrollView>

      <View style={styles.footer} />
      <Toast visible={toast.visible} message={toast.message} type={toast.type} onHide={hideToast} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { height: 70, backgroundColor: '#cb2328', justifyContent: 'center', alignItems: 'center' },
  logo: { width: 250, height: 60, marginTop: 10 },
  footer: { height: 40, backgroundColor: '#cb2328', marginTop: 'auto' },
  content: { alignItems: 'center', padding: 20, flexGrow: 1 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#cb2328', marginBottom: 20, textAlign: 'center' },
  inputContainer: { width: '100%', maxWidth: 350, marginBottom: 15 },
  label: { fontSize: 14, color: '#333', marginBottom: 5 },
  input: {
    height: 48,
    borderColor: '#dee2e6',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#f8f9fa',
    color: '#333',
  },
  pickerContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  picker: {
    height: 48,
    width: '100%',
    color: '#333',
  },
  button: {
    width: '100%',
    maxWidth: 350,
    marginTop: 20,
  },
});
