import React, {useState} from "react";
import LoginForm from "./LoginForm";

const RecuperarPwdForm = () => {

    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isOut, setIsOut] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === 'email') {
            setEmail(value);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const emailRegex = /^[^\s@]+@[^\s@]+.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('El formato del correo electrónico no es válido.');
            return;
        }

        try {
            const response = await fetch('/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                setSuccessMessage('Correo enviado. Por favor, revisa tu bandeja de entrada.');
                setError('');
            } else {
                const errorResponse = await response.json();
                setError(errorResponse.error || 'Ocurrió un error al procesar tu solicitud.');
            }
        } catch (err) {
            setError('No se pudo conectar con el servidor. Inténtalo más tarde.');
        }
    };
    const handleToggleForm = () => {
        setIsOut(true);
    };

    if (isOut) {
        return <LoginForm />;
    }

    return (
        <div className="login-container">
        <div className="login-box">
            <form action="#" method="post" onSubmit={handleSubmit}>
                <h2>Restablecer Contraseña</h2>
                <p style={{ marginTop: "5px", marginBottom: "30px", fontSize: "12px", color: "#555"}}>
                Introduzca su dirección de correo electrónico y le enviaremos un enlace para restablecer su contraseña.
                </p>
                    <div className="input-group">
                        {successMessage && <div className="success-message">{successMessage}</div>}
                        {error && <div className="error-message">{error}</div>}
                        <input type="email" id="email" name="email" value={email} onChange={handleChange} required/>
                        <label htmlFor="email">Usuario</label>
                    </div>
                    <button type="submit" className="login-btn">Solicitar Restablecer mi Contraseña</button>
                    <div className="login-options" style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
                        <a href="#" onClick={handleToggleForm}>Volver al formulario de Login</a>
                    </div>
            </form>
        </div>
        </div>
    );
};

export default RecuperarPwdForm;