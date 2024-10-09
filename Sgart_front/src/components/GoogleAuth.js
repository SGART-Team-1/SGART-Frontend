import React from 'react';
import { QRCode } from 'qrcode.react';
import '../App.css';

const GoogleAuth = () => {
    //const [qrValue, setQrValue] = useState('');

    //useEffect(() => {
    // Generar el código QR automáticamente al cargar la página
    //setQrValue('https://www.tu-sitio.com');
    //}, []);
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
            <div>
                <button type='sumbit' className='login-btn'>Ir al Inicio de Sesión</button>
            </div>
            </div>
        </div>
    );
};

export default GoogleAuth;
