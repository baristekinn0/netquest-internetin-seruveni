import React from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MODULES } from '../data/modules';
import { useStore } from '../store/useStore';

export default function ProgressScreen() {
  const { progress, totalStars } = useStore();

  const completedCount = progress.filter((p) => p.completed).length;
  const totalModules = MODULES.length;

  return (
    <LinearGradient colors={['#0F0C29', '#302B63', '#24243E']} style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>İlerleme</Text>

        {/* Özet kart */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{completedCount}/{totalModules}</Text>
            <Text style={styles.summaryLabel}>Modül</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>⭐ {totalStars}</Text>
            <Text style={styles.summaryLabel}>Yıldız</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>
              {totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0}%
            </Text>
            <Text style={styles.summaryLabel}>Tamamlandı</Text>
          </View>
        </View>

        {/* Genel ilerleme çubuğu */}
        <View style={styles.progressBg}>
          <View
            style={[
              styles.progressFill,
              { width: `${(completedCount / totalModules) * 100}%` },
            ]}
          />
        </View>

        {completedCount === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🚀</Text>
            <Text style={styles.emptyTitle}>Henüz başlamadın!</Text>
            <Text style={styles.emptyBody}>İlk modülü tamamlamak için Modüller sekmesine git.</Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>Modül Detayları</Text>

        {MODULES.map((mod, index) => {
          const prog = progress.find((p) => p.moduleId === mod.id);
          const completed = prog?.completed ?? false;
          const score = prog?.score ?? 0;

          return (
            <LinearGradient
              key={mod.id}
              colors={completed ? mod.gradientColors : ['#1a1a2e', '#16213e']}
              style={styles.moduleRow}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.moduleEmoji}>{mod.emoji}</Text>
              <View style={styles.moduleInfo}>
                <Text style={styles.moduleTitle}>{index + 1}. {mod.title}</Text>
                <Text style={styles.moduleStatus}>
                  {completed
                    ? `${'⭐'.repeat(score)}${'☆'.repeat(3 - score)} Tamamlandı`
                    : '🔒 Henüz tamamlanmadı'}
                </Text>
              </View>
              {completed && (
                <View style={styles.scoreBadge}>
                  <Text style={styles.scoreText}>{score}/3</Text>
                </View>
              )}
            </LinearGradient>
          );
        })}

        <View style={{ height: 24 }} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16 },
  title: { fontSize: 28, fontWeight: '800', color: '#FFFFFF', marginBottom: 20 },
  summaryCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryItem: { alignItems: 'center' },
  summaryNumber: { fontSize: 22, fontWeight: '800', color: '#FFFFFF' },
  summaryLabel: { fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 2, fontWeight: '600' },
  divider: { width: 1, height: 36, backgroundColor: 'rgba(255,255,255,0.2)' },
  progressBg: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 3,
    marginBottom: 24,
  },
  progressFill: { height: 6, backgroundColor: '#6C63FF', borderRadius: 3 },
  sectionTitle: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  moduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    gap: 12,
  },
  moduleEmoji: { fontSize: 28 },
  moduleInfo: { flex: 1 },
  moduleTitle: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
  moduleStatus: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 2 },
  scoreBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  scoreText: { color: '#FFFFFF', fontWeight: '800', fontSize: 13 },
  emptyState: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 20,
    padding: 28,
    marginBottom: 20,
  },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { color: '#FFFFFF', fontWeight: '800', fontSize: 18, marginBottom: 6 },
  emptyBody: { color: 'rgba(255,255,255,0.55)', fontSize: 13, textAlign: 'center', lineHeight: 20 },
});
