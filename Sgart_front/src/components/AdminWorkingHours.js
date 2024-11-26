import React, { useState, useEffect, useCallback } from 'react';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import '../App.css';
import { useNavigate } from 'react-router-dom';

const AdminWorkingHours = () => {
    const navigate = useNavigate();
    // Variables para modificar día laborable
    const [selectedDate, setSelectedDate] = useState('');
    const [startingHour, setStartingHour] = useState('');
    const [startingMinutes, setStartingMinutes] = useState('');
    const [endingHour, setEndingHour] = useState('');
    const [endingMinutes, setEndingMinutes] = useState('');
    const [eventName, setEventName] = useState('');
    const [reason, setReason] = useState('');

    // Variables de estado adicionales
    const [isEditable, setIsEditable] = useState(false);

    // Variables del pop-up de creación de eventos
    const [popupSelectedDate, setPopupSelectedDate] = useState('');
    const [eventFrequency, setEventFrequency] = useState('Una vez');
    const [isAllDay, setIsAllDay] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [popupStartingHour, setPopupStartingHour] = useState('');
    const [popupStartingMinutes, setPopupStartingMinutes] = useState('');
    const [popupEndingHour, setPopupEndingHour] = useState('');
    const [popupEndingMinutes, setPopupEndingMinutes] = useState('');

    // Nueva variable para abrir el pop-up de personalización
    const [isCustomPopupOpen, setIsCustomPopupOpen] = useState(false);
    const [customFrequency, setCustomFrequency] = useState('Diario');
    const [repeatCount, setRepeatCount] = useState('');

    // Variables para el pop-up de detalles de los eventos
    const [isEventDetailPopupOpen, setIsEventDetailPopupOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    // Variables para almacenar eventos regulares y horarios de trabajo modificados
    const [regularEvents, setRegularEvents] = useState([]);
    const [modifiedWorkingHours, setModifiedWorkingHours] = useState([]);
    const [defaultWorkingHours, setDefaultWorkingHours] = useState([]);

    // Variables para el control de errores en campos de hora
    const [hourError, setHourError] = useState(false);
    const [minuteError, setMinuteError] = useState(false);
    const [popupHourError, setPopupHourError] = useState(false);
    const [popupMinuteError, setPopupMinuteError] = useState(false);

    // Cargar los eventos regulares de la base de datos
    const loadEvents = useCallback(async () => {
        try {
            const response = await fetch('/administrador/eventos/loadEvents');
            if (!response.ok) throw new Error('Error al cargar los eventos');

            const backendEvents = await response.json();
            const transformedEvents = backendEvents.map(event => ({
                title: event.event_title,
                start: `${event.event_start_date}T${event.event_time_start}`,
                end: `${event.event_start_date}T${event.event_time_end}`,
                allDay: event.event_all_day === 1,
                extendedProps: { frequency: event.event_frequency }
            }));
            setRegularEvents(transformedEvents);
        } catch (error) {
            console.error("Error al cargar los eventos: ", error);
        }
    }, []);

    // Cargar los horarios de trabajo modificados de la base de datos
    const loadModifiedWorkingHours = useCallback(async () => {
        try {
            const response = await fetch('/administrador/eventos/loadSchedules');
            if (!response.ok) throw new Error('Error al cargar los horarios modificados');

            const backendWorkingHours = await response.json();
            const transformedWorkingHours = backendWorkingHours.map(hour => ({
                title: hour.reason || "Horario Modificado",
                start: `${hour.selectedDate}T${hour.startingTime}`,
                end: `${hour.selectedDate}T${hour.endingTime}`,
                allDay: false,
            }));
            setModifiedWorkingHours(transformedWorkingHours);
        } catch (error) {
            console.error("Error al cargar los horarios modificados: ", error);
        }
    }, []);

    // Cargar los horarios de trabajo por defecto de la base de datos
    const loadDefaultWorkingHours = useCallback(async () => {
        try {
            const response = await fetch('/administrador/eventos/loadDefaultSchedule');
            if (!response.ok) throw new Error('Error al cargar los horarios de trabajo por defecto');

            const backendDefaultHours = await response.json();
            const transformedDefaultHours = backendDefaultHours.map(hour => ({
                dayOfWeek: hour.day_of_week,
                startTime: hour.start_time,
                endTime: hour.end_time
            }));
            setDefaultWorkingHours(transformedDefaultHours);
        } catch (error) {
            console.error("Error al cargar los horarios de trabajo por defecto: ", error);
        }
    }, []);

    // Cargar los datos al iniciar
    useEffect(() => {
        loadEvents();
        loadModifiedWorkingHours();
        loadDefaultWorkingHours();
    }, [loadEvents, loadModifiedWorkingHours, loadDefaultWorkingHours]);

    const handleDateClick = (arg) => {
        const clickedDate = arg.dateStr;
        setSelectedDate(clickedDate);
        const dayOfWeek = new Date(arg.date).getDay();
        const defaultHours = defaultWorkingHours.find(d => d.dayOfWeek === dayOfWeek);
        const modifiedHours = modifiedWorkingHours.find(event => event.start.includes(clickedDate));
    
        if (modifiedHours) {
            setStartingHour(modifiedHours.start.split("T")[1].split(":")[0]);
            setStartingMinutes(modifiedHours.start.split("T")[1].split(":")[1]);
            setEndingHour(modifiedHours.end.split("T")[1].split(":")[0]);
            setEndingMinutes(modifiedHours.end.split("T")[1].split(":")[1]);
            setReason(modifiedHours.title);
        } else if (defaultHours) {
            setStartingHour(defaultHours.startTime.split(":")[0]);
            setStartingMinutes(defaultHours.startTime.split(":")[1]);
            setEndingHour(defaultHours.endTime.split(":")[0]);
            setEndingMinutes(defaultHours.endTime.split(":")[1]);
            setReason('');
        } else {
            setStartingHour('');
            setStartingMinutes('');
            setEndingHour('');
            setEndingMinutes('');
            setReason('');
        }
    };
    const handleEventClick = (clickInfo) => {
        setSelectedEvent(clickInfo.event);
        setIsEventDetailPopupOpen(true);
    };
    const validateTimeInput = (hour, minute, setHourError, setMinuteError) => {
        const hourValid = hour >= 0 && hour <= 23;
        const minuteValid = minute >= 0 && minute <= 59;
        setHourError(!hourValid);
        setMinuteError(!minuteValid);
        return hourValid && minuteValid;
    };

    const handleTimeChange = (e, type) => {
        const value = e.target.value;
        if (type === 'startingHour') {
            setStartingHour(value);
            validateTimeInput(value, startingMinutes, setHourError, setMinuteError);
        } else if (type === 'startingMinutes') {
            setStartingMinutes(value);
            validateTimeInput(startingHour, value, setHourError, setMinuteError);
        } else if (type === 'endingHour') {
            setEndingHour(value);
            validateTimeInput(value, endingMinutes, setHourError, setMinuteError);
        } else if (type === 'endingMinutes') {
            setEndingMinutes(value);
            validateTimeInput(endingHour, value, setHourError, setMinuteError);
        }
    };

    const handlePopupTimeChange = (e, type) => {
        const value = e.target.value;
        if (type === 'popupStartingHour') {
            setPopupStartingHour(value);
            validateTimeInput(value, popupStartingMinutes, setPopupHourError, setPopupMinuteError);
        } else if (type === 'popupStartingMinutes') {
            setPopupStartingMinutes(value);
            validateTimeInput(popupStartingHour, value, setPopupHourError, setPopupMinuteError);
        } else if (type === 'popupEndingHour') {
            setPopupEndingHour(value);
            validateTimeInput(value, popupEndingMinutes, setPopupHourError, setPopupMinuteError);
        } else if (type === 'popupEndingMinutes') {
            setPopupEndingMinutes(value);
            validateTimeInput(popupEndingHour, value, setPopupHourError, setPopupMinuteError);
        }
    };

    const handleAddTimeClick = () => {
        setPopupStartingHour('');
        setPopupStartingMinutes('');
        setPopupEndingHour('');
        setPopupEndingMinutes('');
        setEventName('');
        setPopupSelectedDate('');
        setEventFrequency('Una vez');
        setIsAllDay(false);
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

    const handleSaveEvent = async () => {
        if (!validateTimeInput(popupStartingHour, popupStartingMinutes, setPopupHourError, setPopupMinuteError) || 
            !validateTimeInput(popupEndingHour, popupEndingMinutes, setPopupHourError, setPopupMinuteError)) {
            alert("Por favor, corrige los campos de hora antes de guardar el evento.");
            return;
        }

        const startingTime = `${popupStartingHour.padStart(2, '0')}:${popupStartingMinutes.padStart(2, '0')}:00`;
        const endingTime = `${popupEndingHour.padStart(2, '0')}:${popupEndingMinutes.padStart(2, '0')}:00`;

        const newEvent = {
            event_title: eventName,
            event_start_date: popupSelectedDate,
            event_all_day: isAllDay ? 1 : 0,
            event_time_start: isAllDay ? '00:00:00' : startingTime,
            event_time_end: isAllDay ? '23:59:59' : endingTime,
            event_frequency: eventFrequency === 'Personalizado' ? customFrequency : eventFrequency,
            event_repetitions_count: eventFrequency === 'Personalizado' ? parseInt(repeatCount, 10) : (eventFrequency === 'Una vez' ? 1 : -1),
        };

        try {
            const response = await fetch('/administrador/eventos/saveEvent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newEvent),
            });

            if (!response.ok) throw new Error('Error al guardar el evento');

            await loadEvents();
            setIsPopupOpen(false);
            alert("[!] Se ha guardado el evento de manera exitosa.");
        } catch (error) {
            console.error('Error al guardar el evento:', error);
        }
    };

    const handleEditDayClick = () => {
        setIsEditable(true);
    };

    const handleSaveDayClick = async () => {
        if (!validateTimeInput(startingHour, startingMinutes, setHourError, setMinuteError) || 
            !validateTimeInput(endingHour, endingMinutes, setHourError, setMinuteError)) {
            alert("Por favor, corrige los campos de hora antes de guardar el horario.");
            return;
        }

        const horarioData = {
            selectedDate,
            startingTime: `${startingHour.padStart(2, '0')}:${startingMinutes.padStart(2, '0')}:00`,
            endingTime: `${endingHour.padStart(2, '0')}:${endingMinutes.padStart(2, '0')}:00`,
            reason,
        };

        try {
            const response = await fetch('/administrador/eventos/saveDay', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(horarioData),
            });

            if (!response.ok) throw new Error('Error al guardar el horario');

            alert("[!] El horario se guardó exitosamente");
            await loadModifiedWorkingHours();
        } catch (error) {
            console.error('Error al guardar el horario:', error);
        } finally {
            setIsEditable(false);
            setReason('');
        }
    };

    return (
        <div className='AdminCalendarapp-container'>
            <div className="admin-buttons">
                <button className="admin-btn" onClick={() => navigate('/user-options')}>
                    <img src={require('../media/user_management_btn.png')} width={60} alt="Mant. Usuarios" title="Mant. Usuarios"/>
                </button>
                <button className="admin-btn" onClick={() => navigate('/admin-options')}>
                    <img src={require('../media/admin_management_btn.png')} width={60} alt="Mant. Administradores" title="Mant. Administradores"/>
                </button>
                <button className="admin-btn" onClick={() => navigate('/admin-working-hours')}>
                    <img src={require('../media/calendar_management_btn.png')} width={60} alt="Mant. Calendario" title="Mant. Calendario"/>
                </button>
            </div>
            <div className="AdminCalendar-left-panel">
                <h2>Horario de Trabajo</h2>
                <div className="AdminCalendar-input-group">
                    <label htmlFor='fecha'>Fecha:</label>
                    <input
                        type="date"
                        id='fecha'
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        disabled={!isEditable}
                    />
                </div>
                <div className="AdminCalendar-input-group">
                    <label>Hora de inicio:</label>
                    <div>
                        <input
                            type="number"
                            placeholder="HH"
                            value={startingHour}
                            onChange={(e) => handleTimeChange(e, 'startingHour')}
                            className={hourError ? 'error' : ''}
                            min="0"
                            max="23"
                            disabled={!isEditable}
                        />
                        :
                        <input
                            type="number"
                            placeholder="MM"
                            value={startingMinutes}
                            onChange={(e) => handleTimeChange(e, 'startingMinutes')}
                            className={minuteError ? 'error' : ''}
                            min="0"
                            max="59"
                            disabled={!isEditable}
                        />
                    </div>
                </div>
                <div className="AdminCalendar-input-group">
                    <label>Hora de fin:</label>
                    <div>
                        <input
                            type="number"
                            placeholder="HH"
                            value={endingHour}
                            onChange={(e) => handleTimeChange(e, 'endingHour')}
                            className={hourError ? 'error' : ''}
                            min="0"
                            max="23"
                            disabled={!isEditable}
                        />
                        :
                        <input
                            type="number"
                            placeholder="MM"
                            value={endingMinutes}
                            onChange={(e) => handleTimeChange(e, 'endingMinutes')}
                            className={minuteError ? 'error' : ''}
                            min="0"
                            max="59"
                            disabled={!isEditable}
                        />
                    </div>
                </div>
                <div className="AdminCalendar-input-group">
                    <label>Motivo:</label>
                    <input
                        type="text"
                        placeholder="Motivo del cambio de horario"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        disabled={!isEditable}
                    />
                </div>
                <div className="AdminCalendar-button-group">
                    <button onClick={handleEditDayClick}>Editar día</button>
                    <button onClick={handleSaveDayClick}>Guardar día</button>
                </div>
                <div className="AdminCalendar-add-time">
                    <button className="add-button" onClick={handleAddTimeClick}>+</button>
                    <p>Añadir nuevo evento</p>
                </div>
            </div>

            <div className="AdminCalendar-calendar-container">
                <h2>Calendario de Trabajo</h2>
                <div className="calendar-wrapper">
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        eventSources={[
                            { events: regularEvents, color: 'blue', textColor: 'white' },
                            { events: modifiedWorkingHours, color: 'red', textColor: 'white' }
                        ]}
                        dateClick={handleDateClick}
                        eventClick={handleEventClick}
                        selectable={true}
                        businessHours={{
                            daysOfWeek: defaultWorkingHours.map(d => d.dayOfWeek),
                            startTime: defaultWorkingHours.length > 0 ? defaultWorkingHours[0].startTime : '08:00',
                            endTime: defaultWorkingHours.length > 0 ? defaultWorkingHours[0].endTime : '15:00',
                        }}
                    />
                </div>
            </div>

            {/* Pop-up para Añadir Nuevo Evento */}
            {isPopupOpen && (
                <div className="popup-overlay">
                    <div className="popup-container">
                        <h2>Añadir nuevo evento</h2>
                        <div className="AdminCalendar-input-group">
                            <label htmlFor='eventName'>Nombre del Evento:</label>
                            <input
                                type="text"
                                id='eventName'
                                placeholder="Nombre del Evento"
                                value={eventName}
                                onChange={(e) => setEventName(e.target.value)}
                            />
                        </div>
                        <div className="AdminCalendar-input-group">
                            <label htmlFor='fecha'>Fecha:</label>
                            <input
                                type="date"
                                id='fecha'
                                value={popupSelectedDate}
                                onChange={(e) => setPopupSelectedDate(e.target.value)}
                            />
                        </div>
                        <div className="AdminCalendar-input-group">
                            <label htmlFor='allDay'>¿Es un evento de todo el día?</label>
                            <input
                                type="checkbox"
                                id='allDay'
                                checked={isAllDay}
                                onChange={(e) => setIsAllDay(e.target.checked)}
                            />
                        </div>
                        {!isAllDay && (
                            <>
                                <div className="AdminCalendar-input-group">
                                    <label>Hora de inicio:</label>
                                    <div>
                                        <input
                                            type="number"
                                            placeholder="HH"
                                            value={popupStartingHour}
                                            onChange={(e) => handlePopupTimeChange(e, 'popupStartingHour')}
                                            className={popupHourError ? 'error' : ''}
                                            min="0"
                                            max="23"
                                        />
                                        :
                                        <input
                                            type="number"
                                            placeholder="MM"
                                            value={popupStartingMinutes}
                                            onChange={(e) => handlePopupTimeChange(e, 'popupStartingMinutes')}
                                            className={popupMinuteError ? 'error' : ''}
                                            min="0"
                                            max="59"
                                        />
                                    </div>
                                </div>
                                <div className="AdminCalendar-input-group">
                                    <label>Hora de fin:</label>
                                    <div>
                                        <input
                                            type="number"
                                            placeholder="HH"
                                            value={popupEndingHour}
                                            onChange={(e) => handlePopupTimeChange(e, 'popupEndingHour')}
                                            className={popupHourError ? 'error' : ''}
                                            min="0"
                                            max="23"
                                        />
                                        :
                                        <input
                                            type="number"
                                            placeholder="MM"
                                            value={popupEndingMinutes}
                                            onChange={(e) => handlePopupTimeChange(e, 'popupEndingMinutes')}
                                            className={popupMinuteError ? 'error' : ''}
                                            min="0"
                                            max="59"
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                        <div className="AdminCalendar-input-group">
                            <label htmlFor='eventFrequency'>Frecuencia del Evento:</label>
                            <select
                                value={eventFrequency}
                                id='eventFrequency'
                                onChange={(e) => {
                                    setEventFrequency(e.target.value);
                                    if (e.target.value === 'Personalizado') setIsCustomPopupOpen(true);
                                }}
                            >
                                <option value="Una vez">Una vez</option>
                                <option value="Diario">Diario</option>
                                <option value="Semanal">Semanal</option>
                                <option value="Mensual">Mensual</option>
                                <option value="Anual">Anual</option>
                                <option value="Personalizado">Personalizado...</option>
                            </select>
                        </div>
                        <div className="AdminCalendar-button-group">
                            <button className="save-button" onClick={handleSaveEvent}>Guardar</button>
                            <button className="close-button" onClick={handleClosePopup}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Pop-up para Personalizar Frecuencia */}
            {isCustomPopupOpen && (
                <div className="popup-overlay">
                    <div className="popup-container small">
                        <h2>Personalizar repetición</h2>
                        <div className="AdminCalendar-input-group">
                            <label htmlFor='customFrequency'>Frecuencia de repetición:</label>
                            <select
                                value={customFrequency}
                                id='customFrequency'
                                onChange={(e) => setCustomFrequency(e.target.value)}
                            >
                                <option value="Diario">Diario</option>
                                <option value="Semanal">Semanal</option>
                                <option value="Mensual">Mensual</option>
                                <option value="Anual">Anual</option>
                            </select>
                        </div>
                        <div className="AdminCalendar-input-group">
                            <label htmlFor='repeatCount'>Número de repeticiones:</label>
                            <input
                                type="number"
                                id='repeatCount'
                                min="1"
                                value={repeatCount}
                                onChange={(e) => setRepeatCount(e.target.value)}
                            />
                        </div>
                        <div className="AdminCalendar-button-group">
                            <button className="save-button" onClick={() => setIsCustomPopupOpen(false)}>Guardar</button>
                            <button className="close-button" onClick={() => setIsCustomPopupOpen(false)}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Pop-up para Detalles del Evento */}
            {isEventDetailPopupOpen && selectedEvent && (
                <div className="popup-overlay">
                    <div className="popup-container">
                        <h2>Detalles del Evento</h2>
                        <div className="AdminCalendar-input-group">
                            <label htmlFor='nombreEvento'>Nombre del Evento:</label>
                            <p>{selectedEvent.title}</p>
                        </div>
                        <div className="AdminCalendar-input-group">
                            <label htmlFor='fechaInicio'>Fecha de Inicio:</label>
                            <p>{selectedEvent.start.toLocaleString()}</p>
                        </div>
                        {selectedEvent.allDay ? (
                            <div className="AdminCalendar-input-group">
                                <label htmlFor='allDayEvent'>Este evento es de todo el día</label>
                            </div>
                        ) : (
                            <>
                                <div className="AdminCalendar-input-group">
                                    <label htmlFor='horaInicio'>Hora de inicio:</label>
                                    <p>{selectedEvent.start.toLocaleTimeString()}</p>
                                </div>
                                <div className="AdminCalendar-input-group">
                                    <label htmlFor='horaFin'>Hora de fin:</label>
                                    {selectedEvent.end ? (
                                        <p>{selectedEvent.end.toLocaleTimeString()}</p>
                                    ) : (
                                        <p>No definida</p>
                                    )}
                                </div>
                            </>
                        )}
                        <div className="AdminCalendar-input-group">
                            <label htmlFor='eventFrequency'>Frecuencia del Evento:</label>
                            <p>{selectedEvent.extendedProps.eventFrequency}</p>
                        </div>
                        <button className="close-button" onClick={() => setIsEventDetailPopupOpen(false)}>Cerrar</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminWorkingHours;
