import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, ActivityIndicator } from 'react-native';
import { styled } from 'nativewind';
import { useLocalSearchParams } from 'expo-router';
import { getSessionById } from '../../src/services/workoutService';
import type { SessionWithSets } from '../../src/types';
import { SetRow } from '../../src/components/workout/SetRow';

const StyledScroll = styled(ScrollView);
const StyledView = styled(View);
const StyledText = styled(Text);

function formatDate(ts: number): string {
  return new Date(ts * 1000).toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

function formatDuration(secs: number | null): string {
  if (!secs) return '—';
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m} min`;
}

export default function WorkoutDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [session, setSession] = useState<SessionWithSets | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getSessionById(Number(id))
      .then(setSession)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <StyledView className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#0ea5e9" />
      </StyledView>
    );
  }

  if (!session) {
    return (
      <StyledView className="flex-1 bg-background items-center justify-center">
        <StyledText className="text-slate-400">Session not found</StyledText>
      </StyledView>
    );
  }

  const exerciseGroups = session.sets.reduce<Record<string, typeof session.sets>>(
    (acc, s) => {
      if (!acc[s.exercise_name]) acc[s.exercise_name] = [];
      acc[s.exercise_name].push(s);
      return acc;
    },
    {},
  );

  const totalVolume = session.sets.reduce((sum, s) =>
    sum + (s.reps ?? 0) * (s.weight_kg ?? 0), 0,
  );

  return (
    <StyledScroll className="flex-1 bg-background" contentContainerClassName="p-4 gap-4">
      <StyledView className="bg-surface rounded-2xl p-4">
        <StyledText className="text-white text-xl font-bold">{session.name}</StyledText>
        <StyledText className="text-slate-400 text-sm mt-1">{formatDate(session.started_at)}</StyledText>

        <StyledView className="flex-row gap-4 mt-3">
          <StyledView>
            <StyledText className="text-slate-400 text-xs">Duration</StyledText>
            <StyledText className="text-white font-semibold">{formatDuration(session.duration_seconds)}</StyledText>
          </StyledView>
          <StyledView>
            <StyledText className="text-slate-400 text-xs">Total Volume</StyledText>
            <StyledText className="text-white font-semibold">{totalVolume.toLocaleString()} kg</StyledText>
          </StyledView>
          <StyledView>
            <StyledText className="text-slate-400 text-xs">Sets</StyledText>
            <StyledText className="text-white font-semibold">{session.sets.length}</StyledText>
          </StyledView>
        </StyledView>
      </StyledView>

      {Object.entries(exerciseGroups).map(([name, sets]) => (
        <StyledView key={name} className="bg-surface rounded-2xl p-4">
          <StyledText className="text-slate-300 font-semibold text-sm mb-3 uppercase tracking-wide">{name}</StyledText>
          {sets.map((s) => <SetRow key={s.id} set={s} onDelete={() => {}} />)}
        </StyledView>
      ))}
    </StyledScroll>
  );
}
