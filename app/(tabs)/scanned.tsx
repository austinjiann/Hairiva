import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function ScannedScreen() {
  const { uri } = useLocalSearchParams<{ uri?: string }>();

  return (
    <View style={styles.container}>
      <Pressable accessibilityRole="button" onPress={() => router.replace('/(tabs)/photo')} style={styles.backBtn}>
        <Text style={styles.backIcon}>{'‹'}</Text>
      </Pressable>

      <View style={styles.avatarWrap}>
        {uri ? (
          <Image source={{ uri: String(uri) }} style={styles.avatar} contentFit="cover" />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]} />
        )}
      </View>

      <Text style={styles.scoreLabel}>Score: 70</Text>

      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <Text style={styles.metricTitle}>Hair Compatibility</Text>
          <Text style={styles.metricValue}>70/100</Text>
        </View>
        <View style={styles.track}>
          <View style={[styles.fill, { width: '70%' }]} />
        </View>

        <Text style={styles.subtle}>With Hairiva</Text>
        <View style={styles.rowBetween}>
          <Text style={styles.metricTitle}>Potential</Text>
          <Text style={styles.metricValue}>95/100</Text>
        </View>
        <View style={styles.track}>
          <View style={[styles.fill, { width: '95%' }]} />
        </View>
      </View>

      <Pressable style={({ pressed }) => [styles.nextBtn, pressed && { opacity: 0.9 }]}>
        <Text style={styles.nextText}>Understand Analysis</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    paddingTop: 100,
    paddingHorizontal: 20,
  },
  backBtn: {
    position: 'absolute',
    top: 92,
    left: 14,
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    color: '#FFFFFF',
    fontSize: 36,
    lineHeight: 36,
  },
  avatarWrap: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  avatar: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#D9D9D9',
  },
  avatarPlaceholder: {
    borderWidth: 0,
  },
  scoreLabel: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#222222',
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  metricValue: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  subtle: {
    color: '#9BA1A6',
    marginTop: 6,
    marginBottom: -4,
    fontWeight: '800',
  },
  track: {
    height: 24,
    borderRadius: 12,
    backgroundColor: '#D9D9D9',
    overflow: 'hidden',
    marginTop: 6,
    marginBottom: 6,
  },
  fill: {
    height: '100%',
    backgroundColor: '#6C63FF',
    borderRadius: 12,
  },
  nextBtn: {
    backgroundColor: '#6C63FF',
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 24,
    alignSelf: 'stretch',
  },
  nextText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
});


