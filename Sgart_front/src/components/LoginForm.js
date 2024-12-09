import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../media/1206.png';
import logoSgart2 from '../media/logo_sgart-sinfondo-cortado.png';
import logoSgart from '../media/logo_sgart-sinfondo.png';
import '../styles/styles.css';
import LoadingSpinner from './LoadingSpinner';
import RecuperarPwdForm from './RecuperarPwdForm';
import RegisterForm from './RegisterForm';



const LoginForm = () => {
    const navigate = useNavigate();

    // Estados de cada campo del formulario
    const [email, setEmail] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [isNoPwd, setIsNoPwd] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const [errorEmail, setErrorEmail] = useState('');
    const [errorPassword, setErrorPassword] = useState('');

    // Cambios en los campos del formulario
    const handleChange = (event) => {
        const { name, value } = event.target;
        switch (name) {
            case 'email':
                setEmail(value);
                break;
            case 'contrasena':
                setContrasena(value);
                break;
            default:
                break;
        }
    };

    const toogleError = useCallback(() => {
        setError(true);
    });

    const handleLogin = () => {
        let hasError = false;
        setError(false);
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

        if (contrasena === '') {
            setErrorPassword('Campo vacío');
            hasError = true;
        }

        if (hasError) {
            setError(true);
            return;
        }

        const user = {
            email: email,
            password: contrasena,
        };

        fetch('https://sgart-backend.onrender.com/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
            credentials: 'include', // Enviar y recibir cookies de sesión
        })
            .then((response) => {
                setIsLoading(true);
                if (!response.ok) {
                    return response.json().then((data) => {
                        if (response.status === 403) {
                            throw new Error('Los inicios de sesión están bloqueados temporalmente.');
                        } else if (response.status === 401) {
                            throw new Error(data.message || 'Error al iniciar sesión. Correo y/o contraseña incorrectos');
                        }
                        throw new Error(data.message || 'Error al iniciar sesión.');
                    });
                }
                return response.json();
            })
            .then((data) => {

                if (data.user && data.user.blocked) {
                    alert('Tu cuenta está bloqueada. Por favor, contacta al soporte.');
                    return;
                }

                alert('Login exitoso. Pasando a la autentificación con doble factor...');
                navigate('/google-auth-login', { state: { data: data, email: email } });
            })
            .catch((error) => {
                alert(error.message);
            })
            .finally(() => {
                setIsLoading(false);
            }); 
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const handleToggleForm = () => {
        setIsRegistering(true);
    };

    if (isRegistering) {
        return <RegisterForm />;
    }

    const handleToggleForm_2 = () => {
        setIsNoPwd(true);
    }

    if (isNoPwd) {
        return <RecuperarPwdForm />;
    }

    return (
        <>
         {isLoading ? (
                <LoadingSpinner />
            ) : (
            <div className="login-container">
                <div className="header-bar">
                        <img src={logoSgart2} alt="Logo Sgart" className="header-logo" />
                        <div className="header-links">
                            <a href="/ayuda">Ayuda</a>
                            <a href="/condiciones">Condiciones</a>
                            <a href="/privacidad">Privacidad</a>
                        </div>
                    </div>
                <div className="login-box">
                    <img src={logoSgart} alt="Logo Sgart" className="login-logo" />

                    
                    <h2 className="login-title">Iniciar Sesión</h2>
                    <div className={errorEmail === '' ? "input-group" : "input-group-error"}>
                        <input type="text" id="email" name="email" value={email} onChange={handleChange} required />
                        <label htmlFor="email">Usuario</label>
                    </div>
                    <label className="error">{errorEmail}</label>
                    <div className={errorPassword === '' ? "input-group" : "input-group-error"}>
                        <input type={showPassword ? "text" : "password"} id="contrasena" name="contrasena" value={contrasena} onChange={handleChange} required />
                        <label htmlFor="contrasena">Contraseña</label>
                        <button type="button" onClick={togglePasswordVisibility} className="password-toggle-btn">
                            <img src={require(showPassword ? '../media/password_off.png' : '../media/password_on.png')} alt='Mostrar Contraseña' />
                        </button>
                    </div>
                    <label className="error">{errorPassword}</label>
                    <button onClick={handleLogin} className="login-btn">Entrar</button>
                    <div className="login-options">
                        <a href="#" onClick={handleToggleForm_2}>¿Olvidaste tu contraseña?</a>
                        <a href="#" onClick={handleToggleForm}>Regístrate</a>
                    </div>
                </div>
                <img src={backgroundImage} alt="Decorative Background" className="background-image" />

                </div>
            )}
        </>
    );
};

export default LoginForm;