/**
 * LoginScreen - Kullanıcı giriş ekranı
 * Email ve şifre ile giriş yapmayı sağlar
 * @component
 * @returns {JSX.Element} Login form view
 */
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
  ScrollView,
  useWindowDimensions,
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
  const [showPassword, setShowPassword] = useState(false);
  const { setUser } = useStore();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

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
        navigation.replace('Main');
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
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={[
            styles.inner,
            isLandscape && styles.innerLandscape,
          ]}
          keyboardShouldPersistTaps="handled"
        >
          {isLandscape ? (
            <View style={styles.landscapeLayout}>
              <View style={styles.logoAreaLandscape}>
                <Text style={styles.logoEmoji}>🌐</Text>
                <Text style={styles.appName}>NetQuest</Text>
                <Text style={styles.tagline}>İnternetin Serüveni</Text>
              </View>
              <View style={[styles.form, { width: Math.min(380, width * 0.45) }]}>
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
                <View style={styles.passwordWrapper}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="şifrenizi girin"
                    placeholderTextColor="rgba(255,255,255,0.35)"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword((v) => !v)} style={styles.eyeBtn}>
                    <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
                  </TouchableOpacity>
                </View>
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
                <Text style={styles.hint}>Demo: ogrenci / 1234</Text>
              </View>
            </View>
          ) : (
            <>
              <View style={styles.logoArea}>
                <Text style={styles.logoEmoji}>🌐</Text>
                <Text style={styles.appName}>NetQuest</Text>
                <Text style={styles.tagline}>İnternetin Serüveni</Text>
              </View>
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
                <View style={styles.passwordWrapper}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="şifrenizi girin"
                    placeholderTextColor="rgba(255,255,255,0.35)"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword((v) => !v)} style={styles.eyeBtn}>
                    <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
                  </TouchableOpacity>
                </View>
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
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  inner: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 28, paddingVertical: 32 },
  innerLandscape: { paddingVertical: 16 },
  landscapeLayout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 48,
    flex: 1,
  },
  logoArea: { alignItems: 'center', marginBottom: 40 },
  logoAreaLandscape: { alignItems: 'center' },
  logoEmoji: { fontSize: 64, marginBottom: 8 },
  appName: { fontSize: 36, fontWeight: '900', color: '#FFFFFF' },
  tagline: { fontSize: 13, color: 'rgba(255,255,255,0.6)', letterSpacing: 1.5, marginTop: 4 },
  form: { gap: 10 },
  label: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '600', marginBottom: 2 },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 13,
    color: '#FFFFFF',
    fontSize: 15,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.15)',
    marginBottom: 6,
  },
  loginBtn: { marginTop: 8, borderRadius: 14, overflow: 'hidden' },
  loginBtnDisabled: { opacity: 0.6 },
  loginBtnGradient: { paddingVertical: 14, alignItems: 'center' },
  loginBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 16 },
  hint: { textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 12, marginTop: 24 },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.15)',
    marginBottom: 6,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 13,
    color: '#FFFFFF',
    fontSize: 15,
  },
  eyeBtn: { paddingHorizontal: 14 },
  eyeIcon: { fontSize: 18 },
});
