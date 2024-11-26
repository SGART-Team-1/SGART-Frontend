import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../App.css';

const GoogleAuth = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { usuario, esAdmin } = location.state; // Extraemos el usuario de la ubicación
    const [inputCode, setInputCode] = useState('');
    const [message, setMessage] = useState('');
    const [qrCode, setQrCode] = useState('');
    const [secretKey, setSecretKey] = useState('');

    useEffect(() => {
        const fetchQRCode = async () => {
            try {
                const response = await fetch(`/auth/generate-qr?email=${usuario.email}`);
                if (!response.ok) {
                    throw new Error('Error al generar el código QR');
                }
                const data = await response.json();
                setQrCode(data.qrCode);
                setSecretKey(data.secretKey);
            } catch (error) {
                setMessage('Error al generar el código QR');
                console.error('Error al generar el código QR:', error);
            }
        };

        fetchQRCode();
    }, [usuario.email]);

    const handleInputChange = (event) => {
        setInputCode(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('/auth/validate-totp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ mail: usuario.email, code: inputCode }),
            });

            if (!response.ok) {
                throw new Error('Código de autenticación incorrecto');
            }

            const data = await response.json();
            if (data.status === 'valid' ) {
                if(!esAdmin){
                    // Registro del usuario después de la validación exitosa
                    await registrarUsuario(usuario.email); // Llama a la función para registrar al usuario
                    setMessage("Autenticación exitosa. Redirigiendo...");
                    navigate('/user-calendar');
                }else{
                    // Registro del usuario después de la validación exitosa
                    await registrarAdmin(usuario.email); // Llama a la función para registrar al usuario
                    setMessage("Autenticación exitosa. Redirigiendo...");
                    navigate('/admin-panel')
                }
            } else {
                setMessage("Código inválido. Por favor, intenta nuevamente.");
            }
        } catch (error) {
            setMessage("Error al validar el código.");
            console.error("Error en la autenticación:", error);
        }
    };

    const registrarUsuario = async (email) => {
        try {
            const secretKeySend = secretKey;
            const usuarioActualizado = {
                ...usuario, // Copia todos los campos del usuario original
                twoFactorAuthCode: secretKeySend // Actualiza el campo twoFactorAuthCode
            };

            console.log(usuarioActualizado);
            const response = await fetch('/users/registro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(usuarioActualizado), // Envía el correo y la secret key
            });

            if (!response.ok) {
                throw new Error('Error al registrar el usuario');
            }

            const result = await response.json();
            console.log('Usuario registrado:', result);
            setMessage("Usuario registrado con éxito.");
        } catch (error) {
            setMessage("Error al registrar al usuario.");
            console.error("Error en el registro:", error);
        }
    };

    const registrarAdmin = async (email) =>{
        try {
            const secretKeySend = secretKey;
            const adminActualizado = {
                ...usuario, // Copia todos los campos del usuario original
                twoFactorAuthCode: secretKeySend // Actualiza el campo twoFactorAuthCode
            };

            const response = await fetch('/admin/crearAdmin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(adminActualizado), // Envía el correo y la secret key
            });

            if (!response.ok) {
                throw new Error('Error al registrar el admin');
            }

            const result = await response.json();
            console.log('Admin registrado:', result);
            setMessage("Admin registrado con éxito.");
        } catch (error) {
            setMessage("Error al registrar al admin.");
            console.error("Error en el registro:", error);
        }
    }

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Bienvenido</h2>
                <p>Por favor escanea el código QR con tu dispositivo móvil para configurar Google Authenticator:</p>
                <div className="qr-container">
                    {qrCode ? (
                        <img src={`data:image/png;base64,${qrCode}`} alt="Código QR" />
                    ) : (
                        <div className='qr-placeholder'>
                            <p>Código QR no disponible</p>
                        </div>
                    )}
                </div>
                <br />
                <h3>Introduce tu código de Google Authenticator</h3>
                <input
                    type="text"
                    id="codeInput"
                    value={inputCode}
                    onChange={handleInputChange}
                    className="code-input"
                    placeholder="Introduce el código"
                />
                <br />
                <br />
                <div>
                    <button onClick={handleSubmit} className='login-btn'>Verificar</button>
                </div>
                {message && <p>{message}</p>}
            </div>
        </div>
    );
};

export default GoogleAuth;