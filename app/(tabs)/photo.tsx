import { analyzeHairMatch } from '@/services/analysis';
import { saveSession } from '@/services/session';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native';

export default function PhotoScreen() {
  const [selectedUri, setSelectedUri] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const ensurePermissions = useCallback(async () => {
    const camera = await ImagePicker.requestCameraPermissionsAsync();
    const media = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const granted = camera.status === 'granted' && media.status === 'granted';
    if (!granted) {
      Alert.alert('Permissions needed', 'Please enable camera and photo permissions.');
    }
    return granted;
  }, []);

  const openCamera = useCallback(async () => {
    const ok = await ensurePermissions();
    if (!ok) return;
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
      aspect: [3, 4], // allow both front and profile; user can rotate or frame accordingly
    });
    if (result.canceled) return;
    const uri = result.assets[0].uri;
    setSelectedUri(uri);
    try {
      setIsAnalyzing(true);
      const outcome = await analyzeHairMatch(uri);
      if (!outcome.ok) {
        const msg = outcome.reason === 'no_face' ? 'No clear face with hair detected. Please rescan.' : 'Analysis failed. Please try again.';
        Alert.alert('Scan issue', msg);
        return;
      }
      const { average, metrics, faceShapeLabel, hairTypeLabel } = outcome;
      await saveSession({ uri, average, metrics });
      router.push({ pathname: '/(tabs)/scanned', params: { uri, score: String(average), metrics: JSON.stringify(metrics), face: faceShapeLabel, hair: hairTypeLabel } });
    } finally {
      setIsAnalyzing(false);
    }
  }, [ensurePermissions]);

  const openLibrary = useCallback(async () => {
    const ok = await ensurePermissions();
    if (!ok) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
      aspect: [3, 4],
    });
    if (result.canceled) return;
    const uri = result.assets[0].uri;
    setSelectedUri(uri);
    try {
      setIsAnalyzing(true);
      const outcome = await analyzeHairMatch(uri);
      if (!outcome.ok) {
        const msg = outcome.reason === 'no_face' ? 'No clear face with hair detected. Please rescan.' : 'Analysis failed. Please try again.';
        Alert.alert('Scan issue', msg);
        return;
      }
      const { average, metrics, faceShapeLabel, hairTypeLabel } = outcome;
      await saveSession({ uri, average, metrics });
      router.push({ pathname: '/(tabs)/scanned', params: { uri, score: String(average), metrics: JSON.stringify(metrics), face: faceShapeLabel, hair: hairTypeLabel } });
    } finally {
      setIsAnalyzing(false);
    }
  }, [ensurePermissions]);

  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="button"
        onPress={() => router.replace('/')}
        style={styles.backBtn}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <Text style={styles.backIcon}>{'‹'}</Text>
      </Pressable>

      <Text style={styles.title}>Take a front or side picture</Text>

      <View style={styles.gridWrapper}>
        <View style={styles.gridRow}>
          <Image source={require('@/public/man-1.jpg')} style={styles.gridImage} contentFit="cover" />
          <Image source={require('@/public/man-2.jpg')} style={styles.gridImage} contentFit="cover" />
        </View>
        <View style={styles.gridRow}>
          <Image source={require('@/public/man-3.jpg')} style={styles.gridImage} contentFit="cover" />
          <Image source={require('@/public/man-4.jpg')} style={styles.gridImage} contentFit="cover" />
        </View>
      </View>

      <Pressable onPress={openCamera} style={({ pressed }) => [styles.ctaPrimary, pressed && { opacity: 0.9 }]}>
        <Text style={styles.ctaPrimaryText}>Take a Selfie</Text>
      </Pressable>

      <Pressable onPress={openLibrary} style={({ pressed }) => [styles.ctaSecondary, pressed && { opacity: 0.9 }]}>
        <Text style={styles.ctaSecondaryText}>Upload from Library</Text>
      </Pressable>


      {isAnalyzing && (
        <View style={styles.overlay}> 
          <ActivityIndicator size="large" color="#6C63FF" />
          <Text style={styles.overlayText}>Analyzing your photo...</Text>
          <Text style={styles.overlaySub}>Detecting face and hair</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    paddingTop: 65,
    paddingHorizontal: 20,
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
  backBtn: {
    position: 'absolute',
    top: 74,
    left: 14,
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  backIcon: {
    color: '#FFFFFF',
    fontSize: 36,
    lineHeight: 36,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  brand: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
    textAlign: 'center',
    marginVertical: 20,
  },
  gridWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  gridRow: {
    flexDirection: 'row',
  },
  gridImage: {
    width: 160,
    height: 240,
  },
  ctaPrimary: {
    backgroundColor: '#6C63FF',
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 24,
    width: 320,
    alignSelf: 'center',
  },
  ctaPrimaryText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  ctaSecondary: {
    backgroundColor: '#202020',
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 12,
    width: 320,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#333333',
  },
  ctaSecondaryText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  previewWrapper: {
    marginTop: 20,
    alignSelf: 'center',
  },
  previewLabel: {
    color: '#9BA1A6',
    textAlign: 'center',
    marginBottom: 8,
  },
  preview: {
    width: 200,
    height: 260,
    borderRadius: 12,
  },
  backLink: {
    position: 'absolute',
    top: 20,
    right: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#333333',
  },
  backText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});


