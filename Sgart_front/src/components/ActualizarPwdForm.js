import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const ActualizarPwdForm = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    const navigate = useNavigate();
    
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);
    const [errorRepetirContrasena, setErrorRepetirContrasena] = useState('');

    console.log('Token recibido en el componente:', token);

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            setErrorRepetirContrasena('La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula, un número y un carácter especial (@, $, !, %, *, ?, &).');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setErrorRepetirContrasena('');

        console.log('Iniciando validación de datos:', {
            tokenExists: !!token,
            emailExists: !!email,
            passwordsMatch: newPassword === confirmPassword,
            passwordLength: newPassword.length
        });

        if (!token) {
            setErrorMessage('Token inválido o expirado');
            return;
        }

        if (newPassword !== confirmPassword) {
            setErrorMessage('Las contraseñas no coinciden.');
            return;
        }

        if (!validatePassword(newPassword)) {
            return;
        }

        console.log('Datos a enviar al servidor:', {
            email: email,
            token: token,
            newPassword: newPassword.substring(0, 3) + '***'
        });

        try {
            const response = await fetch('/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    token: token,
                    newPassword: newPassword
                })
            });

            console.log('Respuesta del servidor:', {
                status: response.status,
                statusText: response.statusText,
                headers: Object.fromEntries(response.headers.entries())
            });

            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                const data = await response.json();
                console.log('Respuesta JSON del servidor:', data);

                if (response.ok) {
                    alert(data.message || 'Contraseña actualizada correctamente');
                    navigate('/');
                } else {
                    setErrorMessage(data.error || 'Error al actualizar la contraseña');
                    console.log('Error del servidor:', data.error);
                }
            } else {
                const text = await response.text();
                console.log('Respuesta no JSON del servidor:', text);
                setErrorMessage('Error en el formato de respuesta del servidor');
            }
        } catch (error) {
            console.error('Error en la petición:', {
                name: error.name,
                message: error.message,
                stack: error.stack
            });
            setErrorMessage(`Error de conexión: ${error.message}`);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleRepeatPasswordVisibility = () => {
        setShowRepeatPassword(!showRepeatPassword);
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <form onSubmit={handleSubmit}>
                    <h2>Actualizar Contraseña</h2>
                    
                    {errorMessage && (
                        <div className="error-message">{errorMessage}</div>
                    )}
                    {errorRepetirContrasena && (
                        <div className="error-message">{errorRepetirContrasena}</div>
                    )}

                    <div className="input-group">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                        <label htmlFor="newPassword">Nueva Contraseña</label>
                        <button type="button" onClick={togglePasswordVisibility} className="password-toggle-btn">
                            <img 
                                src={require(showPassword ? '../media/password_off.png' : '../media/password_on.png')} 
                                alt="Mostrar Contraseña" 
                            />
                        </button>
                    </div>

                    <div className="input-group">
                        <input
                            type={showRepeatPassword ? "text" : "password"}
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                        <button type="button" onClick={toggleRepeatPasswordVisibility} className="password-toggle-btn">
                            <img 
                                src={require(showRepeatPassword ? '../media/password_off.png' : '../media/password_on.png')} 
                                alt="Mostrar Contraseña" 
                            />
                        </button>
                    </div>

                    <button type="submit" className="login-btn">
                        Actualizar Contraseña
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ActualizarPwdForm;