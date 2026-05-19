import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { styled } from 'nativewind';
import {
  CartesianChart,
  Line,
  useChartPressState,
} from 'victory-native';
import type { WeightDataPoint } from '../../types';

const StyledView = styled(View);
const StyledText = styled(Text);

const { width } = Dimensions.get('window');

interface ProgressChartProps {
  data: WeightDataPoint[];
  title?: string;
}

export function ProgressChart({ data, title = 'Body Weight' }: ProgressChartProps) {
  const { state, isActive } = useChartPressState({ x: 0, y: { weight: 0 } });

  if (data.length < 2) {
    return (
      <StyledView className="bg-surface rounded-2xl p-4 items-center justify-center" style={{ height: 200 }}>
        <StyledText className="text-slate-400 text-sm">Log at least 2 entries to see the chart</StyledText>
      </StyledView>
    );
  }

  const chartData = data.map((d, i) => ({ x: i, weight: d.weight, date: d.date }));

  return (
    <StyledView className="bg-surface rounded-2xl p-4">
      <StyledText className="text-white font-semibold text-base mb-3">{title}</StyledText>
      <View style={{ height: 200, width: width - 64 }}>
        <CartesianChart
          data={chartData}
          xKey="x"
          yKeys={['weight']}
          chartPressState={state}
        >
          {({ points }) => (
            <Line
              points={points.weight}
              color="#0ea5e9"
              strokeWidth={2}
              animate={{ type: 'timing', duration: 500 }}
            />
          )}
        </CartesianChart>
      </View>
    </StyledView>
  );
}
