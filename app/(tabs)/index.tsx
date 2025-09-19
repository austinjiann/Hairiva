import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';


export default function UploadLandingScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('@/public/hairiva-logo.png')}
          style={styles.logo}
          contentFit="contain"
        />
        <Text style={styles.brand}>Hairiva</Text>
      </View>

      <View style={styles.titleBlock}>
        <Text style={styles.title}>Upload a photo to find</Text>
        <Text style={styles.title}>
          your perfect <Text style={styles.highlight}>haircut</Text>
        </Text>
      </View>

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

      <Pressable onPress={() => router.push('/(tabs)/photo')} style={({ pressed }) => [styles.ctaButton, pressed && { opacity: 0.9 }]}> 
        <Text style={styles.ctaText}>Let's Begin</Text>
      </Pressable>

      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    paddingTop: 20,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    position: 'relative',
    top: 10,
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
  titleBlock: {
    marginTop: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
    textAlign: 'center',
  },
  highlight: {
    color: '#9C89FF',
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
  ctaButton: {
    backgroundColor: '#6C63FF',
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 16,
    width: 320,
    alignSelf: 'center',
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  tabBarPlaceholder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  tabItem: {
    alignItems: 'center',
    flex: 1,
  },
  tabIcon: {
    fontSize: 24,
  },
  tabText: {
    color: '#FFFFFF',
    marginTop: 6,
    fontWeight: '700',
  },
});
