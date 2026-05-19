import React from 'react';
import { View, ViewProps } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);

interface CardProps extends ViewProps {
  children: React.ReactNode;
  elevated?: boolean;
}

export function Card({ children, elevated = false, className = '', ...rest }: CardProps) {
  return (
    <StyledView
      className={`bg-surface rounded-2xl p-4 ${elevated ? 'shadow-lg' : ''} ${className}`}
      {...rest}
    >
      {children}
    </StyledView>
  );
}
