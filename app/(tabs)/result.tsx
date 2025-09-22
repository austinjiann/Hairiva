import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ResultScreen() {
  const { uri } = useLocalSearchParams<{ uri?: string }>();

  // Individual metrics that average to 97
  const metrics = [
    { label: 'Face Shape', value: 98 },
    { label: 'Facial Ratio', value: 96 },
    { label: 'Hair Type', value: 97 },
    { label: 'Jawline', value: 98 },
    { label: 'Hairline', value: 96 },
    { label: 'Ear Shape', value: 98 },
  ];

  const avg = Math.round(metrics.reduce((a, m) => a + m.value, 0) / metrics.length);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.avatarWrap}>
        {uri ? (
          <Image source={{ uri: String(uri) }} style={styles.avatar} contentFit="cover" />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]} />
        )}
      </View>

      <Text style={styles.scoreLabel}>Score: <Text style={styles.scoreValue}>{avg}</Text></Text>

      <View style={styles.card}>
        <View style={styles.grid}>
          {metrics.map((m) => (
            <View key={m.label} style={styles.cell}>
              <Text style={styles.metricTitle}>{m.label}</Text>
              <View style={styles.valueRow}>
                <Text style={styles.metricBig}>{m.value}</Text>
                <Text style={styles.metricOutOf}>/100</Text>
              </View>
              <View style={styles.track}><View style={[styles.fill, { width: `${m.value}%` }]} /></View>
            </View>
          ))}
        </View>
      </View>

      <Pressable style={({ pressed }) => [styles.ctaPrimary, pressed && { opacity: 0.95 }]}>
        <Text style={styles.ctaPrimaryText}>How to achieve this look</Text>
      </Pressable>

      <Pressable onPress={() => router.replace('/(tabs)')} style={({ pressed }) => [styles.ctaSecondary, pressed && { opacity: 0.95 }]}>
        <Text style={styles.ctaSecondaryText}>Try Again</Text>
      </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    paddingTop: 70,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  avatarWrap: {
    alignSelf: 'center',
    width: 240,
    aspectRatio: 1,
    borderRadius: 120,
    overflow: 'hidden',
    backgroundColor: '#D9D9D9',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
  },
  scoreLabel: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 12,
  },
  scoreValue: {
    color: '#FFFFFF',
  },
  card: {
    backgroundColor: '#222222',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 22,
    marginTop: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 18,
  },
  cell: {
    width: '48%',
  },
  metricTitle: {
    color: '#D9D9D9',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  metricBig: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
  metricOutOf: {
    color: '#D9D9D9',
    fontSize: 12,
    fontWeight: '800',
  },
  track: {
    height: 16,
    borderRadius: 8,
    backgroundColor: '#D9D9D9',
    overflow: 'hidden',
    marginTop: 6,
  },
  fill: {
    height: '100%',
    backgroundColor: '#6C63FF',
    borderRadius: 8,
  },
  ctaPrimary: {
    backgroundColor: '#6C63FF',
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 18,
  },
  ctaPrimaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  ctaSecondary: {
    backgroundColor: '#2A2A2A',
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 12,
  },
  ctaSecondaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});


