import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function TypingIndicator() {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev === "...") return "";
        return prev + ".";
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.bubble}>
        <Text style={styles.text}>Coach is typing{dots}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-start",
    marginVertical: 4,
    marginHorizontal: 16,
  },
  bubble: {
    backgroundColor: "#333333",
    padding: 12,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
  },
  text: {
    color: "#CCCCCC",
    fontSize: 14,
    fontStyle: "italic",
  },
});
