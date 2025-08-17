import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

interface Props {
  number: number;
  columnCount?: number;
}

interface BeadProps {
  isActive: boolean;
  isHeaven?: boolean;
}

const Bead = ({ isActive, isHeaven = false }: BeadProps) => (
  <View
    style={[
      styles.bead,
      isHeaven ? styles.heavenBead : styles.earthBead,
      isActive && (isHeaven ? styles.heavenBeadActive : styles.earthBeadActive),
    ]}
  />
);

export default function SorobanDisplay({ number, columnCount = 4 }: Props) {
  const digits = number.toString().padStart(columnCount, '0').split('').map(Number);

  const renderColumn = (digit: number, columnIndex: number) => {
    const heavenValue = Math.floor(digit / 5);
    const earthValue = digit % 5;

    return (
      <View key={columnIndex} style={styles.column}>
        {/* Heaven section (5s) */}
        <View style={styles.heavenSection}>
          <Bead isActive={heavenValue >= 1} isHeaven />
        </View>

        {/* Separator */}
        <View style={styles.separator} />

        {/* Earth section (1s) */}
        <View style={styles.earthSection}>
          {[0, 1, 2, 3].map((beadIndex) => (
            <Bead
              key={beadIndex}
              isActive={earthValue > beadIndex}
            />
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.frame}>
        <View style={styles.soroban}>
          {digits.map((digit, index) => renderColumn(digit, index))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  frame: {
    backgroundColor: '#8B4513',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  soroban: {
    backgroundColor: '#D2B48C',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 16,
    minWidth: width * 0.7,
  },
  column: {
    alignItems: 'center',
    flex: 1,
  },
  heavenSection: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  separator: {
    height: 4,
    backgroundColor: '#8B4513',
    width: '100%',
    marginVertical: 8,
    borderRadius: 2,
  },
  earthSection: {
    height: 120,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  bead: {
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  heavenBead: {
    width: 24,
    height: 24,
    backgroundColor: '#FFB6C1', // Light pink for inactive heaven beads
  },
  earthBead: {
    width: 20,
    height: 20,
    backgroundColor: '#FFEB9C', // Light yellow for inactive earth beads
  },
  heavenBeadActive: {
    backgroundColor: '#DC2626', // Red for active heaven beads (value 5)
    transform: [{ scale: 1.1 }],
  },
  earthBeadActive: {
    backgroundColor: '#EAB308', // Yellow for active earth beads (value 1)
    transform: [{ scale: 1.1 }],
  },
});