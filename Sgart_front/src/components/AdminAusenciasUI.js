import React, { useState, useEffect } from 'react';
import VentanaConfirm from './VentanaConfirm';
import VerAusenciasModal from './VerAusenciasModal';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner';

const AdminAusenciasUI = () => {
    const navigate = useNavigate();

    const [empleados, setEmpleados] = useState([]);
    const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [confirmationAction, setConfirmationAction] = useState('');
    const [showAbsencesPopup, setShowAbsencesPopup] = useState(false);
    const [empleadoAusencias, setEmpleadoAusencias] = useState([]);
    const [tipoAusencia, setTipoAusencia] = useState('');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [mostrarHoras, setMostrarHoras] = useState(false);
    const [horaInicio, setHoraInicio] = useState('');
    const [horaFin, setHoraFin] = useState('');
    const [showDateError, setShowDateError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        const fetchEmpleados = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get('/users/cargarUsuarios');
                const empleadosData = response.data.map(user => ({
                    id: user.id,
                    nombre: user.firstName,
                    apellidos: user.lastName,
                    email: user.email,
                    perfil: user.profile,
                    centro: user.center,
                }));
                setEmpleados(empleadosData);
            } catch (error) {
                console.error('Error al cargar la lista de empleados:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchEmpleados();
    }, []);

    const handleOpenModal = (empleadoId) => {
        const empleado = empleados.find(emp => emp.id === empleadoId);
        if (empleado) {
            console.log('Usuario seleccionado para nueva ausencia:', empleado.id);
            setEmpleadoSeleccionado({
                id: empleado.id,
                nombre: empleado.nombre,
                apellidos: empleado.apellidos
            });
            setShowModal(true);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        resetForm();
    };

    const handleAddAbsence = () => {
        if (!tipoAusencia || !fechaInicio || !fechaFin || (mostrarHoras && (!horaInicio || !horaFin))) {
            alert('Por favor, complete todos los campos.');
            return;
        }
        console.log(`Añadir ausencia para el usuario: ${empleadoSeleccionado?.id} - ${empleadoSeleccionado?.nombre} ${empleadoSeleccionado?.apellidos}`);
        setConfirmationAction('add');
        setShowConfirmation(true);
    };

    const handleConfirmSave = async () => {
        try {
            setIsLoading(true);
            if (!empleadoSeleccionado || !empleadoSeleccionado.id) {
                console.error('No hay usuario seleccionado');
                alert('Error: No se ha seleccionado ningún usuario');
                return;
            }

            console.log('Guardando ausencia para usuario:', empleadoSeleccionado.id);

            const nuevaAusencia = {
                absenceId: null,
                userId: empleadoSeleccionado.id,
                absenceStartDate: fechaInicio,
                absenceEndDate: fechaFin,
                absenceAllDay: !mostrarHoras,
                absenceStartTime: mostrarHoras ? horaInicio : null,
                absenceEndTime: mostrarHoras ? horaFin : null,
                absenceReason: tipoAusencia
            };

            console.log('Datos de ausencia a enviar:', nuevaAusencia);

            const response = await axios.post('/administrador/ausencias/newAbsence', nuevaAusencia);
            console.log('Respuesta del servidor:', response.data);

            alert('Ausencia guardada correctamente.');
            setShowConfirmation(false);
            resetForm();
            setShowModal(false);
        } catch (error) {
            console.error('Error al guardar la ausencia:', error);
            alert('Ocurrió un error al guardar la ausencia.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelSave = () => {
        setShowConfirmation(false);
        resetForm();
    };

    useEffect(() => {
        if (fechaInicio !== fechaFin) {
            setMostrarHoras(false);
            setShowDateError(false);
        }
    }, [fechaInicio, fechaFin]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        switch (name) {
            case 'tipoAusencia':
                setTipoAusencia(value);
                if (value === 'vacaciones') {
                    setMostrarHoras(false);
                    setShowDateError(false);
                }
                break;
            case 'fechaInicio':
                setFechaInicio(value);
                if (value === fechaFin) {
                    setShowDateError(false);
                }
                break;
            case 'fechaFin':
                setFechaFin(value);
                if (value === fechaInicio) {
                    setShowDateError(false);
                }
                break;
            case 'horaInicio':
                setHoraInicio(value);
                break;
            case 'horaFin':
                setHoraFin(value);
                break;
            default:
                break;
        }
    };

    const resetForm = () => {
        setTipoAusencia('');
        setFechaInicio('');
        setFechaFin('');
        setHoraInicio('');
        setHoraFin('');
        setShowConfirmation(false);
        setMostrarHoras(false);
    };

    const handleOpenAusenciasPopup = async (empleadoId) => {
        const empleado = empleados.find(emp => emp.id === empleadoId);
        if (empleado) {
            try {
                setIsLoading(true);
                console.log('Cargando ausencias para usuario:', empleado.id);
                setEmpleadoSeleccionado({
                    id: empleado.id,
                    nombre: empleado.nombre,
                    apellidos: empleado.apellidos
                });

                const response = await axios.get(`/administrador/ausencias/loadAbsences/${empleado.id}`);
                console.log('Ausencias cargadas:', response.data);

                setEmpleadoAusencias(response.data);
                setShowAbsencesPopup(true);
            } catch (error) {
                console.error('Error al cargar las ausencias:', error);
                alert('Ocurrió un error al cargar las ausencias.');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleCloseAusenciasPopup = () => {
        setShowAbsencesPopup(false);
        setEmpleadoAusencias([]);
    };

    return (
        <>
            <NavBar isAdmin={true} />
            {isLoading ? (
                <LoadingSpinner />
            ) : (
            <div className="user-validation-container">
                <div className="login-box">
                    <h2>Lista de Trabajadores</h2>
                    <table className="user-table">
                        <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Apellidos</th>
                            <th>Email</th>
                            <th>Centro</th>
                            <th>Perfil</th>
                            <th>Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {empleados.map((empleado) => (
                            <tr key={empleado.id}>
                                <td>{empleado.nombre}</td>
                                <td>{empleado.apellidos}</td>
                                <td>{empleado.email}</td>
                                <td>{empleado.centro}</td>
                                <td>{empleado.perfil}</td>
                                <td>
                                    <button
                                        className="action-button add-button"
                                        onClick={() => handleOpenModal(empleado.id)}
                                        title="Añadir Ausencia">
                                        +
                                    </button>
                                    <button
                                        className="action-button details-button"
                                        onClick={() => handleOpenAusenciasPopup(empleado.id)}
                                        title="Ver Ausencias">
                                        &#8942;
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                {showModal && (
                    <div className="user-edit-container">
                        <div className="popup-container">
                            <h2>Agregar Ausencia - {empleadoSeleccionado?.nombre} {empleadoSeleccionado?.apellidos}</h2>
                            <form>
                                <div className="input-group-register">
                                    <select name="tipoAusencia" id="ausencia" value={tipoAusencia} onChange={handleChange} required>
                                        <option value="" disabled hidden></option>
                                        <option value="vacaciones">Vacaciones</option>
                                        <option value="baja">Baja</option>
                                        <option value="asuntos_personales">Asuntos Personales</option>
                                    </select>
                                    <label htmlFor='ausencia'>Tipo de Ausencia</label>
                                </div>
                                {(tipoAusencia === 'vacaciones' || tipoAusencia === 'baja' || tipoAusencia === 'asuntos_personales') && (
                                    <>
                                        <div className="input-group-register">
                                            <input
                                                type={fechaInicio ? "date" : "text"}
                                                id="fechaInicio"
                                                name="fechaInicio"
                                                value={fechaInicio}
                                                onFocus={(e) => (e.target.type = "date")}
                                                onBlur={(e) => {
                                                    if (!fechaInicio) {
                                                        e.target.type = "text";
                                                    }
                                                }}
                                                onChange={handleChange}
                                                placeholder=""
                                                required
                                            />
                                            <label htmlFor='fechaInicio'>Fecha de Inicio</label>
                                        </div>
                                        <div className="input-group-register">
                                            <input
                                                type={fechaFin ? "date" : "text"}
                                                id="fechaFin"
                                                name="fechaFin"
                                                value={fechaFin}
                                                onFocus={(e) => (e.target.type = "date")}
                                                onBlur={(e) => {
                                                    if (!fechaFin) {
                                                        e.target.type = "text";
                                                    }
                                                }}
                                                onChange={handleChange}
                                                placeholder=""
                                                required
                                            />
                                            <label htmlFor='fechaFin'>Fecha de Fin</label>
                                        </div>
                                    </>
                                )}
                                {(tipoAusencia === 'baja' || tipoAusencia === 'asuntos_personales') && (
                                    <div className="input-group-register">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (fechaInicio === fechaFin && fechaInicio) {
                                                    setMostrarHoras((prevMostrarHoras) => !prevMostrarHoras);
                                                    setShowDateError(false);
                                                } else {
                                                    setShowDateError(true);
                                                }
                                            }}
                                            className="personalizar-btn"
                                        >
                                            {mostrarHoras ? 'Ocultar Personalización' : 'Personalizar'}
                                        </button>
                                        {showDateError && (
                                            <p className="error-fecha">Las fechas de inicio y fin deben ser iguales para personalizar las horas.</p>
                                        )}
                                    </div>
                                )}
                                {mostrarHoras && (
                                    <>
                                        <div className="input-group-register">
                                            <input
                                                type="text"
                                                id="horaInicio"
                                                name="horaInicio"
                                                value={horaInicio}
                                                onFocus={(e) => (e.target.type = "time")}
                                                onBlur={(e) => (e.target.type = "text")}
                                                onChange={handleChange}
                                                placeholder=""
                                                required
                                            />
                                            <label htmlFor='horaInicio'>Hora de Inicio</label>
                                        </div>
                                        <div className="input-group-register">
                                            <input
                                                type="text"
                                                id="horaFin"
                                                name="horaFin"
                                                value={horaFin}
                                                onFocus={(e) => (e.target.type = "time")}
                                                onBlur={(e) => (e.target.type = "text")}
                                                onChange={handleChange}
                                                placeholder=""
                                                required
                                            />
                                            <label htmlFor='horaFin'>Hora de Fin</label>
                                        </div>
                                    </>
                                )}
                                <div className="confirmation-buttons">
                                    <button type="button" className="guardar-btn" onClick={handleAddAbsence}>Añadir</button>
                                    <button type="button" className="cancel-btn" onClick={handleCloseModal}>Cancelar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                {showConfirmation && (
                    <VentanaConfirm
                        onConfirm={handleConfirmSave}
                        onCancel={handleCancelSave}
                        action={confirmationAction}
                    />
                )}
                {showAbsencesPopup && empleadoAusencias && (
                    <div className="user-edit-container">
                        <div className="popup-container" style={{ maxHeight: '400px', overflowY: 'scroll' }}>
                            <h2>Ausencias de {empleadoSeleccionado?.nombre} {empleadoSeleccionado?.apellidos}</h2>
                            {empleadoAusencias.map((ausencia, index) => (
                                <div key={index} className="absence-detail">
                                    <p><strong>Fecha de inicio:</strong> {ausencia.absenceStartDate}</p>
                                    <p><strong>Fecha de fin:</strong> {ausencia.absenceEndDate}</p>
                                    <p><strong>Motivo:</strong> {ausencia.absenceReason}</p>
                                    <p><strong>Todo el día:</strong> {ausencia.absenceAllDay ? 'Sí' : 'No'}</p>
                                    {!ausencia.absenceAllDay && (
                                        <>
                                            <p><strong>Hora de inicio:</strong> {ausencia.absenceStartTime}</p>
                                            <p><strong>Hora de fin:</strong> {ausencia.absenceEndTime}</p>
                                        </>
                                    )}
                                    <hr />
                                </div>
                            ))}
                            <button type="button" className="close-btn" onClick={handleCloseAusenciasPopup}>Cerrar</button>
                        </div>
                    </div>
                )}
            </div>
            )}
        </>
    );
};

export default AdminAusenciasUI;
