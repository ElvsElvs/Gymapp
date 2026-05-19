import React, { useEffect } from 'react';
import { FlatList, View, Text, TouchableOpacity, RefreshControl } from 'react-native';
import { styled } from 'nativewind';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useWorkoutStore } from '../../src/store/workoutStore';
import type { WorkoutSession } from '../../src/types';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchable = styled(TouchableOpacity);

function formatDate(ts: number): string {
  return new Date(ts * 1000).toLocaleDateString('en-GB', {
    weekday: 'short', day: 'numeric', month: 'short',
  });
}

function formatDuration(secs: number | null): string {
  if (!secs) return '';
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m} min`;
}

function SessionItem({ session, onPress }: { session: WorkoutSession; onPress: () => void }) {
  return (
    <StyledTouchable
      onPress={onPress}
      className="bg-surface mx-4 mb-3 rounded-2xl p-4 flex-row items-center"
    >
      <StyledView className="w-10 h-10 bg-primary-900 rounded-full items-center justify-center mr-3">
        <Ionicons name="barbell" size={20} color="#0ea5e9" />
      </StyledView>
      <StyledView className="flex-1">
        <StyledText className="text-white font-semibold text-base">{session.name}</StyledText>
        <StyledText className="text-slate-400 text-sm">{formatDate(session.started_at)}</StyledText>
      </StyledView>
      {session.duration_seconds && (
        <StyledText className="text-slate-300 text-sm mr-2">{formatDuration(session.duration_seconds)}</StyledText>
      )}
      <Ionicons name="chevron-forward" size={18} color="#475569" />
    </StyledTouchable>
  );
}

export default function WorkoutsScreen() {
  const router = useRouter();
  const { sessions, isLoading, loadSessions } = useWorkoutStore();

  useEffect(() => { loadSessions(); }, []);

  return (
    <StyledView className="flex-1 bg-background">
      <FlatList
        data={sessions}
        keyExtractor={(s) => String(s.id)}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={loadSessions} tintColor="#0ea5e9" />
        }
        renderItem={({ item }) => (
          <SessionItem session={item} onPress={() => router.push(`/workout/${item.id}`)} />
        )}
        ListEmptyComponent={
          !isLoading ? (
            <StyledView className="flex-1 items-center justify-center py-20">
              <Ionicons name="barbell-outline" size={48} color="#334155" />
              <StyledText className="text-slate-500 text-base mt-3">No workouts yet</StyledText>
            </StyledView>
          ) : null
        }
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 32 }}
      />
    </StyledView>
  );
}
