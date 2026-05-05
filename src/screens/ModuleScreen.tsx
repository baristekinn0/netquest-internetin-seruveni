import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { MODULES } from '../data/modules';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Module'>;
  route: RouteProp<RootStackParamList, 'Module'>;
};

const { width } = Dimensions.get('window');

export default function ModuleScreen({ navigation, route }: Props) {
  const { moduleId } = route.params;
  const module = MODULES.find((m) => m.id === moduleId)!;
  const [currentSlide, setCurrentSlide] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const goToSlide = (next: number) => {
    Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => {
      setCurrentSlide(next);
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    });
  };

  const slide = module.slides[currentSlide];
  const isLast = currentSlide === module.slides.length - 1;

  return (
    <LinearGradient colors={module.gradientColors} style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{module.title}</Text>
        <Text style={styles.slideCount}>{currentSlide + 1}/{module.slides.length}</Text>
      </View>

      {/* Progress dots */}
      <View style={styles.dots}>
        {module.slides.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i <= currentSlide ? styles.dotActive : styles.dotInactive]}
          />
        ))}
      </View>

      {/* Slide content */}
      <Animated.View style={[styles.slideContainer, { opacity: fadeAnim }]}>
        <ScrollView contentContainerStyle={styles.slideScroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.slideEmoji}>{slide.emoji}</Text>
          <Text style={styles.slideTitle}>{slide.title}</Text>
          <View style={styles.bodyCard}>
            <Text style={styles.slideBody}>{slide.body}</Text>
          </View>
        </ScrollView>
      </Animated.View>

      {/* Navigation buttons */}
      <View style={styles.navRow}>
        {currentSlide > 0 && (
          <TouchableOpacity style={styles.prevBtn} onPress={() => goToSlide(currentSlide - 1)}>
            <Text style={styles.prevText}>← Önceki</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.nextBtn}
          onPress={() => {
            if (isLast) {
              navigation.navigate('Quiz', { moduleId });
            } else {
              goToSlide(currentSlide + 1);
            }
          }}
        >
          <Text style={styles.nextText}>
            {isLast ? '🎯 Quize Geç!' : 'Sonraki →'}
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  backBtn: { padding: 4 },
  backText: { color: 'rgba(255,255,255,0.8)', fontSize: 15 },
  headerTitle: { color: '#FFFFFF', fontWeight: '800', fontSize: 16, flex: 1, textAlign: 'center' },
  slideCount: { color: 'rgba(255,255,255,0.7)', fontSize: 13 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 8 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  dotActive: { backgroundColor: '#FFFFFF' },
  dotInactive: { backgroundColor: 'rgba(255,255,255,0.3)' },
  slideContainer: { flex: 1, paddingHorizontal: 20 },
  slideScroll: { alignItems: 'center', paddingTop: 16, paddingBottom: 20 },
  slideEmoji: { fontSize: 72, marginBottom: 16 },
  slideTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  bodyCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    padding: 20,
    width: width - 40,
  },
  slideBody: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 26,
    textAlign: 'left',
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 12,
    gap: 12,
  },
  prevBtn: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  prevText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
  nextBtn: {
    flex: 2,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  nextText: { color: '#FFFFFF', fontWeight: '800', fontSize: 15 },
});
