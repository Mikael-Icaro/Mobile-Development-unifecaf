import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice';

export default function LoginScreen() {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [invalidCombo, setInvalidCombo] = useState(false);

  function handleLogin() {
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();
    const nextErrors = {};

    if (!trimmedUsername) nextErrors.username = 'Campo obrigatório';
    if (!trimmedPassword) nextErrors.password = 'Campo obrigatório';

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setInvalidCombo(false);
      return;
    }

    if (trimmedUsername.length < 3 || trimmedPassword.length < 4) {
      setErrors({});
      setInvalidCombo(true);
      return;
    }

    setErrors({});
    setInvalidCombo(false);
    dispatch(login({ username: trimmedUsername }));
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bem-vindo de volta!</Text>
        <Text style={styles.headerSubtitle}>
          Insira seus dados para entrar na sua conta.
        </Text>
      </View>

      <View style={styles.form}>
        {invalidCombo ? (
          <Text style={styles.comboError}>Usuário ou senha inválidos</Text>
        ) : null}

        <Text style={styles.label}>Usuário</Text>
        <TextInput
          style={[styles.input, errors.username && styles.inputError]}
          autoCapitalize="none"
          value={username}
          onChangeText={(text) => {
            setUsername(text);
            setInvalidCombo(false);
          }}
        />
        {errors.username ? <Text style={styles.fieldError}>{errors.username}</Text> : null}

        <Text style={styles.label}>Senha</Text>
        <View style={[styles.passwordRow, errors.password && styles.inputError]}>
          <TextInput
            style={styles.passwordInput}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setInvalidCombo(false);
            }}
          />
          <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)}>
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#888"
            />
          </TouchableOpacity>
        </View>
        {errors.password ? <Text style={styles.fieldError}>{errors.password}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#2f6fed',
    paddingTop: 80,
    paddingBottom: 32,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 6,
  },
  headerSubtitle: {
    color: '#e3ebff',
    fontSize: 14,
  },
  form: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  comboError: {
    color: '#c0392b',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '600',
  },
  label: {
    fontSize: 13,
    color: '#555',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 14,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#c0392b',
  },
  fieldError: {
    color: '#c0392b',
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    backgroundColor: '#2f6fed',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 28,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
