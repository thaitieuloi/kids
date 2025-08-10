import { useNavigation } from '@react-navigation/native';
import { Audio } from 'expo-av';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const question = {
  image: require('../../assets/images/toan/lop-01/bai-01/ot-chuong-3.png'),
  audio: 'https://www.luyenthi123.com/file/luyenthi123/lop1/audio/bai_3642/ch532.mp3', // Giả định
  correctAnswer: 3,
  options: [1, 2, 3, 4],
  text: 'Hình trên có mấy quả ớt chuông?',
};

export default function CountingWithFillBlankScreen() {
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<null | boolean>(null);
  const navigation = useNavigation();

  const checkAnswer = () => {
    if (selected !== null) setResult(selected === question.correctAnswer);
  };

  const playAudio = async () => {
    const { sound } = await Audio.Sound.createAsync({ uri: question.audio });
    await sound.playAsync();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={playAudio} style={styles.playBtn}>
        <Text style={styles.playText}>▶️</Text>
      </TouchableOpacity>

      <Image source={question.image} style={styles.image} />

      <Text style={styles.question}>{question.text}</Text>

      <Text style={styles.fillText}>
        Hình trên có{' '}
        <Text style={styles.blankBox}>{selected !== null ? selected : ' '}</Text>{' '}
        quả ớt chuông.
      </Text>

      <View style={styles.options}>
        {question.options.map(num => (
          <TouchableOpacity
            key={num}
            onPress={() => setSelected(num)}
            style={[
              styles.optionBtn,
              selected === num && styles.selectedBtn,
            ]}>
            <Text style={styles.optionText}>{num}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity onPress={checkAnswer} style={styles.checkBtn}>
        <Text style={styles.checkText}>Kiểm tra</Text>
      </TouchableOpacity>

      

      {result !== null && (
        <Text style={[styles.result, { color: result ? 'green' : 'red' }]}>
          {result ? 'Chính xác! 🎉' : 'Sai rồi, thử lại nhé.'}
        </Text>
      )}
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
    flex: 1,
    alignItems: 'center',
  },
  playBtn: {
    position: 'absolute',
    top: 30,
    left: 20,
  },
  playText: {
    fontSize: 30,
  },
  image: {
    width: 220,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  question: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  fillText: {
    fontSize: 18,
    marginBottom: 20,
  },
  blankBox: {
    borderBottomWidth: 2,
    borderColor: '#FFA500',
    paddingHorizontal: 10,
  },
  options: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  optionBtn: {
    borderWidth: 2,
    borderColor: '#999',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  selectedBtn: {
    backgroundColor: '#00BFFF',
    borderColor: '#00BFFF',
  },
  optionText: {
    fontSize: 18,
    color: '#000',
  },
  checkBtn: {
    backgroundColor: '#FFC107',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 20,
    marginTop: 10,
  },
  checkText: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
  },
  result: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: '600',
  },
});
