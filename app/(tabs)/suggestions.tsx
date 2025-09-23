import { generateHairImages } from '@/services/generation';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function SuggestionsScreen() {
  const { face, hair, uri } = useLocalSearchParams<{ face?: string; hair?: string; uri?: string }>();
  const faceLabel = (face ? String(face) : '__').trim();
  const hairLabel = (hair ? String(hair) : '__').trim();
  const article = /^[aeiou]/i.test(faceLabel) ? 'an' : 'a';
  const [prompt, setPrompt] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [changed, setChanged] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const tiles = images.length > 0 ? images : Array.from({ length: 6 }).map(() => uri ? String(uri) : '');

  async function generateAndProceed() {
    if (!prompt.trim()) {
      Alert.alert('Describe your new look', 'Enter a request like "korean perm" or "mid fade".');
      return;
    }
    try {
      setIsGenerating(true);
      const outs = await generateHairImages(prompt.trim(), uri ? String(uri) : undefined);
      if (!outs.length) {
        Alert.alert('Generation failed', 'Please refine your request and try again.');
        return;
      }
      setImages(outs.slice(0, 6));
      setChanged(true);
      router.push({ pathname: '/(tabs)/result', params: { uri: String(outs[0]) } });
    } catch (e) {
      console.warn('Generation failed', e);
      Alert.alert('Generation failed', 'Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={20}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentInsetAdjustmentBehavior="always" keyboardDismissMode="on-drag">
        <View style={styles.headerRow}>
          <Pressable accessibilityRole="button" onPress={() => router.replace('/(tabs)/analysis')} style={styles.backBtn}>
            <Text style={styles.backIcon}>{'‹'}</Text>
          </Pressable>
          <Text style={styles.title}>find your hairstyle</Text>
        </View>
        <Text style={styles.subtitle}>
          With {article} <Text style={styles.underline}>{faceLabel}</Text> face shape and <Text style={styles.underline}>{hairLabel}</Text> hair,
          {'\n'}you should try:
        </Text>

        <View style={styles.grid}>
          {tiles.map((src, idx) => (
            <View key={idx} style={styles.tile}>
              <View style={styles.imageWrap}>
                {src ? (
                  <Image source={{ uri: src }} style={styles.tileImage} contentFit="cover" />
                ) : (
                  <View style={[styles.tileImage, styles.imagePlaceholder]} />
                )}
              </View>
              <Text style={styles.tileLabel}>Label 1</Text>
            </View>
          ))}
        </View>

        <View style={styles.freeFormRow}>
          <Text style={styles.freeFormPrompt}>Want something else?</Text>
          <TextInput
            value={prompt}
            onChangeText={setPrompt}
            placeholder="e.g., korean perm, fade, layered curls"
            placeholderTextColor="#A6A6A6"
            style={styles.freeFormInput}
            returnKeyType="done"
          />
        </View>

        <Pressable
          onPress={generateAndProceed}
          style={({ pressed }) => [styles.cta, pressed && { opacity: 0.9 }]}
        > 
          <Text style={styles.ctaText}>View Transformation</Text>
        </Pressable>
        {isGenerating && (
          <View style={styles.overlay}>
            <ActivityIndicator size="large" color="#6C63FF" />
            <Text style={styles.overlayText}>Transforming your hairstyle...</Text>
            <Text style={styles.overlaySub}>This may take a few seconds</Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  backBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    color: '#FFFFFF',
    fontSize: 40,
    lineHeight: 40,
  },
  content: {
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    marginTop: 30,
    marginLeft: -18,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'left',
  },
  subtitle: {
    color: '#A6A6A6',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: -12,
  },
  underline: {
    textDecorationLine: 'underline',
  },
  inlineDim: {
    color: '#D9D9D9',
  },
  grid: {
    marginTop: 16,
    backgroundColor: '#222222',
    borderRadius: 16,
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  tile: {
    width: '48%',
    marginBottom: 24,
    alignItems: 'center',
  },
  imageWrap: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#2E2E2E',
  },
  tileImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    borderWidth: 1,
    borderColor: '#3D3D3D',
  },
  tileLabel: {
    color: '#FFFFFF',
    marginTop: 8,
    fontWeight: '800',
  },
  freeFormRow: {
    marginTop: 24,
    paddingHorizontal: 4,
  },
  freeFormPrompt: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'left',
    marginBottom: 10,
  },
  freeFormInput: {
    borderWidth: 1,
    borderColor: '#3D3D3D',
    backgroundColor: '#222222',
    color: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  genBtn: {
    display: 'none',
  },
  genBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  overlayText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 8,
  },
  overlaySub: {
    color: '#D9D9D9',
    fontSize: 14,
    fontWeight: '700',
  },
  cta: {
    backgroundColor: '#6C63FF',
    paddingVertical: 18,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 18,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
});


