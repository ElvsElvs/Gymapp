import React, { useEffect } from 'react';
import { ScrollView, View, Text, RefreshControl } from 'react-native';
import { styled } from 'nativewind';
import { useBodyWeightStore } from '../../src/store/bodyWeightStore';
import { ProgressChart } from '../../src/components/charts/ProgressChart';
import { Card } from '../../src/components/ui/Card';

const StyledScroll = styled(ScrollView);
const StyledView = styled(View);
const StyledText = styled(Text);

export default function ProgressScreen() {
  const { entries, isLoading, loadHistory } = useBodyWeightStore();

  useEffect(() => { loadHistory(); }, []);

  const chartData = [...entries]
    .reverse()
    .map((e) => ({
      date: new Date(e.recorded_at * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      weight: e.weight_kg,
    }));

  const latest = entries[0];
  const oldest = entries[entries.length - 1];
  const change = latest && oldest && entries.length > 1
    ? (latest.weight_kg - oldest.weight_kg).toFixed(1)
    : null;

  return (
    <StyledScroll
      className="flex-1 bg-background"
      contentContainerClassName="p-4 gap-4"
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadHistory} tintColor="#0ea5e9" />}
    >
      <StyledText className="text-white text-xl font-bold">Progress</StyledText>

      {latest && (
        <StyledView className="flex-row gap-3">
          <Card className="flex-1 items-center">
            <StyledText className="text-slate-400 text-xs mb-1">Current</StyledText>
            <StyledText className="text-white text-2xl font-bold">{latest.weight_kg}</StyledText>
            <StyledText className="text-slate-400 text-xs">kg</StyledText>
          </Card>
          {change !== null && (
            <Card className="flex-1 items-center">
              <StyledText className="text-slate-400 text-xs mb-1">Change</StyledText>
              <StyledText className={`text-2xl font-bold ${parseFloat(change) <= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {parseFloat(change) > 0 ? '+' : ''}{change}
              </StyledText>
              <StyledText className="text-slate-400 text-xs">kg</StyledText>
            </Card>
          )}
          <Card className="flex-1 items-center">
            <StyledText className="text-slate-400 text-xs mb-1">Entries</StyledText>
            <StyledText className="text-white text-2xl font-bold">{entries.length}</StyledText>
            <StyledText className="text-slate-400 text-xs">total</StyledText>
          </Card>
        </StyledView>
      )}

      <ProgressChart data={chartData} title="Body Weight (kg)" />
    </StyledScroll>
  );
}
