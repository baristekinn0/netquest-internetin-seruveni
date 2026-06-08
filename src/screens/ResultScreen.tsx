/**
 * ResultScreen - Quiz sonuçlarını gösterir
 * Kullanıcının başarı yüzdesini ve skoru gösterir
 * @component
 * @returns {JSX.Element} Quiz results view
 */
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { ModulesStackParamList } from '../types';
import { MODULES } from '../data/modules';
import { useStore } from '../store/useStore';
import ConfettiCannon from 'react-native-confetti-cannon';

type Props = {
  navigation: StackNavigationProp<ModulesStackParamList, 'Result'>;
  route: RouteProp<ModulesStackParamList, 'Result'>;
};

export default function ResultScreen({ navigation, route }: Props) {
  const { moduleId, score, total, passed } = route.params;
  const mod = MODULES.find((m) => m.id === moduleId)!;
  const { setModuleComplete } = useStore();
  const { width } = useWindowDimensions();

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const confettiRef = useRef<any>(null);

  const stars = passed ? (score === total ? 3 : score >= Math.ceil(total * 0.8) ? 2 : 1) : 0;
  const percentage = Math.round((score / total) * 100);

  useEffect(() => {
    if (passed) {
      const s = score === total ? 3 : score >= Math.ceil(total * 0.8) ? 2 : 1;
      setModuleComplete(moduleId, s);
    }
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, bounciness: 12 }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
    ]).start(() => {
      if (passed) {
        setTimeout(() => confettiRef.current?.start(), 100);
      }
    });
  }, []);

  return (
    <LinearGradient colors={['#0F0C29', '#302B63', '#24243E']} style={styles.container}>
      <StatusBar barStyle="light-content" />

      {passed && (
        <ConfettiCannon
          ref={confettiRef}
          count={120}
          origin={{ x: width / 2, y: -20 }}
          autoStart={false}
          fadeOut
          explosionSpeed={350}
          fallSpeed={3000}
          colors={['#6C63FF', '#FFD700', '#2ED573', '#FF6B6B', '#FFFFFF']}
        />
      )}

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <LinearGradient
          colors={mod.gradientColors}
          style={styles.moduleBadge}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.moduleEmoji}>{mod.emoji}</Text>
          <Text style={styles.moduleName}>{mod.title}</Text>
        </LinearGradient>

        <Animated.View style={[styles.scoreCircle, { transform: [{ scale: scaleAnim }] }]}>
          <LinearGradient
            colors={passed ? mod.gradientColors : ['#FF4757', '#c0392b']}
            style={styles.scoreGradient}
          >
            <Text style={styles.feedbackEmoji}>{passed ? '🏆' : '😅'}</Text>
            <Text style={styles.scoreNumber}>{score}/{total}</Text>
            <Text style={styles.scoreLabel}>{percentage}%</Text>
          </LinearGradient>
        </Animated.View>

        {passed ? (
          <>
            <Text style={styles.stars}>{'⭐'.repeat(stars)}{'☆'.repeat(3 - stars)}</Text>
            <Text style={styles.feedbackTitle}>Tebrikler! Geçtin! 🎉</Text>
            <Text style={styles.feedbackBody}>
              {score === total
                ? 'Mükemmel! Tüm soruları doğru yanıtladın!'
                : `${score} doğru ile modülü başarıyla tamamladın.`}
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.failIcon}>❌</Text>
            <Text style={styles.feedbackTitle}>Modül Tamamlanamadı</Text>
            <Text style={styles.feedbackBody}>
              {`${score}/${total} doğru yaptın (%${percentage}). Geçmek için %70 gerekiyor. Tekrar dene!`}
            </Text>
          </>
        )}

        <TouchableOpacity
          style={styles.homeBtn}
          onPress={() => navigation.popToTop()}
        >
          <Text style={styles.homeBtnText}>🏠 Ana Sayfaya Dön</Text>
        </TouchableOpacity>

        {!passed && (
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => navigation.replace('Quiz', { moduleId })}
          >
            <Text style={styles.retryBtnText}>🔄 Tekrar Dene (Yeni Sorular)</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center' },
  content: { alignItems: 'center', paddingHorizontal: 24 },
  moduleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    marginBottom: 28,
  },
  moduleEmoji: { fontSize: 22 },
  moduleName: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
  scoreCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  scoreGradient: {
    flex: 1,
    borderRadius: 75,
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedbackEmoji: { fontSize: 32, marginBottom: 4 },
  scoreNumber: { fontSize: 32, fontWeight: '900', color: '#FFFFFF' },
  scoreLabel: { fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: '600' },
  stars: { fontSize: 32, marginBottom: 12, letterSpacing: 4 },
  failIcon: { fontSize: 40, marginBottom: 12 },
  feedbackTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  feedbackBody: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 32,
    paddingHorizontal: 10,
  },
  homeBtn: {
    backgroundColor: '#6C63FF',
    borderRadius: 16,
    paddingHorizontal: 32,
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  homeBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 15 },
  retryBtn: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 16,
    paddingHorizontal: 32,
    paddingVertical: 13,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  retryBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
});
