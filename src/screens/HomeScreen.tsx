/**
 * HomeScreen - Quiz modüllerini listeler ve seçilmiş modülün detayına gidebilirsin
 * @component
 * @returns {JSX.Element} Module list view
 */
// Bu bir deneme yorumudur.
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StackNavigationProp } from '@react-navigation/stack';
import { ModulesStackParamList } from '../types';
import { MODULES } from '../data/modules';
import { useStore } from '../store/useStore';

type Props = {
  navigation: StackNavigationProp<ModulesStackParamList, 'Home'>;
};

export default function HomeScreen({ navigation }: Props) {
  const { progress, totalStars, user } = useStore();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const getModuleProgress = (moduleId: string) =>
    progress.find((p) => p.moduleId === moduleId);

  const isModuleLocked = (index: number): boolean => {
    if (index === 0) return false;
    const prevModule = MODULES[index - 1];
    const prevProgress = getModuleProgress(prevModule.id);
    return !prevProgress?.completed;
  };

  const cardWidth = isLandscape ? (width - 48) / 2 : width - 32;

  return (
    <LinearGradient colors={['#0F0C29', '#302B63', '#24243E']} style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={[styles.scroll, isLandscape && styles.scrollLandscape]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.header, isLandscape && styles.headerLandscape]}>
          <View>
            <Text style={styles.welcomeText}>Hoş geldin, {user} 👋</Text>
            <Text style={styles.appTitle}>🌐 NetQuest</Text>
          </View>
          <View style={styles.starsBox}>
            <Text style={styles.starsText}>⭐ {totalStars}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Modüller</Text>

        <View style={[styles.grid, isLandscape && styles.gridLandscape]}>
          {MODULES.map((module, index) => {
            const prog = getModuleProgress(module.id);
            const completed = prog?.completed ?? false;
            const score = prog?.score ?? 0;
            const locked = isModuleLocked(index);

            return (
              <TouchableOpacity
                key={module.id}
                style={{ width: cardWidth }}
                onPress={() => {
                  if (!locked) navigation.navigate('Module', { moduleId: module.id });
                }}
                activeOpacity={locked ? 1 : 0.85}
              >
                <LinearGradient
                  colors={locked ? ['#2a2a3e', '#1e1e32'] : module.gradientColors}
                  style={styles.moduleCard}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.cardTop}>
                    <Text style={styles.moduleNumber}>{index + 1}</Text>
                    <Text style={[styles.moduleEmoji, locked && styles.lockedEmoji]}>
                      {locked ? '🔒' : module.emoji}
                    </Text>
                  </View>
                  <Text style={[styles.moduleTitle, locked && styles.lockedTitle]}>
                    {module.title}
                  </Text>
                  <Text style={[styles.moduleSubtitle, locked && styles.lockedSubtitle]}>
                    {locked ? 'Önceki modülü tamamla' : module.subtitle}
                  </Text>
                  {completed && (
                    <View style={styles.completedBadge}>
                      <Text style={styles.completedText}>
                        {'⭐'.repeat(score)}{'☆'.repeat(3 - score)} Tamamlandı!
                      </Text>
                    </View>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 16 }} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 16, paddingTop: 52, paddingBottom: 8 },
  scrollLandscape: { paddingTop: 24 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLandscape: { marginBottom: 12 },
  welcomeText: { color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: '600' },
  appTitle: { fontSize: 28, fontWeight: '800', color: '#FFFFFF', marginTop: 2 },
  starsBox: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  starsText: { color: '#FFD700', fontWeight: '700', fontSize: 15 },
  sectionTitle: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  grid: { gap: 12 },
  gridLandscape: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  moduleCard: {
    borderRadius: 18,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  moduleNumber: { fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: '700' },
  moduleEmoji: { fontSize: 28 },
  lockedEmoji: { opacity: 0.5 },
  moduleTitle: { fontSize: 20, fontWeight: '800', color: '#FFFFFF' },
  lockedTitle: { color: 'rgba(255,255,255,0.4)' },
  moduleSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  lockedSubtitle: { color: 'rgba(255,255,255,0.3)' },
  completedBadge: {
    marginTop: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  completedText: { color: '#FFD700', fontSize: 11, fontWeight: '700' },
});
