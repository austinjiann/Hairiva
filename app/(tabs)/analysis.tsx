import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

export default function AnalysisScreen() {
  const { uri } = useLocalSearchParams<{ uri?: string }>();
  const { height } = useWindowDimensions();
  const avatarOffset = Math.max(8, height * 0.05); // nudge slightly more, relative to screen size

  return (
    <View style={styles.container}>
      <Pressable accessibilityRole="button" onPress={() => router.replace('/(tabs)/scanned')} style={styles.backBtn}>
        <Text style={styles.backIcon}>{'‹'}</Text>
      </Pressable>

      <View style={styles.headerRow}>
        <View style={[
          styles.avatarSmallWrap,
          { transform: [{ translateY: avatarOffset }] },
        ]}>
          {uri ? (
            <Image source={{ uri: String(uri) }} style={styles.avatarSmall} contentFit="cover" />
          ) : (
            <View style={[styles.avatarSmall, styles.avatarPlaceholder]} />
          )}
        </View>
        <Text style={styles.headerTitle}>Hair Compatibility</Text>
        <View style={styles.valueRow}>
          <Text style={styles.metricBig}>70</Text>
          <Text style={styles.metricOutOf}>/100</Text>
        </View>
      </View>
      <View style={styles.trackLarge}><View style={[styles.fillLarge, { width: '70%' }]} /></View>

      <Text style={styles.subTitle}>hair compatibility with facial features:</Text>

      <View style={styles.card}>
        <View style={styles.grid}>
          {[
            'Face Shape',
            'Facial Ratio',
            'Hair Type',
            'Jawline',
            'Hairline',
            'Ear Shape',
          ].map((label, idx) => (
            <View key={label} style={styles.cell}>
              <Text style={styles.metricTitle}>{label}</Text>
              <View style={styles.valueRow}>
                <Text style={styles.metricBig}>65</Text>
                <Text style={styles.metricOutOf}>/100</Text>
              </View>
              <View style={styles.trackSmall}><View style={[styles.fillSmall, { width: '65%' }]} /></View>
            </View>
          ))}
        </View>
      </View>

      <Pressable
        onPress={() =>
          router.push(
            uri
              ? { pathname: '/(tabs)/suggestions', params: { uri: String(uri) } }
              : '/(tabs)/suggestions'
          )
        }
        style={({ pressed }) => [styles.cta, pressed && { opacity: 0.9 }]}
      >
        <Text style={styles.ctaText}>Glow Up</Text>
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
    top: 97,
    left: 5,
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
  },
  backIcon: {
    color: '#FFFFFF',
    fontSize: 36,
    lineHeight: 36,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  avatarSmallWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#D9D9D9',
    overflow: 'hidden',
  },
  avatarSmall: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
  },
  avatarPlaceholder: {
    borderWidth: 0,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    flex: 1,
  },
  headerValue: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
  },
  trackLarge: {
    height: 24,
    borderRadius: 12,
    backgroundColor: '#D9D9D9',
    overflow: 'hidden',
    marginBottom: 16,
    // Start the bar to the right of the avatar so it's not full-width
    marginLeft: 56,
    marginTop: 8,
  },
  fillLarge: {
    height: '100%',
    backgroundColor: '#6C63FF',
    borderRadius: 12,
  },
  card: {
    backgroundColor: '#222222',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 28,
    minHeight: 360,
    marginTop: 30,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 16,
    rowGap: 35,
  },
  cell: {
    width: '47%',
  },
  metricTitle: {
    color: '#D9D9D9',
    fontSize: 18,
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
    fontSize: 28,
    fontWeight: '900',
  },
  metricOutOf: {
    color: '#D9D9D9',
    fontSize: 18,
    fontWeight: '800',
  },
  trackSmall: {
    height: 24,
    borderRadius: 12,
    backgroundColor: '#D9D9D9',
    overflow: 'hidden',
    marginTop: 6,
  },
  fillSmall: {
    height: '100%',
    backgroundColor: '#6C63FF',
    borderRadius: 12,
  },
  subTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    marginTop:6,
    marginVertical: -6,
  },
  cta: {
    backgroundColor: '#6C63FF',
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 24,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
});


