import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Dimensions,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';

const { width } = Dimensions.get('window');

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

export default function HomeScreen({ navigation }: Props) {
  const difficultyLevels = [
    {
      id: 'beginner',
      title: 'Anh bạn nhỏ',
      subtitle: 'Dành cho bé 3-5 tuổi',
      color: '#10B981',
      icon: '🌱',
    },
    {
      id: 'intermediate',
      title: 'Anh bạn lớn',
      subtitle: 'Dành cho bé 6-8 tuổi',
      color: '#F59E0B',
      icon: '🌟',
    },
    {
      id: 'advanced',
      title: 'Ứng dụng lớn hơn mạnh mẽ hơn',
      subtitle: 'Dành cho bé 9+ tuổi',
      color: '#EF4444',
      icon: '🚀',
    },
  ];

  const handleDifficultySelect = (difficulty: string) => {
    navigation.navigate('Settings');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Soroban Math</Text>
          <Text style={styles.subtitle}>Học toán với bàn tính Nhật Bản</Text>
        </View>

        {/* Abacus Illustration */}
        <View style={styles.illustrationContainer}>
          <Text style={styles.illustrationText}>🧮</Text>
        </View>

        {/* Difficulty Cards */}
        <View style={styles.difficultyContainer}>
          <Text style={styles.sectionTitle}>Chọn độ khó:</Text>
          
          {difficultyLevels.map((level) => (
            <TouchableOpacity
              key={level.id}
              style={[styles.difficultyCard, { borderColor: level.color }]}
              onPress={() => handleDifficultySelect(level.id)}
              activeOpacity={0.8}
            >
              <View style={styles.cardContent}>
                <View style={styles.cardLeft}>
                  <Text style={styles.cardIcon}>{level.icon}</Text>
                  <View style={styles.cardText}>
                    <Text style={[styles.cardTitle, { color: level.color }]}>
                      {level.title}
                    </Text>
                    <Text style={styles.cardSubtitle}>{level.subtitle}</Text>
                  </View>
                </View>
                <View style={[styles.cardIndicator, { backgroundColor: level.color }]} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Phát triển kỹ năng toán học với phương pháp Soroban truyền thống
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  illustrationText: {
    fontSize: 80,
  },
  difficultyContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 20,
    textAlign: 'center',
  },
  difficultyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  cardIndicator: {
    width: 8,
    height: 40,
    borderRadius: 4,
  },
  footer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  footerText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
});