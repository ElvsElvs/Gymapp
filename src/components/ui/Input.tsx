import React, { useState } from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledInput = styled(TextInput);

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  unit?: string;
}

export function Input({ label, error, unit, className = '', ...rest }: InputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <StyledView className="gap-1">
      {label && (
        <StyledText className="text-slate-400 text-sm font-medium">{label}</StyledText>
      )}
      <StyledView className={`flex-row items-center bg-surface-raised rounded-xl border ${focused ? 'border-primary-500' : 'border-slate-700'} ${error ? 'border-red-500' : ''}`}>
        <StyledInput
          className={`flex-1 text-slate-100 text-base px-4 py-3 ${className}`}
          placeholderTextColor="#64748b"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...rest}
        />
        {unit && (
          <StyledText className="text-slate-400 text-sm pr-4">{unit}</StyledText>
        )}
      </StyledView>
      {error && (
        <StyledText className="text-red-400 text-xs">{error}</StyledText>
      )}
    </StyledView>
  );
}
