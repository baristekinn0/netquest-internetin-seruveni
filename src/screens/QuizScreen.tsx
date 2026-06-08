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
import { useWindowDimensions } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { ModulesStackParamList } from '../types';
import { MODULES } from '../data/modules';

type Props = {
  navigation: StackNavigationProp<ModulesStackParamList, 'Quiz'>;
  route: RouteProp<ModulesStackParamList, 'Quiz'>;
};

type AnswerState = 'idle' | 'correct' | 'wrong';

const QUIZ_QUESTION_COUNT = 5;
const PASS_THRESHOLD = 0.7;

type PreparedQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function prepareQuestions(moduleId: string): PreparedQuestion[] {
  const mod = MODULES.find((m) => m.id === moduleId)!;
  const pool = shuffle(mod.quiz).slice(0, QUIZ_QUESTION_COUNT);

  return pool.map((q) => {
    const correctAnswer = q.options[q.correctIndex];
    const shuffledOptions = shuffle(q.options);
    const newCorrectIndex = shuffledOptions.indexOf(correctAnswer);
    return {
      question: q.question,
      options: shuffledOptions,
      correctIndex: newCorrectIndex,
      explanation: q.explanation,
    };
  });
}

export default function QuizScreen({ navigation, route }: Props) {
  const { moduleId } = route.params;
  const mod = MODULES.find((m) => m.id === moduleId)!;
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const [questions, setQuestions] = useState<PreparedQuestion[]>(() =>
    prepareQuestions(moduleId)
  );
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>('idle');

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const explanationAnim = useRef(new Animated.Value(0)).current;

  const question = questions[currentQ];
  const total = questions.length;

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
      setTimeout(() => goNext(score + 1), 1400);
    } else {
      setAnswerState('wrong');
      shake();
      showExplanation();
    }
  };

  const goNext = (finalScore: number) => {
    Animated.timing(fadeAnim, { toValue: 0, duration: 250, useNativeDriver: true }).start(() => {
      explanationAnim.setValue(0);
      if (currentQ + 1 >= total) {
        const passed = finalScore / total >= PASS_THRESHOLD;
        navigation.replace('Result', {
          moduleId,
          score: finalScore,
          total,
          passed,
        });
      } else {
        setCurrentQ((q) => q + 1);
        setSelected(null);
        setAnswerState('idle');
        Animated.timing(fadeAnim, { toValue: 1, duration: 280, useNativeDriver: true }).start();
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
    <LinearGradient colors={mod.gradientColors} style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={[styles.header, isLandscape && styles.headerLandscape]}>
        <Text style={styles.headerLabel}>Soru {currentQ + 1}/{total}</Text>
        <Text style={styles.headerTitle}>{mod.emoji} Quiz</Text>
        <Text style={styles.scoreText}>✅ {score}</Text>
      </View>

      <View style={styles.progressBg}>
        <View style={[styles.progressFill, { width: `${(currentQ / total) * 100}%` }]} />
      </View>

      <View style={styles.passBadge}>
        <Text style={styles.passBadgeText}>
          Geçmek için {Math.ceil(total * PASS_THRESHOLD)}/{total} doğru gerek
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim }}>
          <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
            <View style={styles.questionCard}>
              <Text style={styles.questionText}>{question.question}</Text>
            </View>
          </Animated.View>

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
                  {currentQ + 1 >= total ? 'Sonucu Gör →' : 'Sonraki Soru →'}
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
  headerLandscape: { paddingTop: 16 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  headerLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 13 },
  headerTitle: { color: '#FFFFFF', fontWeight: '800', fontSize: 18 },
  scoreText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  progressBg: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 20,
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: { height: 6, backgroundColor: '#FFFFFF', borderRadius: 3 },
  passBadge: { marginHorizontal: 20, marginBottom: 12 },
  passBadgeText: { color: 'rgba(255,255,255,0.55)', fontSize: 11, fontWeight: '600' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  questionCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  questionText: {
    fontSize: 19,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 27,
    textAlign: 'center',
  },
  options: { gap: 10, marginBottom: 14 },
  option: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 14,
    padding: 14,
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
  optionDimmed: { opacity: 0.45 },
  optionLetter: { color: '#FFFFFF', fontWeight: '800', fontSize: 14, width: 26 },
  optionText: { color: '#FFFFFF', fontSize: 14, flex: 1, lineHeight: 20 },
  icon: { fontSize: 16, marginLeft: 6 },
  explanationCard: {
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.2)',
    gap: 8,
  },
  explanationTitle: { color: '#FFD700', fontWeight: '800', fontSize: 13 },
  explanationCorrect: { color: '#2ED573', fontWeight: '700', fontSize: 15 },
  explanationBody: { color: 'rgba(255,255,255,0.9)', fontSize: 13, lineHeight: 20 },
  continueBtn: {
    marginTop: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  continueBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 14 },
});
