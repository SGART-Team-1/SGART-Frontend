import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import LoadingSpinner from './LoadingSpinner';

const RegisterForm = () => {
    const navigate = useNavigate();

    const [nombre, setNombre] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [email, setEmail] = useState('');
    const [departamento, setDepartamento] = useState('');
    const [centro, setCentro] = useState('');
    const [fechaAlta, setFechaAlta] = useState('');
    const [perfil_desplegable, setPerfil_desplegable] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [repetirContrasena, setRepetirContrasena] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);
    const [isLoged, setIsLoged] = useState(false);

    const [errorNombre, setErrorNombre] = useState('');
    const [errorApellidos, setErrorApellidos] = useState('');
    const [errorDepartamento, setErrorDepartamento] = useState('');
    const [errorCentro, setErrorCentro] = useState('');
    const [errorFechaAlta, setErrorFechaAlta] = useState('');
    const [errorPerfil, setErrorPerfil] = useState('');
    const [errorContrasena, setErrorContrasena] = useState('');
    const [errorRepetirContrasena, setErrorRepetirContrasena] = useState('');
    const [errorEmail, setErrorEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        switch (name) {
            case 'nombre':
                setNombre(value);
                break;
            case 'apellidos':
                setApellidos(value);
                break;
            case 'email':
                setEmail(value);
                break;
            case 'departamento':
                setDepartamento(value);
                break;
            case 'centro':
                setCentro(value);
                break;
            case 'fechaAlta':
                setFechaAlta(value);
                break;
            case 'perfil_desplegable':
                setPerfil_desplegable(value);
                break;
            case 'contrasena':
                setContrasena(value);
                break;
            case 'repetirContrasena':
                setRepetirContrasena(value);
                break;
            default:
                break;
        }
    };

    const handleRegister = async () => {
        var errorBool = false;
        setErrorNombre('');
        setErrorApellidos('');
        setErrorDepartamento('');
        setErrorCentro('');
        setErrorPerfil('');
        setErrorRepetirContrasena('');
        setErrorContrasena('');
        setErrorFechaAlta('');
        setErrorEmail('');
        setErrorContrasena('');

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setErrorEmail('El formato del correo electrónico no es válido.');
            errorBool = true;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(contrasena)) {
            setErrorRepetirContrasena('La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula, un número y un carácter especial (@, $, !, %, *, ?, &).');
            errorBool = true;
        }

        if (nombre === '') {
            setErrorNombre('Campo vacío');
            errorBool = true;
        }
        if (apellidos === '') {
            setErrorApellidos('Campo vacío');
            errorBool = true;
        }
        if (email === '') {
            setErrorEmail('Campo vacío');
            errorBool = true;
        }
        if (departamento === '') {
            setErrorDepartamento('Campo vacío');
            errorBool = true;
        }
        if (centro === '') {
            setErrorCentro('Campo vacío');
            errorBool = true;
        }
        if (perfil_desplegable === '') {
            setErrorPerfil('Campo vacío');
            errorBool = true;
        }
        if (fechaAlta === '') {
            setErrorFechaAlta('Campo vacío');
            errorBool = true;
        }
        if (contrasena === '') {
            setErrorContrasena('Campo vacío');
            errorBool = true;
        }
        if (repetirContrasena === '') {
            setErrorRepetirContrasena('Campo vacío');
            errorBool = true;
        }
        if (contrasena !== repetirContrasena) {
            setErrorRepetirContrasena('Las contraseñas no coinciden.');
            errorBool = true;
        }

        const fechaSeleccionada = new Date(fechaAlta);
        const fechaActual = new Date();
        if (fechaSeleccionada > fechaActual) {
            setErrorFechaAlta('La fecha de alta no puede ser una fecha futura.');
            errorBool = true;
        }

        if (errorBool) {
            return;
        }

        const usuario = {
            name: nombre,
            lastName: apellidos,
            email: email,
            department: departamento,
            center: centro,
            hiringDate: fechaAlta,
            profile: perfil_desplegable,
            password: contrasena,
            passwordConfirm: repetirContrasena,
            blocked: false,
            verified: false,
            twoFactorAuthCode: '',
        };
        setIsLoading(true);
        fetch('/users/verificar-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(usuario),
        })
        .then(response => response.text())
        .then((data) => {
            alert('Correo verificado. Pasando a la autenticación con doble factor...');
            console.log(JSON.stringify(usuario));
            navigate('/google-auth', { state: { usuario : usuario, esAdmin:false}});
        })
        .catch(error => {
            alert('Hubo un error:', error);
        });
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const toggleRepeatPasswordVisibility = () => {
        setShowRepeatPassword((prevShowRepeatPassword) => !prevShowRepeatPassword);
    };

    const handleToggleForm = () => {
        setIsLoged(true);
    };

    if (isLoged) {
        return <LoginForm />;
    }

    return (
        <>
            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <div className="register-container">
                    <div className="register-box">
                        <h2 className='title'>Registro</h2>
                        <p className='title' style={{ marginTop: "10px", fontSize: "12px", color: "#555" }}>
                            Los campos marcados con (*) son obligatorios.
                        </p>
                        <div className={errorNombre === '' ? "input-group" : "input-group-error"}>
                            <input type="text" id="nombre" name="nombre" value={nombre} onChange={handleChange} required />
                            <label htmlFor="nombre">Nombre*</label>
                        </div>
                        <label className="error">{errorNombre}</label>
                        <div className={errorApellidos === '' ? "input-group" : "input-group-error"}>
                            <input type="text" id="apellidos" name="apellidos" value={apellidos} onChange={handleChange} required />
                            <label htmlFor="apellidos">Apellidos*</label>
                        </div>
                        <label className="error">{errorApellidos}</label>
                        <div className={errorEmail === '' ? "input-group" : "input-group-error"}>
                            <input type="text" id="email" name="email" value={email} onChange={handleChange} required />
                            <label htmlFor="email">Email*</label>
                        </div>
                        <label className="error">{errorEmail}</label>
                        <div className={errorDepartamento === '' ? "input-group" : "input-group-error"}>
                            <input type="text" id="departamento" name="departamento" value={departamento} onChange={handleChange} required />
                            <label htmlFor="departamento">Departamento</label>
                        </div>
                        <label className="error">{errorDepartamento}</label>
                        <div className={errorCentro === '' ? "input-group" : "input-group-error"}>
                            <input type="text" id="centro" name="centro" value={centro} onChange={handleChange} required />
                            <label htmlFor="centro">Centro*</label>
                        </div>
                        <label className="error">{errorCentro}</label>
                        <div className={errorFechaAlta === '' ? "input-group" : "input-group-error"}>
                            <input type="text" id="fechaAlta" name="fechaAlta" value={fechaAlta} onFocus={(e) => (e.target.type = "date")}
                                onBlur={(e) => (e.target.type = "text")} onChange={handleChange} placeholder="" required />
                            <label htmlFor="fechaAlta">Fecha de Alta*</label>
                        </div>
                        <label className="error">{errorFechaAlta}</label>
                        <div className={errorPerfil === '' ? "input-group" : "input-group-error"}>
                            <select className="perfil-select" id="perfil_desplegable" name="perfil_desplegable" value={perfil_desplegable} onChange={handleChange} required>
                                <option value="" disabled hidden></option>
                                <option value="Desarrollador">Desarrollador</option>
                                <option value="Tester">Tester</option>
                                <option value="Becario">Becario</option>
                                <option value="RRHH">RRHH</option>
                                <option value="Contabilidad">Contabilidad</option>
                            </select>
                            <label htmlFor="perfil_desplegable">Perfil</label>
                            <button type="button" className="select-toggle-btn" value={perfil_desplegable}>
                                <img src={require('../media/flecha.png')} alt="Desplegable" />
                            </button>
                        </div>
                        <label className="error">{errorPerfil}</label>
                        <div className={errorContrasena === '' ? "input-group" : "input-group-error"}>
                            <input type={showPassword ? "text" : "password"} id="contrasena" name="contrasena" value={contrasena} onChange={handleChange} required />
                            <label htmlFor="contrasena">Contraseña*</label>
                            <button type="button" onClick={togglePasswordVisibility} className="password-toggle-btn">
                                <img src={require(showPassword ? '../media/password_off.png' : '../media/password_on.png')} alt="Mostrar Contraseña" />
                            </button>
                        </div>
                        <label className="error">{errorContrasena}</label>
                        <div className={errorRepetirContrasena === '' ? "input-group" : "input-group-error"}>
                            <input type={showRepeatPassword ? "text" : "password"} id="repetirContrasena" name="repetirContrasena" value={repetirContrasena} onChange={handleChange} required />
                            <label htmlFor="repetirContrasena">Repetir Contraseña*</label>
                            <button type="button" onClick={toggleRepeatPasswordVisibility} className="repeatPassword-toggle-btn">
                                <img src={require(showRepeatPassword ? '../media/password_off.png' : '../media/password_on.png')} alt="Mostrar Contraseña" />
                            </button>
                        </div>
                        <label className="error">{errorRepetirContrasena}</label>
                        <button type="submit" className="register-btn" onClick={handleRegister}>Registrarse</button>
                        <div className="register-options">
                            <p style={{ marginTop: "10px", fontSize: "12px", color: "#555" }}>
                                ¿Ya estás registrado?
                            </p>
                            <a href="#" onClick={handleToggleForm}>Iniciar sesión</a>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default RegisterForm;