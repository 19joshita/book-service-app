import React from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  TextStyle,
} from "react-native";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  labelColor?: string;
  inputStyle?: TextStyle; // << add this
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  labelColor,
  inputStyle,
  ...rest
}) => {
  return (
    <View style={{ marginBottom: 12 }}>
      {label && (
        <Text style={[styles.label, { color: labelColor || "#FFFFFF" }]}>
          {label}
        </Text>
      )}

      <TextInput
        style={[styles.input, inputStyle, error ? styles.errorInput : {}]}
        placeholderTextColor="rgba(255,255,255,0.6)"
        {...rest}
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  label: {
    marginBottom: 4,
    fontWeight: "500",
    fontSize: 14,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 10,
    fontSize: 16,
    color: "#FFFFFF", // white input text
  },
  errorInput: {
    borderColor: "#FF4C4C",
  },
  errorText: {
    marginTop: 3,
    color: "#FF4C4C",
    fontSize: 12,
  },
});
