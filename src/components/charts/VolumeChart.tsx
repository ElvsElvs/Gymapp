import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { styled } from 'nativewind';
import {
  CartesianChart,
  Bar,
  useChartPressState,
} from 'victory-native';
import type { VolumeDataPoint } from '../../types';

const StyledView = styled(View);
const StyledText = styled(Text);

const { width } = Dimensions.get('window');

interface VolumeChartProps {
  data: VolumeDataPoint[];
  title?: string;
}

export function VolumeChart({ data, title = 'Training Volume' }: VolumeChartProps) {
  const { state } = useChartPressState({ x: 0, y: { volume: 0 } });

  if (data.length === 0) {
    return (
      <StyledView className="bg-surface rounded-2xl p-4 items-center justify-center" style={{ height: 200 }}>
        <StyledText className="text-slate-400 text-sm">No volume data yet</StyledText>
      </StyledView>
    );
  }

  const chartData = data.map((d, i) => ({ x: i, volume: d.volume }));

  return (
    <StyledView className="bg-surface rounded-2xl p-4">
      <StyledText className="text-white font-semibold text-base mb-3">{title}</StyledText>
      <View style={{ height: 200, width: width - 64 }}>
        <CartesianChart
          data={chartData}
          xKey="x"
          yKeys={['volume']}
          chartPressState={state}
        >
          {({ points, chartBounds }) => (
            <Bar
              points={points.volume}
              chartBounds={chartBounds}
              color="#0ea5e9"
              animate={{ type: 'timing', duration: 300 }}
            />
          )}
        </CartesianChart>
      </View>
    </StyledView>
  );
}
