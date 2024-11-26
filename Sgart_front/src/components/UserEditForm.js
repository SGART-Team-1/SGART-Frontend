import React, { useState } from 'react';
import PropTypes from 'prop-types';

const UserEditForm = ({ user, onSave, onCancel }) => {
    const [name, setName] = useState(user.name);
    const [lastName, setLastName] = useState(user.lastName);
    const [profile, setProfile] = useState(user.profile);
    const [department, setDepartment] = useState(user.department);
    const [hiringDate, setHiringDate] = useState(user.hiringDate);
    const [center, setCenter] = useState(user.center);

    const handleSave = () => {
        // Guardar los cambios realizados al usuario
        const updatedUser = {
            name: name,
            lastName: lastName,
            profile: profile,
            department: department,
            hiringDate: hiringDate,
            center: center
        };

        fetch('/users/modificar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedUser),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Usuario editado exitosamente:', data);
        })
        .catch(error => {
            console.error('Error al guardar usuario:', error);
        });
        onSave(updatedUser);
    };

    return (
        <div className="user-edit-form">
            <div className="user-content">
            <h2>Modificar Usuario</h2>
            <div className="input-group">
                <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
                <label htmlFor="name">Nombre:</label>
            </div>
            <div className="input-group">
                <input type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                <label htmlFor="lastName">Apellidos:</label>
            </div>
            <div className="input-group">
                <select className="perfil-select" id="profile" value={profile} onChange={(e) => setProfile(e.target.value)}>
                    <option value="" disabled hidden></option>
                    <option value="desarrollador">Desarrollador</option>
                    <option value="tester">Tester</option>
                    <option value="becario">Becario</option>
                    <option value="rrhh">RRHH</option>
                    <option value="contabilidad">Contabilidad</option>
                </select>
                <label htmlFor="profile">Perfil:</label>
                <button type="button" className="select-toggle-btn" value={profile}>
                    <img src={require('../media/flecha.png')} alt="Desplegable"/>
                </button>
            </div>
            <div className="input-group">
                <input type="text" id="department" value={department} onChange={(e) => setDepartment(e.target.value)} />
                <label htmlFor="department">Departamento:</label>
            </div>
            <div className="input-group">
                <input type="date" id="fecha" value={hiringDate} onChange={(e) => setHiringDate(e.target.value)} />
                <label htmlFor="fecha">Fecha de Alta:</label>
            </div>
            <div className="input-group">
                <input type="text" id="center" value={center} onChange={(e) => setCenter(e.target.value)} />
                <label htmlFor="center">Centro:</label>
            </div>
            <button className="guardar-btn" onClick={handleSave}>Guardar</button>
            <button className="cancelar-btn"onClick={onCancel}>Cancelar</button>
            </div>
        </div>
    );
};
UserEditForm.propTypes = {
    user: PropTypes.shape({
        name: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        profile: PropTypes.string,
        department: PropTypes.string,
        hiringDate: PropTypes.string,
        center: PropTypes.string
    }).isRequired,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
};

export default UserEditForm;