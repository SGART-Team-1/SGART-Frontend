import React, { useState, useEffect } from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from './NavBar';
import LoadingSpinner from './LoadingSpinner';

const AdminGestionarHorariosDeTrabajo = () => {
    const navigate = useNavigate();
    const [blockCount, setBlockCount] = useState('');
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [timeBlocks, setTimeBlocks] = useState([
        { startHour: '', startMinute: '', endHour: '', endMinute: '' },
        { startHour: '', startMinute: '', endHour: '', endMinute: '' },
        { startHour: '', startMinute: '', endHour: '', endMinute: '' }
    ]);
    const [isEditable, setIsEditable] = useState(true); // Estado para manejar la edición
    const [existingSchedules, setExistingSchedules] = useState([]); // Estado para almacenar horarios existentes
    const [isLoading, setIsLoading] = useState(false);

    // Fetch para obtener los horarios de trabajo al cargar el componente
    useEffect(() => {
        const fetchWorkingHours = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get("/administrador/horarios");
                if (response.data.length > 0) {
                    // Si hay datos, desactiva la edición y almacena los horarios recibidos
                    setIsEditable(false);
                    setExistingSchedules(response.data.map(item => ({
                        startHour: item.startingTime.split(':')[0],
                        startMinute: item.startingTime.split(':')[1],
                        endHour: item.endingTime.split(':')[0],
                        endMinute: item.endingTime.split(':')[1]
                    })));
                } else {
                    // Si no hay datos, permite la edición
                    setIsEditable(true);
                }
            } catch (error) {
                console.error("Error al obtener los horarios de trabajo:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchWorkingHours();
    }, []);

    // Manejador para actualizar el número de bloques
    const handleBlockCountChange = (e) => {
        setBlockCount(e.target.value);
        if (e.target.value) {
            setIsPopupOpen(true);
        }
    };

    // Manejador para actualizar los campos de tiempo
    const handleTimeChange = (index, field, value) => {
        if (!isEditable) return; // No permitir cambios si no es editable
        const updatedBlocks = [...timeBlocks];
        updatedBlocks[index][field] = value;
        setTimeBlocks(updatedBlocks);
    };

    // Función para guardar los horarios en el formato correcto
    const handleSave = async () => {
        const workingHoursList = timeBlocks.slice(0, blockCount).map(block => ({
            startingTime: `${block.startHour.padStart(2, '0')}:${block.startMinute.padStart(2, '0')}:00`,
            endingTime: `${block.endHour.padStart(2, '0')}:${block.endMinute.padStart(2, '0')}:00`
        }));
        
        try {
            setIsLoading(true);
            await axios.post("/administrador/horarios", workingHoursList);
            alert("Horarios de trabajo guardados correctamente.");
            setIsEditable(false); // Desactiva la edición después de guardar
            setIsPopupOpen(false);
            setExistingSchedules(timeBlocks.slice(0, blockCount)); // Actualiza los horarios mostrados
        } catch (error) {
            console.error("Error al guardar los horarios de trabajo:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Función para manejar el cierre del pop-up y reiniciar la selección
    const handleClosePopup = () => {
        setIsPopupOpen(false);
        setBlockCount(''); // Reinicia la selección al cerrar el pop-up
    };

    return (
        <>
        <NavBar isAdmin={true} />
        {isLoading ? (
            <LoadingSpinner />
        ) : (
        <div className="container">
            <h2>Gestión de Horarios de Trabajo</h2>
            
            {/* Si hay horarios existentes, se muestran en lugar del selector */}
            {!isEditable ? (
                <div className="existing-schedules"> 
                    <h3>Horarios de Trabajo Actuales</h3>
                    {existingSchedules.map((schedule, index) => (
                        <div key={index} className="work-hours-block-container">
                            <label className="work-hours-block-label">Hora de inicio del bloque {index + 1}:</label>
                            <div className="work-hours-display-group">
                                {schedule.startHour}:{schedule.startMinute}
                            </div>
                            <label className="work-hours-block-label">Hora de fin del bloque {index + 1}:</label>
                            <div className="work-hours-display-group">
                                {schedule.endHour}:{schedule.endMinute}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                // Si no hay horarios, se muestra el selector para agregar nuevos
                <div className="work-hours-selector-group">
                    <select
                        id="blockCount"
                        className="work-hours-selector"
                        value={blockCount}
                        onChange={handleBlockCountChange}
                        required
                    >
                        <option value="" disabled></option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                    </select>
                    <label htmlFor="blockCount" className="work-hours-floating-label">Número de bloques de trabajo</label>
                </div>
            )}

            {/* Pop-up para configurar los horarios si es editable */}
            {isPopupOpen && (
                <div className="popup-overlay">
                    <div className="popup-container">
                        <h2>Configurar Bloques de Trabajo</h2>
                        {Array.from({ length: blockCount }).map((_, index) => (
                            <div key={index} className="work-hours-block-container">
                                <label className="work-hours-block-label">Hora de inicio del bloque {index + 1}:</label>
                                <div className="work-hours-input-group">
                                    <input
                                        type="number"
                                        placeholder="HH"
                                        value={timeBlocks[index].startHour}
                                        onChange={(e) => handleTimeChange(index, 'startHour', e.target.value)}
                                        min="0"
                                        max="23"
                                        className={`work-hours-input ${timeBlocks[index].startError ? 'error' : ''}`}
                                    />
                                    :
                                    <input
                                        type="number"
                                        placeholder="MM"
                                        value={timeBlocks[index].startMinute}
                                        onChange={(e) => handleTimeChange(index, 'startMinute', e.target.value)}
                                        min="0"
                                        max="59"
                                        className={`work-hours-input ${timeBlocks[index].startError ? 'error' : ''}`}
                                    />
                                </div>
                                <label className="work-hours-block-label">Hora de fin del bloque {index + 1}:</label>
                                <div className="work-hours-input-group">
                                    <input
                                        type="number"
                                        placeholder="HH"
                                        value={timeBlocks[index].endHour}
                                        onChange={(e) => handleTimeChange(index, 'endHour', e.target.value)}
                                        min="0"
                                        max="23"
                                        className={`work-hours-input ${timeBlocks[index].endError ? 'error' : ''}`}
                                    />
                                    :
                                    <input
                                        type="number"
                                        placeholder="MM"
                                        value={timeBlocks[index].endMinute}
                                        onChange={(e) => handleTimeChange(index, 'endMinute', e.target.value)}
                                        min="0"
                                        max="59"
                                        className={`work-hours-input ${timeBlocks[index].endError ? 'error' : ''}`}
                                    />
                                </div>
                            </div>
                        ))}
                        <button className="work-hours-save-button" onClick={handleSave}>Guardar</button>
                        <button className="work-hours-close-button" onClick={handleClosePopup}>Cerrar</button>
                    </div>
                </div>
            )}
        </div>
        )}
        </>
    );
};

export default AdminGestionarHorariosDeTrabajo;
