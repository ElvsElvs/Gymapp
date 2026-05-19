import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import type { WorkoutSetWithExercise } from '../../types';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchable = styled(TouchableOpacity);

interface SetRowProps {
  set: WorkoutSetWithExercise;
  onDelete: (id: number) => void;
}

export function SetRow({ set, onDelete }: SetRowProps) {
  return (
    <StyledView className="flex-row items-center bg-surface-raised rounded-xl px-4 py-3 mb-2">
      <StyledView className="w-8 items-center">
        <StyledText className="text-slate-400 text-sm font-bold">{set.set_number}</StyledText>
      </StyledView>

      <StyledView className="flex-1 flex-row gap-4">
        {set.weight_kg != null && (
          <StyledView className="items-center">
            <StyledText className="text-white font-semibold text-base">{set.weight_kg}</StyledText>
            <StyledText className="text-slate-400 text-xs">kg</StyledText>
          </StyledView>
        )}
        {set.reps != null && (
          <StyledView className="items-center">
            <StyledText className="text-white font-semibold text-base">{set.reps}</StyledText>
            <StyledText className="text-slate-400 text-xs">reps</StyledText>
          </StyledView>
        )}
        {set.rpe != null && (
          <StyledView className="items-center">
            <StyledText className="text-primary-400 font-semibold text-base">@{set.rpe}</StyledText>
            <StyledText className="text-slate-400 text-xs">RPE</StyledText>
          </StyledView>
        )}
      </StyledView>

      <StyledTouchable
        onPress={() => onDelete(set.id)}
        className="w-8 h-8 items-center justify-center rounded-full active:bg-red-900"
      >
        <StyledText className="text-red-400 text-lg">×</StyledText>
      </StyledTouchable>
    </StyledView>
  );
}
