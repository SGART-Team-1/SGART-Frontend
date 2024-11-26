import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


const GoogleAuthLogin = () => {
    const navigate = useNavigate();

    const location = useLocation();
    const email = location.state?.email || '';
    const dataLogin = location.state?.data || '';

    const [inputCode, setInputCode] = useState('');
    const [error, setError] = useState('');

    const handleInputChange = (event) => {
        setInputCode(event.target.value); // Actualiza el código ingresado
    };

    const handleButtonClick = () => {
        const request = {
            mail: email,
            code: inputCode,
        }

        fetch('/auth/validate-totp-db', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Error al validar el código de doble factor');
            }
            return response.json();
        })
        .then((data) => {
            console.log(dataLogin);
            alert('Doble factor autenticado con éxito');
            setError(''); // Limpiar cualquier mensaje de error
            switch (dataLogin.type) { // Asumiendo que el tipo está en 'type'
                case 'admin':
                    navigate('/admin-working-hours'); // Navegar a la página del administrador
                    break;
                case 'user':
                    navigate('/user-calendar'); // Navegar a la página del usuario
                    break;
            }
        })
        .catch((error) => {
            console.error('Hubo un error:', error);
            setError('Error al validar el código de doble factor');
        });
    }

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Bienvenido al Sistema</h2>
                <p>Por favor, verifica tu identidad con Google Authenticator.</p>
                <p>Introduzca su código de seguridad: </p>
                <input
                    type="text"
                    id="codeInput"
                    value={inputCode}
                    onChange={handleInputChange}
                    className="code-input"
                    placeholder="Introduce el código"
                />
                <br></br>
                <br></br>
                <div>
                    <button type='submit' className='login-btn' onClick={handleButtonClick}>Comprobar código</button>
                </div>
            </div>
        </div>
    );

};

export default GoogleAuthLogin;