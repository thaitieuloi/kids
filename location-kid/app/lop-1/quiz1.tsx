import { useNavigation } from '@react-navigation/native';
import { Audio } from 'expo-av';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Animated, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const quizExample = {
  prompt: require('../../assets/images/toan/lop-01/bai-01/chim-canh-cut-01.jpg'), // Hình 1 chú chim
  correct: 1,
  options: [0, 1, 2, 3],
  questionAudio: 'https://www.luyenthi123.com/file/luyenthi123/lop1/audio/bai_3642/ch531.mp3',
};

export default function CountingWithQuizScreen() {
  const navigation = useNavigation();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const starOpacity = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  const [selected, setSelected] = useState(null);
  const [quizResult, setQuizResult] = useState(null);

  const playQuestionSound = async () => {
    const { sound } = await Audio.Sound.createAsync({ uri: quizExample.questionAudio });
    await sound.playAsync();
  };

  const checkQuiz = () => {
    setQuizResult(selected === quizExample.correct);
  };

  const animate = () => {
    Animated.sequence([
      Animated.timing(starOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(starOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Câu 1</Text>

      {/* Nút phát audio */}
      <TouchableOpacity onPress={playQuestionSound} style={styles.audioButton}>
        <Text style={styles.audioIcon}>🔊</Text>
      </TouchableOpacity>

      {/* Câu hỏi */}
      <Text style={styles.questionText}>Có mấy chú chim cánh cụt?</Text>
      <Image source={quizExample.prompt} style={styles.image} />

      {/* Các lựa chọn */}
      <View style={styles.options}>
        {quizExample.options.map((option) => (
          <TouchableOpacity
            key={option}
            onPress={() => setSelected(option)}
            style={[
              styles.optionBtn,
              selected === option && styles.optionSelected
            ]}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Nút kiểm tra */}
      <TouchableOpacity onPress={checkQuiz} style={styles.checkBtn}>
        <Text style={styles.checkText}>Kiểm tra</Text>
      </TouchableOpacity>

      {/* Kết quả */}
      {quizResult != null && (
        <Text style={{ marginTop: 10, fontSize: 18 }}>
          {quizResult ? 'Chính xác! 🎉' : 'Sai rồi, thử lại nhé.'}
        </Text>
      )}

      {/* Nút tiếp tục nếu đúng */}
      {quizResult === true && (
        <TouchableOpacity onPress={() => router.push('/lop-1/quiz2')} style={styles.nextBtn}>
          <Text style={styles.nextText}>Tiếp tục ➡️</Text>
        </TouchableOpacity>
      )}

      {/* Hiệu ứng sao */}
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
    padding: 20
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FF6F00',
  },
  audioButton: {
    backgroundColor: '#FFF176',
    borderRadius: 30,
    padding: 10,
    marginBottom: 10,
  },
  audioIcon: {
    fontSize: 24,
  },
  questionText: {
    fontSize: 20,
    marginBottom: 10,
  },
  image: {
    width: 200,
    height: 130,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  options: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 10,
  },
  optionBtn: {
    borderWidth: 1,
    borderColor: '#FFA726',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 5,
  },
  optionSelected: {
    backgroundColor: '#29B6F6',
  },
  optionText: {
    fontSize: 18,
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
  nextBtn: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    alignItems: 'center',
  },
  nextText: {
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
