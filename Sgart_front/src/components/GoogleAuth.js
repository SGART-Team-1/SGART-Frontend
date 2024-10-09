import React, { useState } from 'react';
import { QRCode } from 'qrcode.react';
import '../App.css';

const GoogleAuth = () => {

    const [inputCode, setInputCode] = useState('');
    //const [qrValue, setQrValue] = useState('');

    //useEffect(() => {
    // Generar el código QR automáticamente al cargar la página
    //setQrValue('https://www.tu-sitio.com');
    //}, []);

    const handleInputChange = (event) => {
        setInputCode(event.target.value); // Actualiza el código ingresado
    };

    return (
        <div className="login-conainer">
            <div className="login-box">
                <h2>Bienvenido</h2>
                <p>Por favor escanea el código QR con tu dispositivo móvil para configurar Google Authenticator:</p>
                <div className="qr-container">
                    <div className='qr-placeholder'>
                        <p>Código QR no disponible</p>
                    </div>
                </div>
                <br></br>
                <h3>Introduce tu código de Google Authenticator</h3>
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
                    <button type='sumbit' className='login-btn'>Ir al Inicio de Sesión</button>
                </div>
            </div>
        </div>
    );
};

export default GoogleAuth;
