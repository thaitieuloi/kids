export interface SorobanColumn {
  value: number;
  heavenBead: boolean;
  earthBeads: number[];
}

export function numberToSoroban(number: number, columns: number = 3): SorobanColumn[] {
  const digits = number.toString().padStart(columns, '0').split('').map(Number);
  
  return digits.map(digit => {
    const heavenBead = digit >= 5;
    const earthBeads = Array.from({ length: 4 }, (_, i) => i < (digit % 5) ? 1 : 0);
    
    return {
      value: digit,
      heavenBead,
      earthBeads
    };
  });
}

export function formatNumberWithCommas(number: number): string {
  return number.toLocaleString('vi-VN');
}

export function generateSorobanVisualization(number: number, columns: number = 3): SorobanColumn[] {
  return numberToSoroban(number, columns);
}
