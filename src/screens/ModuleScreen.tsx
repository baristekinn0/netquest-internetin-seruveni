import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { ModulesStackParamList } from '../types';
import { MODULES } from '../data/modules';

type Props = {
  navigation: StackNavigationProp<ModulesStackParamList, 'Module'>;
  route: RouteProp<ModulesStackParamList, 'Module'>;
};

export default function ModuleScreen({ navigation, route }: Props) {
  const { moduleId } = route.params;
  const mod = MODULES.find((m) => m.id === moduleId)!;
  const [currentSlide, setCurrentSlide] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const goToSlide = (next: number) => {
    Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => {
      setCurrentSlide(next);
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    });
  };

  const slide = mod.slides[currentSlide];
  const isLast = currentSlide === mod.slides.length - 1;

  return (
    <LinearGradient colors={mod.gradientColors} style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={[styles.header, isLandscape && styles.headerLandscape]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{mod.title}</Text>
        <Text style={styles.slideCount}>{currentSlide + 1}/{mod.slides.length}</Text>
      </View>

      <View style={styles.dots}>
        {mod.slides.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i <= currentSlide ? styles.dotActive : styles.dotInactive]}
          />
        ))}
      </View>

      <Animated.View style={[styles.slideContainer, { opacity: fadeAnim }]}>
        {isLandscape ? (
          <View style={styles.landscapeLayout}>
            <View style={styles.landscapeLeft}>
              <Text style={styles.slideEmoji}>{slide.emoji}</Text>
              <Text style={styles.slideTitle}>{slide.title}</Text>
            </View>
            <ScrollView style={styles.landscapeRight} showsVerticalScrollIndicator={false}>
              <View style={[styles.bodyCard, { width: width / 2 - 32 }]}>
                <Text style={styles.slideBody}>{slide.body}</Text>
              </View>
            </ScrollView>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.slideScroll} showsVerticalScrollIndicator={false}>
            <Text style={styles.slideEmoji}>{slide.emoji}</Text>
            <Text style={styles.slideTitle}>{slide.title}</Text>
            <View style={[styles.bodyCard, { width: width - 40 }]}>
              <Text style={styles.slideBody}>{slide.body}</Text>
            </View>
          </ScrollView>
        )}
      </Animated.View>

      <View style={[styles.navRow, isLandscape && styles.navRowLandscape]}>
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
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  headerLandscape: { paddingTop: 16 },
  backBtn: { padding: 4 },
  backText: { color: 'rgba(255,255,255,0.8)', fontSize: 15 },
  headerTitle: { color: '#FFFFFF', fontWeight: '800', fontSize: 16, flex: 1, textAlign: 'center' },
  slideCount: { color: 'rgba(255,255,255,0.7)', fontSize: 13 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 8 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  dotActive: { backgroundColor: '#FFFFFF' },
  dotInactive: { backgroundColor: 'rgba(255,255,255,0.3)' },
  slideContainer: { flex: 1, paddingHorizontal: 20 },
  slideScroll: { alignItems: 'center', paddingTop: 12, paddingBottom: 20 },
  landscapeLayout: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 16 },
  landscapeLeft: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  landscapeRight: { flex: 1 },
  slideEmoji: { fontSize: 64, marginBottom: 12 },
  slideTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  bodyCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    padding: 18,
  },
  slideBody: {
    fontSize: 15,
    color: '#FFFFFF',
    lineHeight: 24,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 36,
    paddingTop: 10,
    gap: 12,
  },
  navRowLandscape: { paddingBottom: 16 },
  prevBtn: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  prevText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  nextBtn: {
    flex: 2,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  nextText: { color: '#FFFFFF', fontWeight: '800', fontSize: 14 },
});
