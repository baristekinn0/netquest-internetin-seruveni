import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { useStore } from '../store/useStore';
import { MODULES } from '../data/modules';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Main'>;
};

export default function ProfileScreen({ navigation }: Props) {
  const { user, logout, progress, totalStars } = useStore();

  const completedCount = progress.filter((p) => p.completed).length;

  const handleLogout = () => {
    logout();
    navigation.replace('Login');
  };

  return (
    <LinearGradient colors={['#0F0C29', '#302B63', '#24243E']} style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Profil</Text>

        {/* Avatar & kullanıcı */}
        <View style={styles.avatarSection}>
          <LinearGradient colors={['#6C63FF', '#9B59B6']} style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user ? user[0].toUpperCase() : '?'}
            </Text>
          </LinearGradient>
          <Text style={styles.username}>{user}</Text>
          <Text style={styles.subtitle}>NetQuest Öğrencisi</Text>
        </View>

        {/* İstatistikler */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>⭐ {totalStars}</Text>
            <Text style={styles.statLabel}>Yıldız</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{completedCount}</Text>
            <Text style={styles.statLabel}>Tamamlanan</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{MODULES.length - completedCount}</Text>
            <Text style={styles.statLabel}>Kalan</Text>
          </View>
        </View>

        {/* Rozetler */}
        <Text style={styles.sectionTitle}>Rozetler</Text>
        <View style={styles.badgesRow}>
          {MODULES.map((mod) => {
            const prog = progress.find((p) => p.moduleId === mod.id);
            const earned = prog?.completed ?? false;
            return (
              <View key={mod.id} style={[styles.badge, !earned && styles.badgeLocked]}>
                <Text style={[styles.badgeEmoji, !earned && styles.locked]}>{mod.emoji}</Text>
                <Text style={[styles.badgeName, !earned && styles.lockedText]} numberOfLines={1}>
                  {mod.title.split(' ').slice(0, 2).join(' ')}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Çıkış */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Çıkış Yap</Text>
        </TouchableOpacity>

        <View style={{ height: 24 }} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: '800', color: '#FFFFFF', marginBottom: 24 },
  avatarSection: { alignItems: 'center', marginBottom: 28 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: { fontSize: 36, fontWeight: '900', color: '#FFFFFF' },
  username: { fontSize: 22, fontWeight: '800', color: '#FFFFFF' },
  subtitle: { fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 4 },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
  },
  statNumber: { fontSize: 20, fontWeight: '800', color: '#FFFFFF' },
  statLabel: { fontSize: 11, color: 'rgba(255,255,255,0.55)', marginTop: 2, fontWeight: '600' },
  sectionTitle: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 32,
  },
  badge: {
    backgroundColor: 'rgba(108,99,255,0.25)',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    width: '47%',
    borderWidth: 1.5,
    borderColor: 'rgba(108,99,255,0.5)',
  },
  badgeLocked: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: 'rgba(255,255,255,0.1)',
  },
  badgeEmoji: { fontSize: 28, marginBottom: 4 },
  badgeName: { color: '#FFFFFF', fontSize: 12, fontWeight: '700', textAlign: 'center' },
  locked: { opacity: 0.3 },
  lockedText: { color: 'rgba(255,255,255,0.3)' },
  logoutBtn: {
    backgroundColor: 'rgba(255,71,87,0.2)',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,71,87,0.4)',
  },
  logoutText: { color: '#FF4757', fontWeight: '800', fontSize: 15 },
});
