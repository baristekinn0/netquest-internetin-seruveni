import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  StatusBar,
  Dimensions,
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

const { width } = Dimensions.get('window');

export default function QuizScreen({ navigation, route }: Props) {
  const { moduleId } = route.params;
  const module = MODULES.find((m) => m.id === moduleId)!;

  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>('idle');
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const question = module.quiz[currentQ];

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const handleAnswer = (idx: number) => {
    if (answerState !== 'idle') return;
    setSelected(idx);
    const correct = idx === question.correctIndex;

    if (correct) {
      setAnswerState('correct');
      setScore((s) => s + 1);
    } else {
      setAnswerState('wrong');
      shake();
    }

    setTimeout(() => {
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
        if (currentQ + 1 >= module.quiz.length) {
          navigation.replace('Result', {
            moduleId,
            score: correct ? score + 1 : score,
            total: module.quiz.length,
          });
        } else {
          setCurrentQ((q) => q + 1);
          setSelected(null);
          setAnswerState('idle');
          Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
        }
      });
    }, 900);
  };

  const getOptionStyle = (idx: number) => {
    if (answerState === 'idle') return styles.option;
    if (idx === question.correctIndex) return [styles.option, styles.optionCorrect];
    if (idx === selected && answerState === 'wrong') return [styles.option, styles.optionWrong];
    return styles.option;
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
        <View
          style={[
            styles.progressFill,
            { width: `${((currentQ) / module.quiz.length) * 100}%` },
          ]}
        />
      </View>

      {/* Question */}
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
          <View style={styles.questionCard}>
            <Text style={styles.questionText}>{question.question}</Text>
          </View>
        </Animated.View>

        {/* Options */}
        <View style={styles.options}>
          {question.options.map((opt, idx) => (
            <TouchableOpacity
              key={idx}
              style={getOptionStyle(idx)}
              onPress={() => handleAnswer(idx)}
              activeOpacity={0.8}
              disabled={answerState !== 'idle'}
            >
              <Text style={styles.optionLetter}>
                {['A', 'B', 'C', 'D'][idx]}
              </Text>
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
      </Animated.View>
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
    marginBottom: 24,
  },
  progressFill: {
    height: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  },
  content: { flex: 1, paddingHorizontal: 20 },
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
  options: { gap: 12 },
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
  optionLetter: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
    width: 28,
  },
  optionText: {
    color: '#FFFFFF',
    fontSize: 15,
    flex: 1,
    lineHeight: 22,
  },
  icon: { fontSize: 18, marginLeft: 8 },
});
