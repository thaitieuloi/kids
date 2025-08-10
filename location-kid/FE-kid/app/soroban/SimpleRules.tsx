import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAudioPlayer } from "../../hooks/useAudioPlayer";
import { useQuizState } from "../../hooks/useQuizState";

const { width } = Dimensions.get("window");

const QuizFinished = ({ state, dispatch }) => {
  const handlePlayAgain = () => {
    console.log('QuizFinished: handlePlayAgain called');
    dispatch({ type: "RESET" });
  };

  return (
    <View style={styles.quizContainer}>
      <Text style={styles.title}>Hoàn thành!</Text>
      <View style={styles.greenBox}>
        <Text style={styles.finishedText}>
          Chúc mừng bạn đã hoàn thành bài test.
        </Text>
        <Text style={styles.scoreText}>
          Tổng điểm của bạn là: {state.totalScore}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.retryBtn}
        onPress={handlePlayAgain}
        {...(Platform.OS !== 'web' ? { accessible: true, accessibilityLabel: "Chơi lại bài test" } : {})}
      >
        <Text style={styles.retryText}>Chơi lại 🔁</Text>
      </TouchableOpacity>
    </View>
  );
};

const QuizActive = React.memo(({ state, dispatch }) => {
  console.log('QuizActive: Rendering', { stepIndex: state.stepIndex, result: state.result });
  const starOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    console.log('QuizActive: useEffect triggered', { stepIndex: state.stepIndex, result: state.result });
    if (state.result === "correct") {
      console.time('starAnimation');
      // playCorrect();
      Animated.sequence([
        Animated.timing(starOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(starOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => console.timeEnd('starAnimation'));
    } else if (state.result === "incorrect") {
      console.log('QuizActive: Playing wrong sound');
      // playWrong();
    }
  }, [state.result]);

  const handleCheck = () => {
    console.log('QuizActive: handleCheck called', { selected: state.selected });
    dispatch({ type: "CHECK_ANSWER" });
  };

  const handleNextQuestion = () => {
    console.log('QuizActive: handleNextQuestion called');
    dispatch({ type: "RETRY" });
  };

  const getFontSize = () => {
    const digits = state.settings?.digits || "1d<10";
    if (digits.includes("5d")) return 30;
    if (digits.includes("4d") || digits.includes("3d")) return 36;
    return 50;
  };

  const getStepColor = (index: number) => {
    return index % 2 === 0 ? "#0288D1" : "#F57C00";
  };

  const renderQuestion = useMemo(() => {
    console.time('renderQuestion');
    if (!state.quiz || !state.quiz.steps || state.quiz.steps.length === 0) {
      console.timeEnd('renderQuestion');
      return <Text style={[styles.questionText, { fontSize: getFontSize() }]}>Đang tải...</Text>;
    }

    const isLastStep = state.stepIndex === state.quiz.steps.length - 1;
    const showAnswer = isLastStep && state.result !== null;

    if (showAnswer) {
      const expression = state.quiz.steps.slice(0, -1).map((s, index) => {
        const isFirst = index === 0;
        const parts = s.display.trim().split(' ');
        const number = isFirst ? parts[0] : parts[1];
        const nextStep = index + 1 < state.quiz.steps.length - 1 ? state.quiz.steps[index + 1] : null;
        const operator = nextStep ? nextStep.display.trim().split(' ')[0] : '';
        return (
          <Text key={index} style={{ color: getStepColor(index) }}>
            {number}
            {index < state.quiz.steps.length - 2 ? ` ${operator} ` : ''}
          </Text>
        );
      });
      console.timeEnd('renderQuestion');
      return (
        <Text style={[styles.questionText, { fontSize: getFontSize() }]}>
          {expression} = {state.quiz.correct}
        </Text>
      );
    }

    if (isLastStep) {
      console.timeEnd('renderQuestion');
      return <Text style={[styles.questionText, { fontSize: getFontSize() }]}>Kết quả = ???</Text>;
    }

    const currentStep = state.quiz.steps[state.stepIndex];
    console.timeEnd('renderQuestion');
    return (
      <Text style={[styles.questionText, { fontSize: getFontSize(), color: getStepColor(state.stepIndex) }]}>
        {currentStep?.display}
      </Text>
    );
  }, [state.quiz, state.stepIndex, state.result, state.settings?.digits]);

  return (
    <View style={styles.quizContainer}>
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          Câu hỏi: {state.currentQuestion}/{state.settings?.questions}
        </Text>
        <Text style={styles.statsText}>Điểm: {state.totalScore}</Text>
      </View>

      <Text style={styles.title}>Giải toán</Text>

      {state.error && <Text style={styles.errorText}>Lỗi: {state.error}</Text>}

      <View style={styles.questionContainer}>{renderQuestion}</View>

      {state.stepIndex === state.quiz.steps.length - 1 &&
        state.result === null && (
          <>
            <View style={styles.options}>
              {state.quiz.options.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  onPress={() => {
                    console.log('QuizActive: Option selected', { option: opt });
                    dispatch({ type: "SELECT_OPTION", payload: opt });
                  }}
                  style={[
                    styles.optionBtn,
                    state.selected === opt && styles.optionSelected,
                  ]}
                  {...(Platform.OS !== 'web' ? { accessible: true, accessibilityLabel: `Lựa chọn ${opt}` } : {})}
                >
                  <Text style={[styles.optionText, { fontSize: getFontSize() - 10 }]}>
                    {opt}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              onPress={handleCheck}
              style={[
                styles.checkBtn,
                state.selected === null && styles.checkBtnDisabled,
              ]}
              disabled={state.selected === null}
              {...(Platform.OS !== 'web' ? { accessible: true, accessibilityLabel: "Kiểm tra đáp án" } : {})}
            >
              <Text style={styles.checkText}>Kiểm tra</Text>
            </TouchableOpacity>
          </>
        )}

      {state.result !== null && (
        <>
          <Text
            style={[
              styles.resultText,
              { color: state.result === "correct" ? "green" : "red" },
            ]}
          >
            {state.result === "correct"
              ? "🎉 Chính xác!"
              : "❌ Sai rồi, thử lại nhé."}
          </Text>
          <TouchableOpacity
            onPress={handleNextQuestion}
            style={styles.retryBtn}
            {...(Platform.OS !== 'web' ? { accessible: true, accessibilityLabel: "Tiếp tục câu hỏi tiếp theo" } : {})}
          >
            <Text style={styles.retryText}>Tiếp tục 🔁</Text>
          </TouchableOpacity>
        </>
      )}

      <Animated.Text style={[styles.star, { opacity: starOpacity }]}>
        ✨
      </Animated.Text>
    </View>
  );
});

export default function CountingWithQuizScreen() {
  const [settings, setSettings] = useState({
    simpleRule: "Simple Rules Basic",
    digits: "1d<10",
    typeTest: "Visual",
    randoms: "2",
    speed: "3",
    questions: "5",
    score: "1",
    timeAnswers: "10",
  });
  const [warning, setWarning] = useState<string | null>(null);

  const { state, dispatch, startStepTimer, clearTimer } = useQuizState();

  useAudioPlayer(state.quiz?.steps[state.stepIndex]?.soundUris, (error) => {
    console.log('useAudioPlayer: Error', { error: error.message });
    dispatch({ type: "SET_ERROR", payload: error.message });
  });

  useEffect(() => {
    console.log('CountingWithQuizScreen: useEffect triggered', {
      hasStarted: state.hasStarted,
      stepIndex: state.stepIndex,
      result: state.result,
      isFinished: state.isFinished,
    });
    if (!state.hasStarted || state.result !== null || state.isFinished) return;

    let cancelled = false;
    const start = async () => {
      try {
        console.time('playDing');
        // await playDing();
        console.timeEnd('playDing');
        if (!cancelled) {
          console.log('CountingWithQuizScreen: Starting step timer');
          startStepTimer();
        }
      } catch (err) {
        console.log('CountingWithQuizScreen: Error playing ding', { error: err.message });
        dispatch({ type: "SET_ERROR", payload: "Lỗi phát âm thanh." });
      }
    };

    start();

    return () => {
      console.log('CountingWithQuizScreen: Cleaning up useEffect');
      cancelled = true;
      clearTimer();
    };
  }, [state.stepIndex, state.hasStarted, state.result, state.isFinished]);

  const handleInputChange = (key: string, val: string) => {
    console.log('CountingWithQuizScreen: handleInputChange', { key, value: val });
    const numericValue = val.replace(/[^0-9]/g, "");
    let constrainedValue = numericValue;
    if (key === "randoms") {
      constrainedValue = Math.min(Math.max(Number(numericValue) || 2, 2), 20).toString();
    } else if (key === "questions") {
      constrainedValue = Math.min(Number(numericValue) || 1, 100).toString();
    } else if (key === "speed") {
      constrainedValue = Math.min(Number(numericValue) || 1, 180).toString();
    } else if (key === "score") {
      constrainedValue = Math.min(Number(numericValue) || 1, 100).toString();
    } else if (key === "timeAnswers") {
      constrainedValue = Math.min(Number(numericValue) || 10, 60).toString();
    }

    const newSettings = { ...settings, [key]: constrainedValue };
    const randomsNum = Number(newSettings.randoms) || 2;
    const speedNum = Number(newSettings.speed) || 1;
    const stepDuration = speedNum / randomsNum;
    if (stepDuration < 0.3) {
      const actualTime = (randomsNum * 0.3).toFixed(1);
      setWarning(
        `Thời gian mỗi dòng (${stepDuration.toFixed(2)} giây) quá ngắn. Cần ít nhất 0.3 giây/dòng. Tổng thời gian thực tế sẽ là ${actualTime} giây. Vui lòng tăng Tổng thời gian hoặc giảm Số dòng.`
      );
    } else {
      setWarning(null);
    }

    setSettings(newSettings);
  };

  const handleStartQuiz = () => {
    console.log('CountingWithQuizScreen: handleStartQuiz called', { settings });
    const numericSettings = Object.entries(settings).reduce(
      (acc, [key, value]) => {
        const numericKeys = [
          "randoms",
          "speed",
          "questions",
          "score",
          "timeAnswers",
        ];
        acc[key] = numericKeys.includes(key) ? Number(value) || 0 : value;
        return acc;
      },
      {}
    );
    dispatch({ type: "START", payload: numericSettings });
  };

  if (state.isFinished) {
    return <QuizFinished state={state} dispatch={dispatch} />;
  }

  if (!state.hasStarted) {
    return (
      <ScrollView contentContainerStyle={styles.configContainer}>
        <Text style={styles.title}>Cấu hình bài test</Text>

        {warning && <Text style={styles.warningText}>{warning}</Text>}

        <View style={styles.greenBox}>
          <View style={styles.row}>
            <Text style={styles.label}>Công thức</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={settings.simpleRule}
                style={styles.picker}
                onValueChange={(val) =>
                  setSettings({ ...settings, simpleRule: val })
                }
                {...(Platform.OS !== 'web' ? { accessible: true, accessibilityLabel: "Chọn công thức" } : {})}
              >
                <Picker.Item
                  label="Simple Rules Basic"
                  value="Simple Rules Basic"
                />
              </Picker>
            </View>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Chữ số</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={settings.digits}
                style={styles.picker}
                onValueChange={(val) =>
                  setSettings({ ...settings, digits: val })
                }
                {...(Platform.OS !== 'web' ? { accessible: true, accessibilityLabel: "Chọn phạm vi chữ số" } : {})}
              >
                <Picker.Item label="1D < 10" value="1d<10" />
                <Picker.Item label="1D ≥ 10" value="1d>10" />
                <Picker.Item label="2D < 100" value="2d<100" />
                <Picker.Item label="2D ≥ 100" value="2d>100" />
                <Picker.Item label="3D < 1.000" value="3d<1000" />
                <Picker.Item label="3D ≥ 1.000" value="3d>1000" />
                <Picker.Item label="4D < 10.000" value="4d<10000" />
                <Picker.Item label="4D ≥ 10.000" value="4d>10000" />
                <Picker.Item label="5D < 100.000" value="5d<100000" />
                <Picker.Item label="5D ≥ 100.000" value="5d>100000" />
              </Picker>
            </View>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Dạng bài</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={settings.typeTest}
                style={styles.picker}
                onValueChange={(val) =>
                  setSettings({ ...settings, typeTest: val })
                }
                {...(Platform.OS !== 'web' ? { accessible: true, accessibilityLabel: "Chọn dạng bài" } : {})}
              >
                <Picker.Item label="Visual" value="Visual" />
              </Picker>
            </View>
          </View>
          {[
            { label: "Số dòng", key: "randoms" },
            { label: "Tổng thời gian câu hỏi (giây)", key: "speed" },
            { label: "Số câu hỏi", key: "questions" },
            { label: "Điểm mỗi câu", key: "score" },
            { label: "Thời gian trả lời (giây)", key: "timeAnswers" },
          ].map((item) => (
            <View style={styles.row} key={item.key}>
              <Text style={styles.label}>{item.label}</Text>
              <TextInput
                style={styles.input}
                value={settings[item.key]}
                keyboardType="numeric"
                onChangeText={(val) => handleInputChange(item.key, val)}
                {...(Platform.OS !== 'web' ? { accessible: true, accessibilityLabel: item.label } : {})}
              />
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.startButton, warning && styles.startButtonDisabled]}
          onPress={handleStartQuiz}
          disabled={!!warning}
          {...(Platform.OS !== 'web' ? { accessible: true, accessibilityLabel: "Bắt đầu bài test" } : {})}
        >
          <Text style={styles.startText}>Bắt đầu</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return <QuizActive state={state} dispatch={dispatch} />;
}

const styles = StyleSheet.create({
  configContainer: {
    padding: 20,
    backgroundColor: "#F0F2F5",
    flexGrow: 1,
  },
  quizContainer: {
    flex: 1,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    padding: width < 400 ? 15 : 20,
  },
  title: {
    fontSize: width < 400 ? 24 : 28,
    fontWeight: "bold",
    color: "#FF6F00",
    marginBottom: 20,
    textAlign: "center",
  },
  row: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  pickerContainer: {
    backgroundColor: "#fff",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    height: 40,
    justifyContent: "center",
  },
  picker: {},
  input: {
    height: 40,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    borderRadius: 5,
    borderColor: "#ccc",
    borderWidth: 1,
    fontSize: 16,
  },
  startButton: {
    marginTop: 20,
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  startButtonDisabled: {
    backgroundColor: "#ccc",
  },
  startText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  questionContainer: {
    minHeight: 80,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  questionText: {
    fontWeight: "bold",
    textAlign: "center",
  },
  options: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
    flexWrap: "wrap",
  },
  optionBtn: {
    borderWidth: 2,
    borderColor: "#FFA726",
    borderRadius: 10,
    padding: width < 400 ? 10 : 15,
    margin: 5,
    minWidth: width < 400 ? 80 : 100,
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  optionSelected: {
    backgroundColor: "#29B6F6",
    borderColor: "#0288D1",
  },
  optionText: {
    fontWeight: "bold",
  },
  checkBtn: {
    backgroundColor: "#FFCA28",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  checkBtnDisabled: {
    backgroundColor: "#ccc",
  },
  checkText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  retryBtn: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 24,
    backgroundColor: "#4CAF50",
    borderRadius: 10,
  },
  retryText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  star: {
    fontSize: 40,
    position: "absolute",
    top: 60,
    right: 30,
  },
  resultText: {
    marginTop: 15,
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginBottom: 10,
  },
  warningText: {
    color: "orange",
    fontSize: 14,
    marginBottom: 10,
    textAlign: "center",
  },
  greenBox: {
    borderWidth: 2,
    borderColor: "#4CAF50",
    borderRadius: 10,
    padding: 16,
    backgroundColor: "#E8F5E9",
    marginTop: 10,
    width: "100%",
  },
  finishedText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "#FF6F00",
  },
  statsContainer: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statsText: {
    fontSize: 16,
    fontWeight: "bold",
    backgroundColor: "rgba(255,255,255,0.7)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },
});