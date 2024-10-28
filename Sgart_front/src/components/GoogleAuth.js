import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const GoogleAuth = () => {
    const [inputCode, setInputCode] = useState('');
    const [qrCode, setQrCode] = useState('');
    const [secretKey, setSecretKey] = useState('');
    const [message, setMessage] = useState('');

    // Solicita el código QR al cargar el componente
    useEffect(() => {
        const fetchQRCode = async () => {
            try {
                // Asegúrate de reemplazar 'user@example.com' con el email del usuario actual
                const response = await axios.get('/Auth/generate-qr', {
                    params: { email: 'user@example.com' }
                });
                setQrCode(response.data.qrCode);
                setSecretKey(response.data.secretKey); // Guarda la clave secreta si es necesario
            } catch (error) {
                console.error("Error al obtener el código QR:", error);
                setMessage("Error al cargar el código QR.");
            }
        };
        fetchQRCode();
    }, []);

    // Actualiza el estado del código ingresado por el usuario
    const handleInputChange = (event) => {
        setInputCode(event.target.value);
    };

    // Envía el código ingresado al backend para validar
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('/Auth/validate-totp', {
                mail: 'user@example.com', // Coger usuario del backend
                code: inputCode
            });
            
            if (response.data.status === 'valid') {
                setMessage("Código válido. Redirigiendo...");
                
            } else {
                setMessage("Código inválido. Inténtalo de nuevo.");
            }
        } catch (error) {
            setMessage("Error en la validación del código.");
            console.error("Error al validar el código TOTP:", error);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Bienvenido</h2>
                <p>Por favor escanea el código QR con tu dispositivo móvil para configurar Google Authenticator:</p>
                
                <div className="qr-container">
                    {qrCode ? (
                        <img src={`data:image/png;base64,${qrCode}`} alt="Código QR de autenticación" />
                    ) : (
                        <p>Cargando código QR...</p>
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
                <button onClick={handleSubmit} className="login-btn">Validar código</button>
                {message && <p>{message}</p>}
            </div>
        </div>
    );
};

export default GoogleAuth;
