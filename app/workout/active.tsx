import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Modal, FlatList, Alert, TextInput } from 'react-native';
import { styled } from 'nativewind';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useWorkoutStore } from '../../src/store/workoutStore';
import { WorkoutTimer } from '../../src/components/workout/WorkoutTimer';
import { SetRow } from '../../src/components/workout/SetRow';
import { ExerciseCard } from '../../src/components/workout/ExerciseCard';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';
import { getAllExercises } from '../../src/services/exerciseService';
import type { Exercise } from '../../src/types';

const StyledScroll = styled(ScrollView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchable = styled(TouchableOpacity);
const StyledInput = styled(TextInput);

export default function ActiveWorkoutScreen() {
  const router = useRouter();
  const {
    activeSession,
    activeSets,
    draftSet,
    isLoading,
    startSession,
    finishSession,
    discardSession,
    setDraftSet,
    addSet,
    deleteSet,
  } = useWorkoutStore();

  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [nameInput, setNameInput] = useState('');
  const [showStartModal, setShowStartModal] = useState(!activeSession);

  const openExercisePicker = async () => {
    const list = await getAllExercises();
    setExercises(list);
    setShowExercisePicker(true);
  };

  const handleStart = async () => {
    if (!nameInput.trim()) return;
    await startSession(nameInput.trim());
    setShowStartModal(false);
  };

  const handleFinish = () => {
    Alert.alert(
      'Finish Workout',
      'Save and finish this workout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Finish',
          onPress: async () => {
            await finishSession();
            router.replace('/(tabs)');
          },
        },
      ],
    );
  };

  const handleDiscard = () => {
    Alert.alert(
      'Discard Workout',
      'Discard all sets and cancel this workout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Discard',
          style: 'destructive',
          onPress: async () => {
            await discardSession();
            router.replace('/(tabs)');
          },
        },
      ],
    );
  };

  const handleAddSet = async () => {
    if (!draftSet.exerciseId) return;
    await addSet(draftSet.exerciseId, draftSet.exerciseName);
  };

  const exerciseGroups = activeSets.reduce<Record<string, typeof activeSets>>(
    (acc, s) => {
      const key = s.exercise_name;
      if (!acc[key]) acc[key] = [];
      acc[key].push(s);
      return acc;
    },
    {},
  );

  if (!activeSession) {
    return (
      <StyledView className="flex-1 bg-background items-center justify-center p-6">
        <Modal visible={showStartModal} transparent animationType="fade">
          <StyledView className="flex-1 bg-black/70 items-center justify-center p-6">
            <StyledView className="bg-surface rounded-3xl p-6 w-full gap-4">
              <StyledText className="text-white text-xl font-bold">Start Workout</StyledText>
              <Input
                label="Workout name"
                placeholder="e.g. Push Day A"
                value={nameInput}
                onChangeText={setNameInput}
              />
              <Button label="Start" onPress={handleStart} loading={isLoading} fullWidth />
            </StyledView>
          </StyledView>
        </Modal>
      </StyledView>
    );
  }

  return (
    <StyledView className="flex-1 bg-background">
      <StyledView className="bg-surface px-4 py-3 flex-row items-center justify-between">
        <StyledView>
          <StyledText className="text-white font-bold text-base">{activeSession.name}</StyledText>
          <WorkoutTimer startedAt={activeSession.started_at} />
        </StyledView>
        <StyledView className="flex-row gap-2">
          <StyledTouchable onPress={handleDiscard} className="px-3 py-2 rounded-xl bg-red-900/50 active:bg-red-900">
            <StyledText className="text-red-300 text-sm font-medium">Discard</StyledText>
          </StyledTouchable>
          <StyledTouchable onPress={handleFinish} className="px-3 py-2 rounded-xl bg-green-700 active:bg-green-800">
            <StyledText className="text-white text-sm font-semibold">Finish</StyledText>
          </StyledTouchable>
        </StyledView>
      </StyledView>

      <StyledScroll className="flex-1" contentContainerClassName="p-4 gap-4">
        {Object.entries(exerciseGroups).map(([name, sets]) => (
          <StyledView key={name}>
            <StyledText className="text-slate-300 font-semibold text-sm mb-2 uppercase tracking-wide">{name}</StyledText>
            {sets.map((s) => <SetRow key={s.id} set={s} onDelete={deleteSet} />)}
          </StyledView>
        ))}

        <StyledView className="bg-surface rounded-2xl p-4 gap-3">
          <StyledTouchable
            onPress={openExercisePicker}
            className="flex-row items-center gap-2 bg-surface-raised rounded-xl px-4 py-3"
          >
            <Ionicons name="search" size={18} color="#64748b" />
            <StyledText className={draftSet.exerciseName ? 'text-white' : 'text-slate-500'}>
              {draftSet.exerciseName || 'Select exercise…'}
            </StyledText>
          </StyledTouchable>

          <StyledView className="flex-row gap-2">
            <StyledView className="flex-1">
              <Input
                label="Weight"
                placeholder="0"
                keyboardType="decimal-pad"
                value={draftSet.weight}
                onChangeText={(t) => setDraftSet({ weight: t })}
                unit="kg"
              />
            </StyledView>
            <StyledView className="flex-1">
              <Input
                label="Reps"
                placeholder="0"
                keyboardType="number-pad"
                value={draftSet.reps}
                onChangeText={(t) => setDraftSet({ reps: t })}
              />
            </StyledView>
            <StyledView className="flex-1">
              <Input
                label="RPE"
                placeholder="—"
                keyboardType="decimal-pad"
                value={draftSet.rpe}
                onChangeText={(t) => setDraftSet({ rpe: t })}
              />
            </StyledView>
          </StyledView>

          <Button
            label="Add Set"
            onPress={handleAddSet}
            disabled={!draftSet.exerciseId}
            fullWidth
          />
        </StyledView>
      </StyledScroll>

      <Modal visible={showExercisePicker} animationType="slide" presentationStyle="pageSheet">
        <StyledView className="flex-1 bg-background">
          <StyledView className="flex-row items-center justify-between px-4 py-3 bg-surface">
            <StyledText className="text-white font-bold text-lg">Choose Exercise</StyledText>
            <StyledTouchable onPress={() => setShowExercisePicker(false)} className="p-2">
              <Ionicons name="close" size={24} color="#94a3b8" />
            </StyledTouchable>
          </StyledView>
          <FlatList
            data={exercises}
            keyExtractor={(e) => String(e.id)}
            renderItem={({ item }) => (
              <StyledView className="px-4">
                <ExerciseCard
                  exercise={item}
                  onSelect={(ex) => {
                    setDraftSet({ exerciseId: ex.id, exerciseName: ex.name });
                    setShowExercisePicker(false);
                  }}
                />
              </StyledView>
            )}
            contentContainerStyle={{ padding: 8 }}
          />
        </StyledView>
      </Modal>
    </StyledView>
  );
}
