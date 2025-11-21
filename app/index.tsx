import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import * as Yup from "yup";
import { login } from "../src/store/slices/authSlice";
import Input from "@/src/component/Input";
import Button from "@/src/component/Button";
import { useDispatch } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";

const PRIMARY = "#0FB9B1"; // teal theme

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Login = () => {
  const router: any = useRouter();
  const dispatch = useDispatch();

  const handleLogin = (values: { email: string; password: string }) => {
    if (
      values.email === "user@example.com" &&
      values.password === "1234567890"
    ) {
      dispatch(login({ email: values.email }));
      router.replace("/(tabs)/services");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.centerContainer}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Login to continue</Text>

            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={LoginSchema}
              onSubmit={handleLogin}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
              }) => (
                <View style={styles.form}>
                  {/* Transparent Dark Input */}
                  <Input
                    label="Email"
                    placeholder="Enter your email"
                    placeholderTextColor="#888"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.input}
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    value={values.email}
                    error={
                      touched.email && errors.email ? errors.email : undefined
                    }
                  />

                  <Input
                    label="Password"
                    placeholder="Enter your password"
                    placeholderTextColor="#888"
                    secureTextEntry
                    style={styles.input}
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    value={values.password}
                    error={
                      touched.password && errors.password
                        ? errors.password
                        : undefined
                    }
                  />

                  <Button
                    title="Login"
                    onPress={handleSubmit as any}
                    style={{ marginTop: 24 }}
                  />
                </View>
              )}
            </Formik>
          </View>

          <StatusBar barStyle="light-content" backgroundColor="#1B1B1B" />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#1B1B1B",
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  centerContainer: {
    flex: 1,
    justifyContent: "center",
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
    color: PRIMARY,
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 15,
    textAlign: "center",
    color: "#aaa",
    marginBottom: 40,
  },

  form: {
    width: "100%",
  },

  // Transparent Input Style
  input: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    padding: 14,
    marginBottom: 18,
    color: "#fff",
  },
});
