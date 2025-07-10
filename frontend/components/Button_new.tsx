import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  TouchableOpacityProps,
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

  const getButtonStyles = () => {
    const baseStyles = [styles.button];
    
    // Variant styles
    switch (variant) {
      case 'primary':
        baseStyles.push(styles.primaryButton);
        break;
      case 'secondary':
        baseStyles.push(styles.secondaryButton);
        break;
      case 'outline':
        baseStyles.push(styles.outlineButton);
        break;
    }
    
    // Size styles
    switch (size) {
      case 'small':
        baseStyles.push(styles.smallButton);
        break;
      case 'medium':
        baseStyles.push(styles.mediumButton);
        break;
      case 'large':
        baseStyles.push(styles.largeButton);
        break;
    }
    
    // Disabled style
    if (isDisabled) {
      baseStyles.push(styles.disabledButton);
    }
    
    // Custom style
    if (style) {
      baseStyles.push(style);
    }
    
    return baseStyles;
  };

  const getTextStyles = () => {
    const textStyles = [styles.buttonText];
    
    // Variant text styles
    switch (variant) {
      case 'primary':
        textStyles.push(styles.primaryText);
        break;
      case 'secondary':
        textStyles.push(styles.secondaryText);
        break;
      case 'outline':
        textStyles.push(styles.outlineText);
        break;
    }
    
    // Size text styles
    switch (size) {
      case 'small':
        textStyles.push(styles.smallText);
        break;
      case 'medium':
        textStyles.push(styles.mediumText);
        break;
      case 'large':
        textStyles.push(styles.largeText);
        break;
    }
    
    // Disabled text style
    if (isDisabled) {
      textStyles.push(styles.disabledText);
    }
    
    return textStyles;
  };

  return (
    <TouchableOpacity
      style={getButtonStyles()}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'primary' ? '#fff' : '#cb2328'} 
          size="small" 
        />
      ) : (
        <Text style={getTextStyles()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    minHeight: 45,
    paddingHorizontal: 20,
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
    minHeight: 36,
    paddingHorizontal: 16,
  },
  mediumButton: {
    minHeight: 45,
    paddingHorizontal: 20,
  },
  largeButton: {
    minHeight: 52,
    paddingHorizontal: 24,
  },
  
  // States
  disabledButton: {
    opacity: 0.6,
  },
  
  // Text styles
  buttonText: {
    fontWeight: 'bold',
    textAlign: 'center',
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
