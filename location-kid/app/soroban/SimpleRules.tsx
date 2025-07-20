import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
// Giả định các hooks và utils này tồn tại và hoạt động đúng
import { useAudioPlayer } from "../../hooks/useAudioPlayer";
import { useQuizState } from "../../hooks/useQuizState";
import { playCorrect, playDing, playWrong } from "../../utils/audioPlayer";

// --- Component Con: Giao diện Chơi Quiz (Sau khi nhấn Bắt đầu) ---
const QuizActive = ({ state, dispatch }) => {
  const starOpacity = useRef(new Animated.Value(0)).current;

  // Effect cho âm thanh và animation khi có kết quả
  useEffect(() => {
    if (state.result === "correct") {
      playCorrect();
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
      ]).start();
    } else if (state.result === "incorrect") {
      playWrong();
    }
  }, [state.result]);

  const handleCheck = () => dispatch({ type: "CHECK_ANSWER" });
  const handleRetry = () => dispatch({ type: "RETRY" });

  // Hàm render câu hỏi, làm cho JSX chính gọn hơn
  const renderQuestion = () => {
    const isLastStep = state.stepIndex === state.quiz.steps.length - 1;
    const showAnswer = isLastStep && state.result !== null;

    if (showAnswer) {
      const expression =
        state.quiz.steps
          .slice(0, -1)
          .map((s) => s.display.replace("+", "").trim())
          .join(" + ") + ` = ${state.quiz.correct}`;
      return <Text style={styles.questionText}>{expression}</Text>;
    }

    if (isLastStep) {
      return <Text style={styles.questionText}>Kết quả = ???</Text>;
    }

    const currentStep = state.quiz.steps[state.stepIndex];
    // Kiểm tra currentStep tồn tại trước khi truy cập display
    return <Text style={styles.questionText}>{currentStep?.display}</Text>;
  };

  return (
    // Giao diện này có nền xanh nhạt để tạo cảm giác liền mạch
    <View style={styles.quizContainer}>
      <Text style={styles.title}>Giải toán</Text>

      {state.error && <Text style={styles.errorText}>Lỗi: {state.error}</Text>}

      {/* Hiển thị câu hỏi và các lựa chọn */}
      <View style={styles.questionContainer}>{renderQuestion()}</View>

      {/* Hiển thị các lựa chọn khi đến bước cuối và chưa có kết quả */}
      {state.stepIndex === state.quiz.steps.length - 1 &&
        state.result === null && (
          <>
            <View style={styles.options}>
              {state.quiz.options.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  onPress={() =>
                    dispatch({ type: "SELECT_OPTION", payload: opt })
                  }
                  style={[
                    styles.optionBtn,
                    state.selected === opt && styles.optionSelected,
                  ]}
                >
                  <Text style={styles.optionText}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              onPress={handleCheck}
              style={[
                styles.checkBtn,
                !state.selected && styles.checkBtnDisabled,
              ]}
              disabled={!state.selected}
            >
              <Text style={styles.checkText}>Kiểm tra</Text>
            </TouchableOpacity>
          </>
        )}

      {/* Hiển thị kết quả và nút chơi lại */}
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
          <TouchableOpacity onPress={handleRetry} style={styles.retryBtn}>
            <Text style={styles.retryText}>Tiếp tục 🔁</Text>
          </TouchableOpacity>
        </>
      )}

      <Animated.Text style={[styles.star, { opacity: starOpacity }]}>
        ✨
      </Animated.Text>
    </View>
  );
};

