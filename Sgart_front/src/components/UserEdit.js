import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../App.css';
import NavBar from './NavBar';

const UserEdit = () => {
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [lastName, setLastName] = useState('');
    const [profile, setProfile] = useState('');
    const [department, setDepartment] = useState('');
    const [hiringDate, setHiringDate] = useState('');
    const [center, setCenter] = useState('');

    useEffect(() => {
        loadUser();
    },[]);

    const loadUser = async () => {
        try {
            const response = await fetch('/users/current/user', {
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error('No se pudo obtener el usuario');
            }
            const data = await response.json();
            console.log("Usuario obtenido:", {id:data.email});
            setId(data.id)
            setName(data.name);
            setEmail(data.email);
            setLastName(data.lastName);
            setDepartment(data.department);
            setProfile(data.profile);
            setHiringDate(data.hiringDate);
            setCenter(data.center);
        } catch (error) {
            console.error('Error al obtener el usuario:', error);
            return null;
        }
    };

    const handleSave = () => {
        const updatedUser = {
            id:id,
            name:name,
            lastName:lastName,
            profile:profile,
            department:department,
            hiringDate:hiringDate,
            center:center,
            email:email
        };

        console.log(updatedUser);

        // Realizar la solicitud al backend
        fetch('/users/modificar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedUser),
        })
            .then(response => {
                if (!response.ok) {
                    alert('Error al modificar los datos del usuario');
                    return;
                }
                alert("Usuario editado exitosamente")
            })
    };

    const handleCancel = () => {
        console.log('Edición cancelada');
        alert('Edición cancelada');
    };

    return (
        <>
            <NavBar isAdmin={false} />
            <div className="user-edit-form">
                <div className="user-content">
                    <h2>Perfil Usuario</h2>
                    <div className="input-group">
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <label htmlFor="name">Nombre:</label>
                    </div>
                    <div className="input-group">
                        <input
                            type="text"
                            id="lastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                        <label htmlFor="lastName">Apellidos:</label>
                    </div>
                    <div className="input-group">
                        <select
                            className="perfil-select"
                            id="perfil_desplegable"
                            value={profile}
                            onChange={(e) => setProfile(e.target.value)}
                        >
                            <option value="" disabled hidden></option>
                            <option value="Desarrollador">Desarrollador</option>
                            <option value="Tester">Tester</option>
                            <option value="Becario">Becario</option>
                            <option value="RRHH">RRHH</option>
                            <option value="Contabilidad">Contabilidad</option>
                        </select>
                        <label className='slct-label' htmlFor="perfil_desplegable">Perfil:</label>
                        <button type="button" className="select-toggle-btn">
                            <img src={require('../media/flecha.png')} alt="Desplegable" />
                        </button>
                    </div>
                    <div className="input-group">
                        <input
                            type="text"
                            id="department"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                        />
                        <label htmlFor="department">Departamento:</label>
                    </div>
                    <div className="input-group">
                        <input
                            type="date"
                            id="fecha"
                            value={hiringDate}
                            onChange={(e) => setHiringDate(e.target.value)}
                        />
                        <label htmlFor="fecha">Fecha de Alta:</label>
                    </div>
                    <div className="input-group">
                        <input
                            type="text"
                            id="center"
                            value={center}
                            onChange={(e) => setCenter(e.target.value)}
                        />
                        <label htmlFor="center">Centro:</label>
                    </div>
                    <button className="guardar-btn" onClick={handleSave}>
                        Modificar
                    </button>
                    <button className="cancelar-btn" onClick={handleCancel}>
                        Cerrar
                    </button>
                </div>
            </div>
        </>
    );
};

export default UserEdit;
