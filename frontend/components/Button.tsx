import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle 
} from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
}

export const Button: React.FC<ButtonProps> = ({
  title,
  loading = false,
  variant = 'primary',
  size = 'medium',
  style,
  disabled,
  ...props
}) => {
  const isDisabled = disabled || loading;

  const getButtonStyle = (): ViewStyle => {
    const baseStyle = { ...styles.button };
    
    // Variant styles
    if (variant === 'primary') Object.assign(baseStyle, styles.primaryButton);
    if (variant === 'secondary') Object.assign(baseStyle, styles.secondaryButton);
    if (variant === 'outline') Object.assign(baseStyle, styles.outlineButton);
    
    // Size styles
    if (size === 'small') Object.assign(baseStyle, styles.smallButton);
    if (size === 'medium') Object.assign(baseStyle, styles.mediumButton);
    if (size === 'large') Object.assign(baseStyle, styles.largeButton);
    
    // Disabled style
    if (isDisabled) Object.assign(baseStyle, styles.disabledButton);
    
    return { ...baseStyle, ...(style as ViewStyle) };
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle = { ...styles.buttonText };
    
    // Variant text styles
    if (variant === 'primary') Object.assign(baseStyle, styles.primaryText);
    if (variant === 'secondary') Object.assign(baseStyle, styles.secondaryText);
    if (variant === 'outline') Object.assign(baseStyle, styles.outlineText);
    
    // Size text styles
    if (size === 'small') Object.assign(baseStyle, styles.smallText);
    if (size === 'medium') Object.assign(baseStyle, styles.mediumText);
    if (size === 'large') Object.assign(baseStyle, styles.largeText);
    
    // Disabled text style
    if (isDisabled) Object.assign(baseStyle, styles.disabledText);
    
    return baseStyle;
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'primary' ? '#fff' : '#cb2328'} 
          size="small" 
        />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  
  // Variants
  primaryButton: {
    backgroundColor: '#cb2328',
    borderColor: '#cb2328',
  },
  secondaryButton: {
    backgroundColor: '#f8f9fa',
    borderColor: '#dee2e6',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderColor: '#cb2328',
  },
  
  // Sizes
  smallButton: {
    height: 36,
    paddingHorizontal: 16,
  },
  mediumButton: {
    height: 45,
    paddingHorizontal: 20,
  },
  largeButton: {
    height: 52,
    paddingHorizontal: 24,
  },
  
  // States
  disabledButton: {
    opacity: 0.6,
  },
  
  // Text styles
  buttonText: {
    fontWeight: 'bold',
  },
  primaryText: {
    color: '#fff',
  },
  secondaryText: {
    color: '#6c757d',
  },
  outlineText: {
    color: '#cb2328',
  },
  
  // Text sizes
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  
  disabledText: {
    opacity: 0.7,
  },
});
