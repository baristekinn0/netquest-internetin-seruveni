import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { useStore } from '../store/useStore';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Login'>;
};

const FAKE_USERS = [
  { username: 'ogrenci', password: '1234' },
  { username: 'demo', password: 'demo' },
  { username: 'netquest', password: 'netquest' },
];

export default function LoginScreen({ navigation }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useStore();

  const handleLogin = () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Eksik Bilgi', 'Kullanıcı adı ve şifre giriniz.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const user = FAKE_USERS.find(
        (u) => u.username === username.trim().toLowerCase() && u.password === password
      );

      if (user) {
        setUser(username.trim());
        navigation.replace('Home');
      } else {
        Alert.alert('Hatalı Giriş', 'Kullanıcı adı veya şifre yanlış.\n\nİpucu: ogrenci / 1234');
        setLoading(false);
      }
    }, 600);
  };

  return (
    <LinearGradient colors={['#0F0C29', '#302B63', '#24243E']} style={styles.container}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inner}
      >
        {/* Logo */}
        <View style={styles.logoArea}>
          <Text style={styles.logoEmoji}>🌐</Text>
          <Text style={styles.appName}>NetQuest</Text>
          <Text style={styles.tagline}>İnternetin Serüveni</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.label}>Kullanıcı Adı</Text>
          <TextInput
            style={styles.input}
            placeholder="kullanıcı adınızı girin"
            placeholderTextColor="rgba(255,255,255,0.35)"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>Şifre</Text>
          <TextInput
            style={styles.input}
            placeholder="şifrenizi girin"
            placeholderTextColor="rgba(255,255,255,0.35)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={['#6C63FF', '#9B59B6']}
              style={styles.loginBtnGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.loginBtnText}>
                {loading ? 'Giriş yapılıyor...' : 'Giriş Yap →'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <Text style={styles.hint}>Demo: ogrenci / 1234</Text>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { flex: 1, justifyContent: 'center', paddingHorizontal: 28 },
  logoArea: { alignItems: 'center', marginBottom: 48 },
  logoEmoji: { fontSize: 72, marginBottom: 8 },
  appName: { fontSize: 38, fontWeight: '900', color: '#FFFFFF' },
  tagline: { fontSize: 14, color: 'rgba(255,255,255,0.6)', letterSpacing: 1.5, marginTop: 4 },
  form: { gap: 10 },
  label: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '600', marginBottom: 2 },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#FFFFFF',
    fontSize: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.15)',
    marginBottom: 8,
  },
  loginBtn: { marginTop: 8, borderRadius: 16, overflow: 'hidden' },
  loginBtnDisabled: { opacity: 0.6 },
  loginBtnGradient: { paddingVertical: 16, alignItems: 'center' },
  loginBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 17 },
  hint: { textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 12, marginTop: 32 },
});
