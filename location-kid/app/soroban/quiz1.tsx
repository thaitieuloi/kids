import { Audio } from 'expo-av';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const BASE_AUDIO_URL = 'https://practice.braintalent.edu.vn/GoogleTextToSpeech/Audio';

// 🎧 Phát chuỗi audio tuần tự
const playAudioSequence = async (uris: string[]) => {
  for (const uri of uris) {
    const { sound } = await Audio.Sound.createAsync({ uri });
    await sound.playAsync();

    await new Promise((resolve) => {
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          resolve(null);
        }
      });
    });
  }
};

// 🧠 Ghép audio URL theo phép tính a + b
const getAudioUris = (a: number, b: number): string[] => {
  return [
    `${BASE_AUDIO_URL}/male-${a}.wav`,
    `${BASE_AUDIO_URL}/male-cong-${b}.wav`,
    `${BASE_AUDIO_URL}/male-.wav`,
  ];
};

// 🎲 Tạo quiz cộng ngẫu nhiên trong phạm vi 0–5
const generateQuiz = () => {
  const a = Math.floor(Math.random() * 6);
  const b = Math.floor(Math.random() * 6);
  const correct = a + b;

  const optionsSet = new Set<number>();
  optionsSet.add(correct);

  while (optionsSet.size < 4) {
    const option = Math.floor(Math.random() * 11); // 0 đến 10
    optionsSet.add(option);
  }

  const options = Array.from(optionsSet).sort(() => Math.random() - 0.5);

  return { a, b, correct, options };
};

export default function CountingWithQuizScreen() {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const starOpacity = useRef(new Animated.Value(0)).current;

  const [quiz, setQuiz] = useState(generateQuiz());
  const [selected, setSelected] = useState<number | null>(null);
  const [quizResult, setQuizResult] = useState<null | boolean>(null);

  useEffect(() => {
    const uris = getAudioUris(quiz.a, quiz.b);
    playAudioSequence(uris);
  }, [quiz]);

  const checkQuiz = () => {
    if (selected == null) return;

    const isCorrect = selected === quiz.correct;
    setQuizResult(isCorrect);

    if (isCorrect) {
      Animated.sequence([
        Animated.timing(starOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(starOpacity, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]).start();
    }
  };

  const retry = () => {
    setQuiz(generateQuiz());
    setSelected(null);
    setQuizResult(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Giải toán</Text>

      {/* Phép tính hiển thị */}
      <Text style={styles.questionText}>
        {quiz.a} + {quiz.b} =
      </Text>

      {/* Các lựa chọn */}
      <View style={styles.options}>
        {quiz.options.map((option) => (
          <TouchableOpacity
            key={option}
            onPress={() => setSelected(option)}
            style={[
              styles.optionBtn,
              selected === option && styles.optionSelected,
            ]}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Nút kiểm tra */}
      {quizResult == null && (
        <TouchableOpacity onPress={checkQuiz} style={styles.checkBtn}>
          <Text style={styles.checkText}>Kiểm tra</Text>
        </TouchableOpacity>
      )}

      {/* Kết quả */}
      {quizResult != null && (
        <>
          <Text style={{ marginTop: 15, fontSize: 20, color: quizResult ? 'green' : 'red' }}>
            {quizResult ? '🎉 Chúc mừng bạn đã trả lời đúng!' : 'Sai rồi, thử lại nhé.'}
          </Text>

          <TouchableOpacity onPress={retry} style={styles.retryBtn}>
            <Text style={styles.retryText}>Thử lại 🔁</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Animation sao */}
      <Animated.Text style={[styles.star, { opacity: starOpacity }]}>✨</Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFAF0',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF6F00',
    marginBottom: 20,
  },
  questionText: {
    fontSize: 26,
    marginBottom: 20,
  },
  options: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 10,
    flexWrap: 'wrap',
  },
  optionBtn: {
    borderWidth: 1,
    borderColor: '#FFA726',
    borderRadius: 10,
    padding: 15,
    margin: 5,
    width: 60,
    alignItems: 'center',
  },
  optionSelected: {
    backgroundColor: '#29B6F6',
  },
  optionText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  checkBtn: {
    backgroundColor: '#FFCA28',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  checkText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  retryBtn: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 24,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
  },
  retryText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  star: {
    fontSize: 40,
    position: 'absolute',
    top: 60,
    right: 30,
  },
});
