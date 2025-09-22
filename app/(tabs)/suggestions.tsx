import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function SuggestionsScreen() {
  const { face, hair, uri } = useLocalSearchParams<{ face?: string; hair?: string; uri?: string }>();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Pressable accessibilityRole="button" onPress={() => router.replace('/(tabs)/analysis')} style={styles.backBtn}>
            <Text style={styles.backIcon}>{'‹'}</Text>
          </Pressable>
          <Text style={styles.title}>find your hairstyle</Text>
        </View>
        <Text style={styles.subtitle}>
          With a <Text style={styles.underline}>__</Text> face shape and type hair,
          {'\n'}you should try:
        </Text>

        <View style={styles.grid}>
          {Array.from({ length: 6 }).map((_, idx) => (
            <View key={idx} style={styles.tile}>
              <View style={styles.imageWrap}>
                {uri ? (
                  <Image source={{ uri: String(uri) }} style={styles.tileImage} contentFit="cover" />
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
            placeholder="Enter here..."
            placeholderTextColor="#A6A6A6"
            style={styles.freeFormInput}
          />
        </View>

        <Pressable
          onPress={() =>
            router.push(
              uri
                ? { pathname: '/(tabs)/result', params: { uri: String(uri) } }
                : '/(tabs)/result'
            )
          }
          style={({ pressed }) => [styles.cta, pressed && { opacity: 0.9 }]}
        > 
          <Text style={styles.ctaText}>View Transformation</Text>
        </Pressable>
      </ScrollView>
    </View>
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


