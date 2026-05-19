import React, { useEffect, useState } from 'react';
import { FlatList, View, Text, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { styled } from 'nativewind';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useProgramStore } from '../../src/store/programStore';
import type { Program } from '../../src/types';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchable = styled(TouchableOpacity);

function ProgramItem({
  program,
  onPress,
  onDelete,
}: {
  program: Program;
  onPress: () => void;
  onDelete: () => void;
}) {
  const handleDelete = () => {
    Alert.alert(
      'Delete Program',
      `Delete "${program.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: onDelete },
      ],
    );
  };

  return (
    <StyledTouchable
      onPress={onPress}
      className="bg-surface mx-4 mb-3 rounded-2xl p-4 flex-row items-center"
    >
      <StyledView className="w-10 h-10 bg-purple-900 rounded-full items-center justify-center mr-3">
        <Ionicons name="list" size={20} color="#a855f7" />
      </StyledView>
      <StyledView className="flex-1">
        <StyledText className="text-white font-semibold text-base">{program.name}</StyledText>
        {program.description && (
          <StyledText className="text-slate-400 text-sm" numberOfLines={1}>{program.description}</StyledText>
        )}
      </StyledView>
      <StyledTouchable onPress={handleDelete} className="p-2 rounded-full active:bg-red-900">
        <Ionicons name="trash-outline" size={18} color="#ef4444" />
      </StyledTouchable>
      <Ionicons name="chevron-forward" size={18} color="#475569" />
    </StyledTouchable>
  );
}

export default function ProgramsScreen() {
  const router = useRouter();
  const { programs, isLoading, loadPrograms, deleteProgram } = useProgramStore();

  useEffect(() => { loadPrograms(); }, []);

  return (
    <StyledView className="flex-1 bg-background">
      <FlatList
        data={programs}
        keyExtractor={(p) => String(p.id)}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={loadPrograms} tintColor="#0ea5e9" />
        }
        renderItem={({ item }) => (
          <ProgramItem
            program={item}
            onPress={() => router.push(`/program/${item.id}`)}
            onDelete={() => deleteProgram(item.id)}
          />
        )}
        ListHeaderComponent={
          <StyledTouchable
            onPress={() => router.push('/program/create')}
            className="mx-4 mb-4 bg-primary-500 active:bg-primary-600 rounded-2xl p-4 flex-row items-center justify-center gap-2"
          >
            <Ionicons name="add-circle" size={20} color="#fff" />
            <StyledText className="text-white font-bold text-base">New Program</StyledText>
          </StyledTouchable>
        }
        ListEmptyComponent={
          !isLoading ? (
            <StyledView className="items-center py-20">
              <Ionicons name="list-outline" size={48} color="#334155" />
              <StyledText className="text-slate-500 text-base mt-3">No programs yet</StyledText>
            </StyledView>
          ) : null
        }
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 32 }}
      />
    </StyledView>
  );
}
