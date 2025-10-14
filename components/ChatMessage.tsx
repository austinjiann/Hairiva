import { ChatMessage as ChatMessageType } from "@/services/gemini";
import { StyleSheet, Text, View } from "react-native";

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  return (
    <View
      style={[
        styles.container,
        message.isUser ? styles.userMessage : styles.botMessage,
      ]}
    >
      <Text
        style={[styles.text, message.isUser ? styles.userText : styles.botText]}
      >
        {message.text}
      </Text>
      <Text
        style={[
          styles.timestamp,
          message.isUser ? styles.userTimestamp : styles.botTimestamp,
        ]}
      >
        {message.timestamp.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 16,
    marginVertical: 4,
    marginHorizontal: 16,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#6C63FF",
    borderBottomRightRadius: 4,
  },
  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#333333",
    borderBottomLeftRadius: 4,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: "#FFFFFF",
  },
  botText: {
    color: "#FFFFFF",
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
    opacity: 0.7,
  },
  userTimestamp: {
    color: "#FFFFFF",
    textAlign: "right",
  },
  botTimestamp: {
    color: "#CCCCCC",
    textAlign: "left",
  },
});
