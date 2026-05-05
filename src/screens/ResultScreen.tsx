import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { MODULES } from '../data/modules';
import { useStore } from '../store/useStore';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Result'>;
  route: RouteProp<RootStackParamList, 'Result'>;
};

const FEEDBACK = [
  { min: 0, max: 0, emoji: '😅', title: 'Tekrar Dene!', body: 'Üzülme, modülü bir daha okuyup tekrar deneyebilirsin.' },
  { min: 1, max: 1, emoji: '🙂', title: 'İyi Başlangıç!', body: 'Doğru yoldasın! Biraz daha çalışırsan tam puan yaparsın.' },
  { min: 2, max: 2, emoji: '😎', title: 'Çok İyi!', body: 'Neredeyse mükemmel! Bir soruyu atladın ama harika gidiyorsun.' },
  { min: 3, max: 3, emoji: '🏆', title: 'Mükemmel!', body: 'Tebrikler! Tüm soruları doğru yanıtladın. Sen bir internet uzmanısın!' },
];

export default function ResultScreen({ navigation, route }: Props) {
  const { moduleId, score, total } = route.params;
  const module = MODULES.find((m) => m.id === moduleId)!;
  const { setModuleComplete } = useStore();

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setModuleComplete(moduleId, score);
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, bounciness: 12 }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  const feedback = FEEDBACK.find((f) => score >= f.min && score <= f.max)!;

  return (
    <LinearGradient colors={['#0F0C29', '#302B63', '#24243E']} style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Module badge */}
        <LinearGradient
          colors={module.gradientColors}
          style={styles.moduleBadge}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.moduleEmoji}>{module.emoji}</Text>
          <Text style={styles.moduleName}>{module.title}</Text>
        </LinearGradient>

        {/* Score circle */}
        <Animated.View style={[styles.scoreCircle, { transform: [{ scale: scaleAnim }] }]}>
          <LinearGradient colors={module.gradientColors} style={styles.scoreGradient}>
            <Text style={styles.feedbackEmoji}>{feedback.emoji}</Text>
            <Text style={styles.scoreNumber}>{score}/{total}</Text>
            <Text style={styles.scoreLabel}>doğru</Text>
          </LinearGradient>
        </Animated.View>

        {/* Stars */}
        <Text style={styles.stars}>
          {'⭐'.repeat(score)}{'☆'.repeat(total - score)}
        </Text>

        {/* Feedback */}
        <Text style={styles.feedbackTitle}>{feedback.title}</Text>
        <Text style={styles.feedbackBody}>{feedback.body}</Text>

        {/* Buttons */}
        <TouchableOpacity
          style={styles.homeBtn}
          onPress={() => navigation.popToTop()}
        >
          <Text style={styles.homeBtnText}>🏠 Ana Sayfaya Dön</Text>
        </TouchableOpacity>

        {score < total && (
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => navigation.replace('Quiz', { moduleId })}
          >
            <Text style={styles.retryBtnText}>🔄 Tekrar Dene</Text>
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
    marginBottom: 32,
  },
  moduleEmoji: { fontSize: 22 },
  moduleName: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
  scoreCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  scoreGradient: {
    flex: 1,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedbackEmoji: { fontSize: 36, marginBottom: 4 },
  scoreNumber: { fontSize: 36, fontWeight: '900', color: '#FFFFFF' },
  scoreLabel: { fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: '600' },
  stars: { fontSize: 36, marginBottom: 16, letterSpacing: 4 },
  feedbackTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  feedbackBody: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 36,
    paddingHorizontal: 10,
  },
  homeBtn: {
    backgroundColor: '#6C63FF',
    borderRadius: 18,
    paddingHorizontal: 32,
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  homeBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 16 },
  retryBtn: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 18,
    paddingHorizontal: 32,
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  retryBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
});
