import ChatInput from "@/components/ChatInput";
import ChatMessage from "@/components/ChatMessage";
import StarterQuestions from "@/components/StarterQuestions";
import TypingIndicator from "@/components/TypingIndicator";
import {
  ChatMessage as ChatMessageType,
  geminiService,
} from "@/services/gemini";
import { useEffect, useRef, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";

export default function CoachScreen() {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Add welcome message
    const welcomeMessage: ChatMessageType = {
      id: "welcome",
      text: "What's up! I'm your personal hair coach. I can help you with styling tips, hair care advice, and finding the perfect look for you. Ask me anything!",
      isUser: false,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, []);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    // Show user's message immediately
    const userBubble: ChatMessageType = {
      id: `${Date.now()}-user`,
      text: message,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userBubble]);

    setIsLoading(true);
    setIsTyping(true);

    try {
      await geminiService.sendMessage(message, (bubble) => {
        // Append each AI sentence as it arrives
        setMessages((prev) => [...prev, bubble]);
      });
    } catch (error) {
      console.error("Chat error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleQuestionSelect = (question: string) => {
    handleSendMessage(question);
  };

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Hair Coach</Text>
        <Text style={styles.subtitle}>Your personal styling assistant</Text>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isTyping && <TypingIndicator />}
      </ScrollView>

      {messages.length === 1 && (
        <StarterQuestions onQuestionSelect={handleQuestionSelect} />
      )}

      <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
  },
  subtitle: {
    color: "#9BA1A6",
    marginTop: 4,
    fontSize: 14,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 16,
    paddingBottom: 20,
  },
});
