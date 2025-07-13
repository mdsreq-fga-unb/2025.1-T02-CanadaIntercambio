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

  // Criar estilo dinâmico para o botão
  const getButtonStyle = () => {
    let buttonStyle = { ...styles.button };
    
    // Aplicar variante
    if (variant === 'primary') {
      buttonStyle = { ...buttonStyle, ...styles.primaryButton };
    } else if (variant === 'secondary') {
      buttonStyle = { ...buttonStyle, ...styles.secondaryButton };
    } else if (variant === 'outline') {
      buttonStyle = { ...buttonStyle, ...styles.outlineButton };
    }
    
    // Aplicar tamanho
    if (size === 'small') {
      buttonStyle = { ...buttonStyle, ...styles.smallButton };
    } else if (size === 'medium') {
      buttonStyle = { ...buttonStyle, ...styles.mediumButton };
    } else if (size === 'large') {
      buttonStyle = { ...buttonStyle, ...styles.largeButton };
    }
    
    // Aplicar estado desabilitado
    if (isDisabled) {
      buttonStyle = { ...buttonStyle, ...styles.disabledButton };
    }
    
    return [buttonStyle, style];
  };

  // Criar estilo dinâmico para o texto
  const getTextStyle = () => {
    let textStyle = { ...styles.buttonText };
    
    // Aplicar cor da variante
    if (variant === 'primary') {
      textStyle = { ...textStyle, ...styles.primaryText };
    } else if (variant === 'secondary') {
      textStyle = { ...textStyle, ...styles.secondaryText };
    } else if (variant === 'outline') {
      textStyle = { ...textStyle, ...styles.outlineText };
    }
    
    // Aplicar tamanho de texto
    if (size === 'small') {
      textStyle = { ...textStyle, ...styles.smallText };
    } else if (size === 'medium') {
      textStyle = { ...textStyle, ...styles.mediumText };
    } else if (size === 'large') {
      textStyle = { ...textStyle, ...styles.largeText };
    }
    
    // Aplicar estado desabilitado
    if (isDisabled) {
      textStyle = { ...textStyle, ...styles.disabledText };
    }
    
    return textStyle;
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'primary' ? '#fff' : '#CC2027'} 
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
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  
  // Variants
  primaryButton: {
    backgroundColor: '#CC2027',
    borderColor: '#CC2027',
  },
  secondaryButton: {
    backgroundColor: '#f8f9fa',
    borderColor: '#dee2e6',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderColor: '#CC2027',
  },
  
  // Sizes
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  mediumButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  largeButton: {
    paddingVertical: 16,
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
    fontSize: 16,
  },
  primaryText: {
    color: '#fff',
  },
  secondaryText: {
    color: '#6c757d',
  },
  outlineText: {
    color: '#CC2027',
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
