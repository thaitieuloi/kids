import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';
import { useQuizState } from '../../hooks/useQuizState';
import { playCorrect, playDing, playWrong } from '../../utils/audioPlayer';


export default function CountingWithQuizScreen() {
  const { state, dispatch, startStepTimer, clearTimer } = useQuizState();
  const { playAudio } = useAudioPlayer(state.quiz.steps[state.stepIndex].soundUris, (error) =>
    dispatch({ type: 'SET_ERROR', payload: error.message }),
  );
  const starOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
    if (!state.hasStarted) return;

    let cancelled = false;
    const start = async () => {
        try {
        await playDing();
        if (!cancelled) startStepTimer();
        } catch (err) {
        // playAudio đã gọi dispatch SET_ERROR nên không cần thêm gì
        }
    };

    start();

    return () => {
        cancelled = true;
        clearTimer();
    };
    }, [state.stepIndex, state.quiz, state.hasStarted]);

    useEffect(() => {
    if (state.result === 'correct') {
        console.log('🎉 Animation should play!');
        playCorrect();
        Animated.sequence([
        Animated.timing(starOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(starOpacity, { toValue: 0, duration: 500, useNativeDriver: true }),
        ]).start();
    } else if (state.result === 'incorrect') {
        playWrong(); // 🔈 Phát âm sai
    }
    }, [state.result]);

  const handleCheck = () => {
    dispatch({ type: 'CHECK_ANSWER' });
  };

  const handleRetry = () => {
    dispatch({ type: 'RETRY' });
  };

  if (!state.hasStarted) {
    return (
        <View style={styles.container}>
        <Text style={styles.title}>Giải toán</Text>
        <TouchableOpacity
            onPress={() => dispatch({ type: 'START' })}
            style={styles.checkBtn}
        >
            <Text style={styles.checkText}>Bắt đầu</Text>
        </TouchableOpacity>
        </View>
    );
    }

  return (
    
    <View style={styles.container}>
      <Text style={styles.title}>Giải toán</Text>

      {state.error && <Text style={styles.errorText}>Lỗi: {state.error}</Text>}


      {state.quiz.steps.slice(0, state.stepIndex ).map((s, i) => (
        <Text key={i} style={styles.questionText}>
          {s.display}
        </Text>
      ))}

      {state.stepIndex === state.quiz.steps.length - 1 && (
        <>
          <Text style={styles.questionText}>--------------------</Text>
          <Text style={styles.questionText}>
            {state.result !== null ? `= ${state.quiz.correct}` : '= ?'}
          </Text>
        </>
      )}


      {state.stepIndex === state.quiz.steps.length - 1 && state.result === null && (
        <>
          <View style={styles.options}>
            {state.quiz.options.map((opt) => (
              <TouchableOpacity
                key={opt}
                onPress={() => dispatch({ type: 'SELECT_OPTION', payload: opt })}
                style={[styles.optionBtn, state.selected === opt && styles.optionSelected]}
              >
                <Text style={styles.optionText}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            onPress={handleCheck}
            style={[styles.checkBtn, !state.selected && styles.checkBtnDisabled]}
            disabled={!state.selected}
          >
            <Text style={styles.checkText}>Kiểm tra</Text>
          </TouchableOpacity>
        </>
      )}

      {state.result !== null && (
        <>
          <Text
            style={[styles.resultText, { color: state.result === 'correct' ? 'green' : 'red' }]}
          >
            {state.result === 'correct' ? '🎉 Chính xác!' : '❌ Sai rồi, thử lại nhé.'}
          </Text>
          <TouchableOpacity onPress={handleRetry} style={styles.retryBtn}>
            <Text style={styles.retryText}>Tiếp tục 🔁</Text>
          </TouchableOpacity>
        </>
      )}

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
  questionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  questionText: {
    fontSize: 26,
    marginHorizontal: 4,
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
  checkBtnDisabled: {
    backgroundColor: '#ccc',
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
  resultText: {
    marginTop: 15,
    fontSize: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 10,
  },
});