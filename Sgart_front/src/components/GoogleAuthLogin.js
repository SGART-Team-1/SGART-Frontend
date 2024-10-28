import React, { useState } from 'react';
import axios from 'axios';
import '../App.css';

const GoogleAuthLogin = () => {
    const [inputCode, setInputCode] = useState('');
    const [message, setMessage] = useState('');

    // Maneja el cambio de código ingresado
    const handleInputChange = (event) => {
        setInputCode(event.target.value);
    };

    // Maneja el envío del código para su verificación
    const handleSubmit = async (event) => {
        event.preventDefault();
        
        try {
            // TODO: Cambiar el email por el usuario que se obtenga del backend
            const response = await axios.post('/Auth/validate-totp', {
                mail: 'user@example.com',
                code: inputCode
            });

            // Verifica la respuesta del backend
            if (response.data.status === 'valid') {
                setMessage("Autenticación exitosa. Redirigiendo...");
                // Aquí es la redirección
            } else {
                setMessage("Código inválido. Por favor, intenta nuevamente.");
            }
        } catch (error) {
            setMessage("Error al validar el código.");
            console.error("Error en la autenticación:", error);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Bienvenido al Sistema</h2>
                <p>Por favor, verifica tu identidad con Google Authenticator.</p>
                
                <p>Introduce tu código de seguridad:</p>
                <input
                    type="text"
                    id="codeInput"
                    value={inputCode}
                    onChange={handleInputChange}
                    className="code-input"
                    placeholder="Introduce el código"
                />
                
                <br />
                <button onClick={handleSubmit} className="login-btn">Comprobar código</button>
                
                {message && <p>{message}</p>}
            </div>
        </div>
    );
};

export default GoogleAuthLogin;
