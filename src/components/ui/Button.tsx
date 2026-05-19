import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { styled } from 'nativewind';

const StyledTouchable = styled(TouchableOpacity);
const StyledText = styled(Text);

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, { container: string; text: string }> = {
  primary:   { container: 'bg-primary-500 active:bg-primary-600', text: 'text-white font-semibold' },
  secondary: { container: 'bg-surface-raised active:bg-surface-overlay border border-slate-600', text: 'text-slate-100 font-medium' },
  danger:    { container: 'bg-red-600 active:bg-red-700', text: 'text-white font-semibold' },
  ghost:     { container: 'active:bg-surface-raised', text: 'text-primary-400 font-medium' },
};

const sizeClasses: Record<Size, { container: string; text: string }> = {
  sm: { container: 'px-3 py-1.5 rounded-lg', text: 'text-sm' },
  md: { container: 'px-5 py-2.5 rounded-xl', text: 'text-base' },
  lg: { container: 'px-6 py-3.5 rounded-2xl', text: 'text-lg' },
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
}: ButtonProps) {
  const vc = variantClasses[variant];
  const sc = sizeClasses[size];
  const isDisabled = disabled || loading;

  return (
    <StyledTouchable
      onPress={onPress}
      disabled={isDisabled}
      className={`flex-row items-center justify-center ${vc.container} ${sc.container} ${fullWidth ? 'w-full' : ''} ${isDisabled ? 'opacity-50' : ''}`}
    >
      {loading && <ActivityIndicator size="small" color="#fff" className="mr-2" />}
      <StyledText className={`${vc.text} ${sc.text}`}>{label}</StyledText>
    </StyledTouchable>
  );
}
