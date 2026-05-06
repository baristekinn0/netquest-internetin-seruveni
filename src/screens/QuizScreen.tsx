import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  StatusBar,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { MODULES } from '../data/modules';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Quiz'>;
  route: RouteProp<RootStackParamList, 'Quiz'>;
};

type AnswerState = 'idle' | 'correct' | 'wrong';

export default function QuizScreen({ navigation, route }: Props) {
  const { moduleId } = route.params;
  const module = MODULES.find((m) => m.id === moduleId);
  if (!module) {
    return (
      <View style={styles.container}>
        <Text>Modül bulunamadı</Text>
      </View>
    );
  }

  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>('idle');
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const explanationAnim = useRef(new Animated.Value(0)).current;

  const question = module.quiz[currentQ];

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const showExplanation = () => {
    Animated.timing(explanationAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
  };

  const handleAnswer = (idx: number) => {
    if (answerState !== 'idle') return;
    setSelected(idx);
    const correct = idx === question.correctIndex;

    if (correct) {
      setAnswerState('correct');
      setScore((s) => s + 1);
      // Doğru cevapta kısa bekleyip geç
      setTimeout(() => goNext(score + 1), 1000);
    } else {
      setAnswerState('wrong');
      shake();
      showExplanation();
      // Yanlış cevapta açıklama göster, kullanıcı "Devam" a bassın
    }
  };

  const goNext = (finalScore: number) => {
    Animated.timing(fadeAnim, { toValue: 0, duration: 180, useNativeDriver: true }).start(() => {
      explanationAnim.setValue(0);
      if (currentQ + 1 >= module.quiz.length) {
        navigation.replace('Result', {
          moduleId,
          score: finalScore,
          total: module.quiz.length,
        });
      } else {
        setCurrentQ((q) => q + 1);
        setSelected(null);
        setAnswerState('idle');
        Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
      }
    });
  };

  const getOptionStyle = (idx: number) => {
    if (answerState === 'idle') return styles.option;
    if (idx === question.correctIndex) return [styles.option, styles.optionCorrect];
    if (idx === selected && answerState === 'wrong') return [styles.option, styles.optionWrong];
    return [styles.option, styles.optionDimmed];
  };

  return (
    <LinearGradient colors={module.gradientColors} style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerLabel}>Soru {currentQ + 1}/{module.quiz.length}</Text>
        <Text style={styles.headerTitle}>{module.emoji} Quiz</Text>
        <Text style={styles.scoreText}>✅ {score}</Text>
      </View>

      {/* Progress bar */}
      <View style={styles.progressBg}>
        <View style={[styles.progressFill, { width: `${(currentQ / module.quiz.length) * 100}%` }]} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Soru */}
          <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
            <View style={styles.questionCard}>
              <Text style={styles.questionText}>{question.question}</Text>
            </View>
          </Animated.View>

          {/* Seçenekler */}
          <View style={styles.options}>
            {question.options.map((opt, idx) => (
              <TouchableOpacity
                key={idx}
                style={getOptionStyle(idx)}
                onPress={() => handleAnswer(idx)}
                activeOpacity={0.8}
                disabled={answerState !== 'idle'}
              >
                <Text style={styles.optionLetter}>{['A', 'B', 'C', 'D'][idx]}</Text>
                <Text style={styles.optionText}>{opt}</Text>
                {answerState !== 'idle' && idx === question.correctIndex && (
                  <Text style={styles.icon}>✅</Text>
                )}
                {answerState === 'wrong' && idx === selected && (
                  <Text style={styles.icon}>❌</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Açıklama (sadece yanlış cevapta) */}
          {answerState === 'wrong' && (
            <Animated.View style={[styles.explanationCard, { opacity: explanationAnim }]}>
              <Text style={styles.explanationTitle}>💡 Doğru Cevap:</Text>
              <Text style={styles.explanationCorrect}>
                {question.options[question.correctIndex]}
              </Text>
              <Text style={styles.explanationBody}>{question.explanation}</Text>
              <TouchableOpacity
                style={styles.continueBtn}
                onPress={() => goNext(score)}
              >
                <Text style={styles.continueBtnText}>
                  {currentQ + 1 >= module.quiz.length ? 'Sonucu Gör →' : 'Sonraki Soru →'}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  headerLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 13 },
  headerTitle: { color: '#FFFFFF', fontWeight: '800', fontSize: 18 },
  scoreText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  progressBg: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 20,
    borderRadius: 3,
    marginBottom: 20,
  },
  progressFill: { height: 6, backgroundColor: '#FFFFFF', borderRadius: 3 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  questionCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
  },
  questionText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 28,
    textAlign: 'center',
  },
  options: { gap: 12, marginBottom: 16 },
  option: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  optionCorrect: {
    backgroundColor: 'rgba(46, 213, 115, 0.35)',
    borderColor: '#2ED573',
  },
  optionWrong: {
    backgroundColor: 'rgba(255, 71, 87, 0.35)',
    borderColor: '#FF4757',
  },
  optionDimmed: {
    opacity: 0.45,
  },
  optionLetter: { color: '#FFFFFF', fontWeight: '800', fontSize: 15, width: 28 },
  optionText: { color: '#FFFFFF', fontSize: 15, flex: 1, lineHeight: 22 },
  icon: { fontSize: 18, marginLeft: 8 },
  explanationCard: {
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.2)',
    gap: 8,
  },
  explanationTitle: { color: '#FFD700', fontWeight: '800', fontSize: 14 },
  explanationCorrect: {
    color: '#2ED573',
    fontWeight: '700',
    fontSize: 16,
  },
  explanationBody: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    lineHeight: 22,
  },
  continueBtn: {
    marginTop: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  continueBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 15 },
});
