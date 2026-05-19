import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import type { Exercise } from '../../types';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchable = styled(TouchableOpacity);

interface ExerciseCardProps {
  exercise: Exercise;
  onSelect: (exercise: Exercise) => void;
  selected?: boolean;
}

const MUSCLE_COLORS: Record<string, string> = {
  chest:     'bg-red-900 text-red-300',
  back:      'bg-blue-900 text-blue-300',
  shoulders: 'bg-orange-900 text-orange-300',
  biceps:    'bg-purple-900 text-purple-300',
  triceps:   'bg-pink-900 text-pink-300',
  legs:      'bg-green-900 text-green-300',
  glutes:    'bg-yellow-900 text-yellow-300',
  core:      'bg-teal-900 text-teal-300',
  cardio:    'bg-cyan-900 text-cyan-300',
};

export function ExerciseCard({ exercise, onSelect, selected = false }: ExerciseCardProps) {
  const muscleColor = exercise.muscle_group
    ? (MUSCLE_COLORS[exercise.muscle_group] ?? 'bg-slate-700 text-slate-300')
    : 'bg-slate-700 text-slate-300';

  const [bg, fg] = muscleColor.split(' ');

  return (
    <StyledTouchable
      onPress={() => onSelect(exercise)}
      className={`bg-surface-raised rounded-xl px-4 py-3 mb-2 border-2 ${selected ? 'border-primary-500' : 'border-transparent'}`}
    >
      <StyledView className="flex-row items-center justify-between">
        <StyledText className="text-white font-medium text-base flex-1">{exercise.name}</StyledText>
        {exercise.muscle_group && (
          <StyledView className={`rounded-full px-2 py-0.5 ${bg}`}>
            <StyledText className={`text-xs font-medium ${fg}`}>
              {exercise.muscle_group}
            </StyledText>
          </StyledView>
        )}
      </StyledView>
      {exercise.equipment && (
        <StyledText className="text-slate-400 text-sm mt-1">{exercise.equipment}</StyledText>
      )}
    </StyledTouchable>
  );
}
