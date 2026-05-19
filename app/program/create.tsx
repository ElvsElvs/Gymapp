import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { styled } from 'nativewind';
import { useRouter } from 'expo-router';
import { useProgramStore } from '../../src/store/programStore';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledKAV = styled(KeyboardAvoidingView);
const StyledScroll = styled(ScrollView);

export default function CreateProgramScreen() {
  const router = useRouter();
  const { createProgram, isLoading } = useProgramStore();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [nameError, setNameError] = useState('');

  const handleCreate = async () => {
    if (!name.trim()) {
      setNameError('Program name is required');
      return;
    }
    await createProgram(name.trim(), description.trim() || undefined);
    router.back();
  };

  return (
    <StyledKAV
      className="flex-1 bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StyledScroll contentContainerClassName="p-6 gap-4">
        <StyledText className="text-white text-lg font-semibold">Program Details</StyledText>
        <Input
          label="Name"
          placeholder="e.g. 5/3/1 BBB"
          value={name}
          onChangeText={(t) => { setName(t); setNameError(''); }}
          error={nameError}
        />
        <Input
          label="Description (optional)"
          placeholder="What is this program about?"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          style={{ height: 100 }}
        />
        <Button
          label="Create Program"
          onPress={handleCreate}
          loading={isLoading}
          fullWidth
        />
      </StyledScroll>
    </StyledKAV>
  );
}
