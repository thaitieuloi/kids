import { generateSorobanVisualization } from '@/lib/soroban-utils';

interface SorobanDisplayProps {
  number: number;
  columns?: number;
}

export default function SorobanDisplay({ number, columns = 3 }: SorobanDisplayProps) {
  const sorobanColumns = generateSorobanVisualization(number, columns);

  return (
    <div className="flex items-center justify-center space-x-8 p-4 bg-gray-50 rounded-xl">
      {/* Number Display */}
      <div className="text-right text-2xl font-bold text-gray-800 min-w-[4rem]">
        {number}
      </div>
      
      {/* Soroban Visualization */}
      <div className="flex flex-col items-center space-y-2">
        <div className="text-sm font-semibold text-gray-700">Soroban</div>
        {/* Soroban Frame */}
        <div className="bg-amber-900 p-3 rounded-xl shadow-lg border-2 border-amber-800">
          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {sorobanColumns.map((column, columnIndex) => (
              <div key={columnIndex} className="flex flex-col items-center space-y-1">
                {/* Column separator line */}
                <div className="w-0.5 h-6 bg-amber-800"></div>
                
                {/* Heaven bead (5) - Red when active */}
                <div className={`w-5 h-3 rounded-full border-2 shadow-sm transition-colors ${
                  column.heavenBead 
                    ? 'bg-red-500 border-red-600' 
                    : 'bg-amber-200 border-amber-400'
                }`}></div>
                
                {/* Divider bar */}
                <div className="w-8 h-1 bg-amber-800 rounded"></div>
                
                {/* Earth beads (1s) - Yellow when active */}
                <div className="space-y-1">
                  {Array.from({ length: 4 }, (_, beadIndex) => (
                    <div 
                      key={beadIndex} 
                      className={`w-5 h-3 rounded-full border-2 shadow-sm transition-colors ${
                        column.earthBeads[beadIndex] === 1 
                          ? 'bg-yellow-400 border-yellow-600' 
                          : 'bg-amber-200 border-amber-400'
                      }`}
                    ></div>
                  ))}
                </div>
                
                {/* Bottom separator line */}
                <div className="w-0.5 h-6 bg-amber-800"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
