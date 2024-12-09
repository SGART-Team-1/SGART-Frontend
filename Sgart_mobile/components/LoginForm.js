import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const LoginForm = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorEmail, setErrorEmail] = useState('');
  const [errorPassword, setErrorPassword] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    let hasError = false;
    setErrorEmail('');
    setErrorPassword('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setErrorEmail('El formato del correo electrónico no es válido.');
      hasError = true;
    }

    if (email === '') {
      setErrorEmail('Campo vacío');
      hasError = true;
    }

    if (password === '') {
      setErrorPassword('Campo vacío');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    const user = { email, password };

    try {
      setIsLoading(true);
      const response = await fetch('https://sgart-backend.onrender.com/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
        credentials: 'include',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error al iniciar sesión.');
      }

      const data = await response.json();

      if (data.user && data.user.blocked) {
        Alert.alert('Cuenta bloqueada', 'Por favor, contacta al soporte.');
        return;
      }

      Alert.alert(
        'Login exitoso',
        'Pasando a la autentificación con doble factor...',
        [{ text: 'OK', onPress: () => navigation.navigate('GoogleAuth', { data, email }) }]
      );
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.spinnerContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Background */}
      <Image
        source={require('../media/1206.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      {/* Login Form */}
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.loginBox}>
          <Image
            source={require('../media/logo_sgart-sinfondo.png')}
            style={styles.loginLogo}
          />
          <Text style={styles.loginTitle}>Iniciar Sesión</Text>

          <View style={styles.inputGroup}>
            <TextInput
              style={[styles.input, errorEmail ? styles.inputError : null]}
              placeholder="Usuario"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          {errorEmail ? <Text style={styles.errorText}>{errorEmail}</Text> : null}

          <View style={styles.inputGroup}>
            <TextInput
              style={[styles.input, errorPassword ? styles.inputError : null]}
              placeholder="Contraseña"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={togglePasswordVisibility}>
              <Image
                source={showPassword ? require('../media/password_on.png') : require('../media/password_off.png')}
                style={styles.passwordIcon}
              />
            </TouchableOpacity>
          </View>
          {errorPassword ? <Text style={styles.errorText}>{errorPassword}</Text> : null}

          <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Entrar</Text>
          </TouchableOpacity>

          <View style={styles.loginOptions}>
            <TouchableOpacity>
              <Text style={styles.optionText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.optionText}>Regístrate</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity>
          <Text style={styles.footerText}>Ayuda</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.footerText}>Condiciones</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.footerText}>Privacidad</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  loginBox: {
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    zIndex: 2,
  },
  loginLogo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#ff0000',
  },
  passwordIcon: {
    width: 20,
    height: 20,
    marginLeft: 10,
  },
  loginButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginOptions: {
    marginTop: 20,
    alignItems: 'center',
  },
  optionText: {
    color: '#007bff',
    marginBottom: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#007bff',
    paddingVertical: 10,
    zIndex: 3,
  },
  footerText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    opacity: 0.3,
    zIndex: -1,
  },
  errorText: {
    color: '#ff0000',
    marginBottom: 10,
    fontSize: 14,
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoginForm;
