import React, { useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useWorkoutStore } from '../../src/store/workoutStore';
import { useBodyWeightStore } from '../../src/store/bodyWeightStore';
import { Card } from '../../src/components/ui/Card';

const StyledScroll = styled(ScrollView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchable = styled(TouchableOpacity);

function formatDate(ts: number): string {
  return new Date(ts * 1000).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short',
  });
}

function formatDuration(secs: number | null): string {
  if (!secs) return '—';
  const m = Math.floor(secs / 60);
  return `${m} min`;
}

export default function HomeScreen() {
  const router = useRouter();
  const { sessions, activeSession, loadSessions } = useWorkoutStore();
  const { latest, loadHistory } = useBodyWeightStore();

  useEffect(() => {
    loadSessions();
    loadHistory();
  }, []);

  const recent = sessions.slice(0, 5);

  return (
    <StyledScroll className="flex-1 bg-background" contentContainerClassName="p-4 gap-4">
      <StyledView className="flex-row items-center justify-between">
        <StyledText className="text-white text-2xl font-bold">GymLog</StyledText>
        {latest && (
          <StyledView className="bg-surface-raised rounded-xl px-3 py-1.5">
            <StyledText className="text-slate-400 text-xs">Body weight</StyledText>
            <StyledText className="text-white font-semibold">{latest.weight_kg} kg</StyledText>
          </StyledView>
        )}
      </StyledView>

      {activeSession ? (
        <StyledTouchable
          onPress={() => router.push('/workout/active')}
          className="bg-primary-500 rounded-2xl p-5 flex-row items-center justify-between"
        >
          <StyledView>
            <StyledText className="text-white font-bold text-lg">{activeSession.name}</StyledText>
            <StyledText className="text-primary-100 text-sm">Workout in progress — tap to resume</StyledText>
          </StyledView>
          <Ionicons name="chevron-forward" size={24} color="#fff" />
        </StyledTouchable>
      ) : (
        <StyledTouchable
          onPress={() => router.push('/workout/active')}
          className="bg-primary-500 active:bg-primary-600 rounded-2xl p-5 flex-row items-center justify-center gap-2"
        >
          <Ionicons name="add-circle" size={24} color="#fff" />
          <StyledText className="text-white font-bold text-lg">Start Workout</StyledText>
        </StyledTouchable>
      )}

      <Card>
        <StyledText className="text-white font-semibold text-base mb-3">Recent Workouts</StyledText>
        {recent.length === 0 ? (
          <StyledText className="text-slate-400 text-sm text-center py-4">No workouts yet. Start your first one!</StyledText>
        ) : (
          recent.map((s) => (
            <StyledTouchable
              key={s.id}
              onPress={() => router.push(`/workout/${s.id}`)}
              className="flex-row items-center justify-between py-3 border-b border-slate-700 last:border-0"
            >
              <StyledView>
                <StyledText className="text-white font-medium">{s.name}</StyledText>
                <StyledText className="text-slate-400 text-sm">{formatDate(s.started_at)}</StyledText>
              </StyledView>
              <StyledView className="items-end">
                <StyledText className="text-slate-300 text-sm">{formatDuration(s.duration_seconds)}</StyledText>
                <Ionicons name="chevron-forward" size={16} color="#64748b" />
              </StyledView>
            </StyledTouchable>
          ))
        )}
      </Card>
    </StyledScroll>
  );
}
