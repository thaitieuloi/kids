import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Switch,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, GameSettings } from '../../App';

type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Settings'>;

interface Props {
  navigation: SettingsScreenNavigationProp;
}

export default function SettingsScreen({ navigation }: Props) {
  const [settings, setSettings] = useState<GameSettings>({
    questionCount: 5,
    rowCount: 3,
    timeLimit: 30,
    numberRange: 10,
    feedbackSound: true,
    numberReading: false,
    transitionSound: true,
    difficulty: 'beginner',
  });

  const questionCountOptions = [3, 5, 10, 15];
  const timeLimitOptions = [15, 30, 60, 90];
  const numberRangeOptions = [
    { value: 5, label: 'Dưới 5' },
    { value: 10, label: 'Dưới 10' },
    { value: 20, label: 'Dưới 20' },
    { value: 50, label: 'Dưới 50' },
  ];

  const handleStartGame = () => {
    navigation.navigate('Game', { settings });
  };

  const OptionSelector = ({ 
    title, 
    options, 
    selectedValue, 
    onSelect, 
    renderOption 
  }: {
    title: string;
    options: any[];
    selectedValue: any;
    onSelect: (value: any) => void;
    renderOption?: (option: any) => string;
  }) => (
    <View style={styles.optionGroup}>
      <Text style={styles.optionTitle}>{title}</Text>
      <View style={styles.optionButtons}>
        {options.map((option) => {
          const value = typeof option === 'object' ? option.value : option;
          const label = renderOption ? renderOption(option) : 
                      typeof option === 'object' ? option.label : option.toString();
          
          return (
            <TouchableOpacity
              key={value}
              style={[
                styles.optionButton,
                selectedValue === value && styles.optionButtonActive,
              ]}
              onPress={() => onSelect(value)}
            >
              <Text
                style={[
                  styles.optionButtonText,
                  selectedValue === value && styles.optionButtonTextActive,
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const ToggleOption = ({ 
    title, 
    value, 
    onToggle 
  }: {
    title: string;
    value: boolean;
    onToggle: (value: boolean) => void;
  }) => (
    <View style={styles.toggleOption}>
      <Text style={styles.toggleTitle}>{title}</Text>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#E2E8F0', true: '#4F46E5' }}
        thumbColor={value ? '#FFFFFF' : '#FFFFFF'}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.title}>Cài đặt trò chơi</Text>

          <OptionSelector
            title="Số câu hỏi"
            options={questionCountOptions}
            selectedValue={settings.questionCount}
            onSelect={(value) => setSettings({ ...settings, questionCount: value })}
            renderOption={(option) => `${option} câu`}
          />

          <OptionSelector
            title="Thời gian cho mỗi câu"
            options={timeLimitOptions}
            selectedValue={settings.timeLimit}
            onSelect={(value) => setSettings({ ...settings, timeLimit: value })}
            renderOption={(option) => `${option}s`}
          />

          <OptionSelector
            title="Phạm vi số"
            options={numberRangeOptions}
            selectedValue={settings.numberRange}
            onSelect={(value) => setSettings({ ...settings, numberRange: value })}
          />

          <View style={styles.audioSection}>
            <Text style={styles.sectionTitle}>Cài đặt âm thanh</Text>
            
            <ToggleOption
              title="Âm thanh phản hồi"
              value={settings.feedbackSound}
              onToggle={(value) => setSettings({ ...settings, feedbackSound: value })}
            />

            <ToggleOption
              title="Đọc số"
              value={settings.numberReading}
              onToggle={(value) => setSettings({ ...settings, numberReading: value })}
            />

            <ToggleOption
              title="Âm thanh chuyển câu"
              value={settings.transitionSound}
              onToggle={(value) => setSettings({ ...settings, transitionSound: value })}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStartGame}
          activeOpacity={0.8}
        >
          <Text style={styles.startButtonText}>🎮 Bắt đầu chơi</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 30,
    textAlign: 'center',
  },
  optionGroup: {
    marginBottom: 30,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
  },
  optionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    minWidth: 70,
    alignItems: 'center',
  },
  optionButtonActive: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  optionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
  optionButtonTextActive: {
    color: '#FFFFFF',
  },
  audioSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  toggleOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  toggleTitle: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
  },
  footer: {
    padding: 20,
    paddingBottom: 30,
  },
  startButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});