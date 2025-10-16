import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({
  onSendMessage,
  disabled = false,
}: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={message}
        onChangeText={setMessage}
        placeholder="Ask your hair coach anything..."
        placeholderTextColor="#9BA1A6"
        multiline
        maxLength={500}
        editable={!disabled}
      />
      <Pressable
        onPress={handleSend}
        style={[
          styles.sendButton,
          (!message.trim() || disabled) && styles.sendButtonDisabled,
        ]}
        disabled={!message.trim() || disabled}
      >
        <Text
          style={[
            styles.sendText,
            (!message.trim() || disabled) && styles.sendTextDisabled,
          ]}
        >
          Send
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 16,
    backgroundColor: "#1A1A1A",
    borderTopWidth: 1,
    borderTopColor: "#333333",
  },
  input: {
    flex: 1,
    backgroundColor: "#333333",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: "#FFFFFF",
    fontSize: 16,
    maxHeight: 100,
    marginRight: 12,
  },
  sendButton: {
    backgroundColor: "#6C63FF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "#555555",
  },
  sendText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  sendTextDisabled: {
    color: "#999999",
  },
});
