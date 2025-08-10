import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chọn lớp học:</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/lop-1/quiz1')}>
        <Text style={styles.buttonText}>Lớp 1</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => alert('Đang phát triển')}>
        <Text style={styles.buttonText}>Lớp 2</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => alert('Đang phát triển')}>
        <Text style={styles.buttonText}>Lớp 3</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/soroban/quiz1')}>
        <Text style={styles.buttonText}>Toán + lv1</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/soroban/quiz2')}>
        <Text style={styles.buttonText}>Toán + lv2</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/soroban/quiz3')}>
        <Text style={styles.buttonText}>Toán + lv3</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/soroban/quiz4')}>
        <Text style={styles.buttonText}>Toán + lv4</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/soroban/SimpleRules')}>
        <Text style={styles.buttonText}>Simple Rules</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/soroban/quiz4')}>
        <Text style={styles.buttonText}>Small Friend Rules (+)</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/soroban/quiz4')}>
        <Text style={styles.buttonText}>Small Friend Rules (-)</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/soroban/quiz4')}>
        <Text style={styles.buttonText}>Big Friend Rules (+)</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/soroban/quiz4')}>
        <Text style={styles.buttonText}>Big Friend Rules (-)</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/soroban/quiz4')}>
        <Text style={styles.buttonText}>Basic Rules</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/soroban/quiz4')}>
        <Text style={styles.buttonText}>Advanced Rules</Text>
      </TouchableOpacity>            

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFAF0' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: 200,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 18 },
});