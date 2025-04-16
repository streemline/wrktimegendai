import React from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useThemeColor } from '@/hooks/useThemeColor';

// This component is a placeholder for system icons
// In a real implementation, this would use something like SF Symbols on iOS
// or Material Icons on Android

export interface IconSymbolProps {
  name: string;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
}

export function IconSymbol({ name, size = 24, color, style }: IconSymbolProps) {
  const colorScheme = useColorScheme();
  const defaultColor = useThemeColor({ light: '#000', dark: '#fff' });
  const iconColor = color || defaultColor;

  // Map common icon names to basic symbol representations
  // In a real app, this would use a proper icon system
  const getIconSymbol = () => {
    switch (name) {
      case 'plus.circle.fill':
        return '+';
      case 'trash':
        return '🗑️';
      case 'clock':
      case 'clock.fill':
        return '🕒';
      case 'hourglass':
        return '⏳';
      case 'dollarsign.circle':
        return '💲';
      case 'face.smiling':
        return '😊';
      case 'bolt':
        return '⚡';
      case 'text.bubble':
        return '💬';
      case 'calendar.badge.clock':
        return '📅';
      case 'chart.bar.xaxis':
        return '📊';
      case 'chart.xyaxis.line':
        return '📈';
      case 'chart.bar.fill':
        return '📊';
      case 'doc.text.fill':
        return '📄';
      case 'gear':
        return '⚙️';
      case 'timer':
        return '⏱️';
      case 'person.fill':
        return '👤';
      case 'arrow.right.circle':
        return '🚪';
      case 'chevron.right':
        return '›';
      case 'checkmark':
        return '✓';
      default:
        return '•';
    }
  };

  return (
    <Text
      style={[
        {
          fontSize: size,
          color: iconColor,
          fontWeight: 'bold',
          textAlign: 'center',
          width: size * 1.2,
          height: size * 1.2,
        },
        style,
      ]}
    >
      {getIconSymbol()}
    </Text>
  );
}