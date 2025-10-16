import * as Network from "expo-network";
import { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";

interface QRCodeDisplayProps {
  onClose?: () => void;
}

export default function QRCodeDisplay({ onClose }: QRCodeDisplayProps) {
  const [serverUrl, setServerUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getServerUrl();
  }, []);

  const getServerUrl = async () => {
    try {
      // Get the local IP address
      const ipAddress = await Network.getIpAddressAsync();
      // Default Expo development server port
      const port = "8081";
      const url = `exp://${ipAddress}:${port}`;
      setServerUrl(url);
      setIsLoading(false);
    } catch (error) {
      console.error("Error getting server URL:", error);
      Alert.alert(
        "Error",
        "Could not get server URL. Please check your network connection."
      );
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      // For React Native, we'll use a simple alert for now
      // In a real app, you'd use expo-clipboard
      Alert.alert("URL Copied", `Server URL: ${serverUrl}`);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading QR Code...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Scan to Connect</Text>
        {onClose && (
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.qrContainer}>
        <QRCode
          value={serverUrl}
          size={200}
          color="#000000"
          backgroundColor="#FFFFFF"
        />
      </View>

      <Text style={styles.urlText}>{serverUrl}</Text>

      <Pressable onPress={copyToClipboard} style={styles.copyButton}>
        <Text style={styles.copyText}>Copy URL</Text>
      </Pressable>

      <Text style={styles.instructions}>
        Scan this QR code with your phone's camera or Expo Go app to connect to
        the development server.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 30,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#333333",
    justifyContent: "center",
    alignItems: "center",
  },
  closeText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  qrContainer: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  urlText: {
    color: "#9C89FF",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  copyButton: {
    backgroundColor: "#6C63FF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginBottom: 20,
  },
  copyText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  instructions: {
    color: "#CCCCCC",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  loadingText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});