// --- Component Chính: Quản lý trạng thái và điều phối hiển thị ---
export default function CountingWithQuizScreen() {
  const [settings, setSettings] = useState({
    simpleRule: "Simple Rules Basic",
    typeTest: "Visual",
    randoms: "10",
    speed: "1",
    questions: "5",
    score: "1",
    timeAnswers: "10",
  });

  const { state, dispatch, startStepTimer, clearTimer } = useQuizState();

  // Hook để xử lý audio cho các bước của quiz
  useAudioPlayer(state.quiz.steps[state.stepIndex]?.soundUris, (error) =>
    dispatch({ type: "SET_ERROR", payload: error.message })
  );

  // Effect chính điều khiển logic của quiz (bắt đầu đếm giờ, chuyển step)
  useEffect(() => {
    // Chỉ chạy khi quiz đã bắt đầu và chưa có kết quả cuối cùng
    if (!state.hasStarted || state.result !== null) return;

    let cancelled = false;
    const start = async () => {
      try {
        // Phát âm thanh báo hiệu và bắt đầu đếm giờ cho step
        await playDing();
        if (!cancelled) {
          startStepTimer();
        }
      } catch (err) {
        dispatch({ type: "SET_ERROR", payload: "Lỗi phát âm thanh." });
      }
    };

    start();

    return () => {
      cancelled = true;
      clearTimer();
    };
  }, [state.stepIndex, state.hasStarted, state.result]);

  // Hàm xử lý khi nhấn nút "Bắt đầu"
  const handleStartQuiz = () => {
    // Chuyển đổi các giá trị settings từ chuỗi sang số để reducer xử lý
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

    // Dispatch action START với payload là settings đã được chuẩn hóa
    dispatch({ type: "START", payload: numericSettings });
  };

  // --- LOGIC RENDER CHÍNH ---
  // Nếu quiz chưa bắt đầu, hiển thị màn hình cấu hình
  if (!state.hasStarted) {
    return (
      <ScrollView contentContainerStyle={styles.configContainer}>
        <Text style={styles.title}>Cấu hình bài test</Text>

        {/* Phần cấu hình */}
        <View style={styles.greenBox}>
          <View style={styles.row}>
            <Text style={styles.label}>Simple Rules:</Text>
            <Picker
              selectedValue={settings.simpleRule}
              style={styles.picker}
              onValueChange={(val) =>
                setSettings({ ...settings, simpleRule: val })
              }
            >
              <Picker.Item
                label="Simple Rules Basic"
                value="Simple Rules Basic"
              />
            </Picker>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Type Test:</Text>
            <Picker
              selectedValue={settings.typeTest}
              style={styles.picker}
              onValueChange={(val) =>
                setSettings({ ...settings, typeTest: val })
              }
            >
              <Picker.Item label="Visual" value="Visual" />
            </Picker>
          </View>
          {[
            { label: "Randoms:", key: "randoms" },
            { label: "Speed(s):", key: "speed" },
            { label: "Questions:", key: "questions" },
            { label: "Score:", key: "score" },
            { label: "Time Answers(s):", key: "timeAnswers" },
          ].map((item) => (
            <View style={styles.row} key={item.key}>
              <Text style={styles.label}>{item.label}</Text>
              <TextInput
                style={styles.input}
                value={settings[item.key]}
                keyboardType="numeric"
                onChangeText={(val) =>
                  setSettings({
                    ...settings,
                    [item.key]: val.replace(/[^0-9]/g, ""),
                  })
                }
              />
            </View>
          ))}
        </View>

        {/* Khung xanh chỉ chứa chữ READY tĩnh */}
        <View style={styles.greenBox}>
          <View style={styles.readyBoxInside}>
            <Text style={styles.readyText}>READY</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.startButton} onPress={handleStartQuiz}>
          <Text style={styles.startText}>Bắt đầu</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // Nếu quiz đã bắt đầu, hiển thị giao diện chơi quiz
  return <QuizActive state={state} dispatch={dispatch} />;
}

// --- STYLES ---
const styles = StyleSheet.create({
  // Container cho màn hình cấu hình
  configContainer: {
    padding: 20,
    backgroundColor: "#F0F2F5",
    flexGrow: 1,
  },
  // Container cho màn hình chơi quiz
  quizContainer: {
    flex: 1,
    backgroundColor: "#E8F5E9", // Nền xanh nhạt để liền mạch
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FF6F00",
    marginBottom: 20,
    textAlign: "center",
  },
  row: {
    marginBottom: 15,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  picker: {
    backgroundColor: "#fff",
    ...Platform.select({ android: { height: 40 } }),
  },
  input: {
    height: 40,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    borderRadius: 5,
    borderColor: "#ccc",
    borderWidth: 1,
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
    fontSize: 50,
    fontWeight: "bold",
    color: "#333",
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
    padding: 15,
    margin: 5,
    minWidth: 70,
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  optionSelected: {
    backgroundColor: "#29B6F6",
    borderColor: "#0288D1",
  },
  optionText: {
    fontSize: 20,
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
  // Khung xanh chung
  greenBox: {
    borderWidth: 2,
    borderColor: "#4CAF50",
    borderRadius: 10,
    padding: 16,
    backgroundColor: "#E8F5E9",
    marginTop: 10,
  },
  // Box READY bên trong
  readyBoxInside: {
    marginVertical: 20,
    paddingVertical: 30,
    alignItems: "center",
    backgroundColor: "#C8E6C9",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#388E3C",
  },
  readyText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
});
