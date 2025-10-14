import { Pressable, StyleSheet, Text, View } from "react-native";

interface StarterQuestionsProps {
  onQuestionSelect: (question: string) => void;
}

export default function StarterQuestions({
  onQuestionSelect,
}: StarterQuestionsProps) {
  const questions = [
    "What's the best haircut for my face shape?",
    "What hair colour suits me?",
    "How can I make my hair look thicker?",
    "What products should I use for my hair type?",
    "How often should I wash my hair?",
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quick Questions</Text>
      <View style={styles.questionsGrid}>
        {questions.map((question, index) => (
          <Pressable
            key={index}
            onPress={() => onQuestionSelect(question)}
            style={({ pressed }) => [
              styles.questionButton,
              pressed && styles.questionButtonPressed,
            ]}
          >
            <Text style={styles.questionText}>{question}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#1A1A1A",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  questionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  questionButton: {
    backgroundColor: "#333333",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#555555",
  },
  questionButtonPressed: {
    backgroundColor: "#444444",
  },
  questionText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
});
