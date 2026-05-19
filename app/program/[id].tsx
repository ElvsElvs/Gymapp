import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, ActivityIndicator } from 'react-native';
import { styled } from 'nativewind';
import { useLocalSearchParams } from 'expo-router';
import { getProgramById } from '../../src/services/programService';
import type { Program } from '../../src/types';
import { Card } from '../../src/components/ui/Card';

const StyledScroll = styled(ScrollView);
const StyledView = styled(View);
const StyledText = styled(Text);

export default function ProgramDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getProgramById(Number(id))
      .then(setProgram)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <StyledView className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#0ea5e9" />
      </StyledView>
    );
  }

  if (!program) {
    return (
      <StyledView className="flex-1 bg-background items-center justify-center">
        <StyledText className="text-slate-400">Program not found</StyledText>
      </StyledView>
    );
  }

  return (
    <StyledScroll className="flex-1 bg-background" contentContainerClassName="p-4 gap-4">
      <Card>
        <StyledText className="text-white text-xl font-bold">{program.name}</StyledText>
        {program.description && (
          <StyledText className="text-slate-400 mt-2">{program.description}</StyledText>
        )}
        <StyledText className="text-slate-500 text-xs mt-3">
          Created {new Date(program.created_at * 1000).toLocaleDateString('en-GB')}
        </StyledText>
      </Card>
    </StyledScroll>
  );
}
