import React, { useState } from 'react';

const GoogleAuthLogin = () => {

    const [inputCode, setInputCode] = useState('');

    const handleInputChange = (event) => {
        setInputCode(event.target.value); // Actualiza el código ingresado
    };
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
                    <button type='submit' className='login-btn'>Comprobar código</button>
                </div>
            </div>
        </div>
    );

};

export default GoogleAuthLogin;