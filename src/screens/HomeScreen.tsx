import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { MODULES } from '../data/modules';
import { useStore } from '../store/useStore';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
};

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }: Props) {
  const { progress, totalStars } = useStore();

  const getModuleProgress = (moduleId: string) =>
    progress.find((p) => p.moduleId === moduleId);

  return (
    <LinearGradient colors={['#0F0C29', '#302B63', '#24243E']} style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appTitle}>🌐 NetQuest</Text>
          <Text style={styles.appSubtitle}>İnternetin Serüveni</Text>
          <View style={styles.starsBox}>
            <Text style={styles.starsText}>⭐ {totalStars} yıldız toplandı</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Modüller</Text>

        {MODULES.map((module, index) => {
          const prog = getModuleProgress(module.id);
          const completed = prog?.completed ?? false;
          const score = prog?.score ?? 0;

          return (
            <TouchableOpacity
              key={module.id}
              onPress={() => navigation.navigate('Module', { moduleId: module.id })}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={module.gradientColors}
                style={styles.moduleCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.cardTop}>
                  <Text style={styles.moduleNumber}>{index + 1}</Text>
                  <Text style={styles.moduleEmoji}>{module.emoji}</Text>
                </View>
                <Text style={styles.moduleTitle}>{module.title}</Text>
                <Text style={styles.moduleSubtitle}>{module.subtitle}</Text>

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

        <View style={{ height: 32 }} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingTop: 60 },
  header: { alignItems: 'center', marginBottom: 32 },
  appTitle: { fontSize: 36, fontWeight: '800', color: '#FFFFFF' },
  appSubtitle: { fontSize: 16, color: '#C0B9DD', marginTop: 4, letterSpacing: 1 },
  starsBox: {
    marginTop: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  starsText: { color: '#FFD700', fontWeight: '700', fontSize: 14 },
  sectionTitle: {
    color: '#C0B9DD',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  moduleCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  moduleNumber: { fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: '700' },
  moduleEmoji: { fontSize: 32 },
  moduleTitle: { fontSize: 22, fontWeight: '800', color: '#FFFFFF' },
  moduleSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  completedBadge: {
    marginTop: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  completedText: { color: '#FFD700', fontSize: 12, fontWeight: '700' },
});
