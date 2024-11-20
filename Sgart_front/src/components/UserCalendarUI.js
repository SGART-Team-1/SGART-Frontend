import React, { useState, useEffect, useCallback } from 'react';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import '../App.css';
import { useNavigate } from 'react-router-dom';
import VentanaConfirm from './VentanaConfirm';
import NavBar from './NavBar';

const InviteParticipants = ({ participants, filteredParticipants, searchTerm, handleSearchChange, handleSelectParticipant }) => {
    return (
        <div className="participant-list-container">
            <h2>Invitar Participantes</h2>
            <div className="search-participants-container">
                <input
                    type="text"
                    className="search-participants-input"
                    placeholder="Buscar participantes..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>
            <div className="participant-list-available">
                {filteredParticipants.length > 0 ? (
                    filteredParticipants.map((participant) => (
                        <div
                            key={participant.id}
                            className="available-participant-item"
                            onClick={() => handleSelectParticipant(participant)}
                        >
                            {participant.nombre}
                        </div>
                    ))
                ) : (
                    <p className="no-participants-message">No se encontraron participantes.</p>
                )}
            </div>
        </div>
    );
};

const InviteParticipants = ({ participants, filteredParticipants, searchTerm, handleSearchChange, handleSelectParticipant }) => {
    return (
        <div className="participant-list-container">
            <h2>Invitar Participantes</h2>
            <div className="search-participants-container">
                <input
                    type="text"
                    className="search-participants-input"
                    placeholder="Buscar participantes..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>
            <div className="participant-list-available">
                {filteredParticipants.length > 0 ? (
                    filteredParticipants.map((participant) => (
                        <div
                            key={participant.id}
                            className="available-participant-item"
                            onClick={() => handleSelectParticipant(participant)}
                        >
                            {participant.nombre}
                        </div>
                    ))
                ) : (
                    <p className="no-participants-message">No se encontraron participantes.</p>
                )}
            </div>
        </div>
    );
};

const UserCalendarUI = () => {
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
    const [currentStep, setCurrentStep] = useState(1); // 1: Crear evento, 2: Invitar participantes

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

    const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState(false);
    const [selectedReunion, setSelectedReunion] = useState(null);
    const [actionType, setActionType] = useState('');
    const [confirmAction, setConfirmAction] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [confirmationAction, setConfirmationAction] = useState('');


    // Estado para controlar los usuarios disponibles y los seleccionados
    const [availableUsers, setAvailableUsers] = useState([
        { id: 1, nombre: 'Juan Pérez' },
        { id: 2, nombre: 'María López' },
        { id: 3, nombre: 'Carlos García' },
        { id: 4, nombre: 'Ana Martínez' }
    ]);

    const [selectedUsers, setSelectedUsers] = useState([]);

    // Variables para buscar y filtrar usuarios
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredParticipants, setFilteredParticipants] = useState(availableUsers);

    useEffect(() => {
        // Filtrar la lista de participantes según el término de búsqueda
        setFilteredParticipants(
            availableUsers.filter((participant) =>
                participant.nombre.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, availableUsers]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSelectParticipant = (participant) => {
        if (!selectedUsers.includes(participant)) {
            setSelectedUsers([...selectedUsers, participant]);
            setAvailableUsers(availableUsers.filter(user => user.id !== participant.id));
        }
    };

    // Cargar los eventos regulares de la base de datos
    const loadEvents = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:9000/administrador/eventos/loadEvents');
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
            const response = await fetch('http://localhost:9000/administrador/eventos/loadSchedules');
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
            const response = await fetch('http://localhost:9000/administrador/eventos/loadDefaultSchedule');
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
        const transformedEvent = {
            title: clickInfo.event.title,
            start: clickInfo.event.startStr,
            end: clickInfo.event.endStr,
            allDay: clickInfo.event.allDay,
            extendedProps: {
                meetingId: clickInfo.event.extendedProps.meetingId,
                organizerId: clickInfo.event.extendedProps.organizerId,
                observations: clickInfo.event.extendedProps.observations,
                locationName: clickInfo.event.extendedProps.locationName,
                invitees: clickInfo.event.extendedProps.invitees || []
            }
        };
        setSelectedEvent(transformedEvent);
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
        setCurrentStep(1);
    };

    const handleNextStep = () => {
        if (!eventName || !popupSelectedDate) {
            alert("Por favor, completa todos los campos obligatorios antes de continuar.");
            return;
        }
        setCurrentStep(2);
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
            event_location: eventLocation,
            event_observations: popupDescription,
            invitees: selectedUsers
        };

        try {
            setIsLoading(true);
            const response = await fetch('http://localhost:9000/administrador/eventos/saveEvent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newEvent),
            });

            if (!response.ok) throw new Error('Error al guardar el evento');

            const savedEvent = await response.json(); // Asumiendo que el servidor devuelve el evento guardado

            const transformedEvent = {
                id: savedEvent.id,
                title: savedEvent.event_title,
                start: `${savedEvent.event_start_date}T${savedEvent.event_time_start}`,
                end: `${savedEvent.event_start_date}T${savedEvent.event_time_end}`,
                allDay: savedEvent.event_all_day === 1,
                extendedProps: {
                    organizerId: savedEvent.organizer_id,
                    locationName: savedEvent.location_name,
                    observations: savedEvent.observations,
                    invitees: savedEvent.invitees || [],
                    //isOrganizer: savedEvent.organizer_id === currentUser.id
                }
            };

            // Añade el evento guardado al estado de regularEvents
            setRegularEvents((prevEvents) => [...prevEvents, transformedEvent]);

            setIsPopupOpen(false);
            setCurrentStep(1);
            alert("[!] Se ha guardado el evento de manera exitosa.");
        } catch (error) {
            console.error('Error al guardar el evento:', error);
        } finally {
            setIsLoading(false);
        }
    };
    const handleEditEvent = () => {
        setIsEditable(true);
    };
    
    const handleSaveEditedEvent = async () => {
        try {
            const updatedEvent = {
                ...selectedEvent,
                title: eventName,
                start: `${popupSelectedDate}T${popupStartingHour}:${popupStartingMinutes}:00`,
                end: `${popupSelectedDate}T${popupEndingHour}:${popupEndingMinutes}:00`,
                // Añadir otros campos actualizados si es necesario
            };
    
            // Aquí se realiza el request para actualizar el evento
            const response = await fetch(`http://localhost:9000/administrador/eventos/updateEvent/${updatedEvent.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedEvent),
            });
    
            if (!response.ok) throw new Error('Error al actualizar el evento');
    
            // Actualizar el estado del evento en regularEvents
            setRegularEvents((prevEvents) =>
                prevEvents.map((event) => (event.id === updatedEvent.id ? updatedEvent : event))
            );
    
            alert("[!] El evento se ha actualizado correctamente.");
            setIsEditable(false);
            setIsEventDetailPopupOpen(false);
        } catch (error) {
            console.error('Error al actualizar el evento:', error);
        }
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
            const response = await fetch('http://localhost:9000/administrador/eventos/saveDay', {
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

    const handleRemoveUser = (user) => {
        setAvailableUsers([...availableUsers, user]);
        setSelectedUsers(selectedUsers.filter((selectedUser) => selectedUser.id !== user.id));
    };


    // PRUEBAS
    const [reunionesPendientes, setReunionesPendientes] = useState([
        { id: 1, nombre: 'Reunión con equipo', fecha: '2024-11-10' },
        { id: 2, nombre: 'Revisión de proyecto', fecha: '2024-11-12' },
        { id: 35, nombre: 'Revisión de proyecto', fecha: '2024-11-15' },
        { id: 4, nombre: 'Revisión de proyecto', fecha: '2024-12-20' },
    ]);

    const [reunionesAceptadas, setReunionesAceptadas] = useState([
        { id: 3, nombre: 'Presentación cliente', fecha: '2024-11-15' },
        { id: 7, nombre: 'Presentación cliente', fecha: '2024-11-15' },
        { id: 8, nombre: 'Presentación cliente', fecha: '2024-11-15' },
        { id: 9, nombre: 'Presentación cliente', fecha: '2024-11-15' },
=======
        {
            meetingId: "0be87f14-8fc5-44bc-8e92-114976629f2b", title: "Reunión con Cliente", allDay: 'false', meetingDate: '2024-11-25', startTime: "09:00:00",
            endTime: "11:00:00", organizerId: "61bc14cd-0c94-43cc-ab5a-8c59501b6470", observations: "Llevar preparado producto mínimo viable", locationName: "ESI",
            invitees: [
                { userName: "Juan Pérez", invitationStatus: "Aceptado" },
                { userName: "María López", invitationStatus: "Pendiente" }
            ]
        }
    ]);

    const [reunionesAceptadas, setReunionesAceptadas] = useState([
        {
            meetingId: "0be83f14-8fc5-44bc-8e92-114976629f2b", title: "Reunión de Estrategia", allDay: 'false', meetingDate: '2024-11-21', startTime: "10:00:00",
            endTime: "12:00:00", organizerId: "61bc15cd-0c94-43cc-ab5a-8c59501b6470", observations: "Hola buenas tardes", locationName: "Online",
            invitees: [
                { userName: "Juan Pérez", invitationStatus: "Aceptado" },
                { userName: "María López", invitationStatus: "Pendiente" }
            ]
        },
        {
            meetingId: "0be83f14-8fc5-44bc-8e92-119976629f2b", title: "Reunión de Planificación", allDay: 'false', meetingDate: '2024-11-20', startTime: "11:00:00",
            endTime: "14:00:00", organizerId: "61bc15cd-0c94-43cc-ab5a-8c59501b6470", observations: "No hay observaciones", locationName: "Ciudad Real"
        }
    ]);
    // Ejemplo de ausencias de los usuarios (deberían cargarse de un API o base de datos)
    const [ausencias, setAusencias] = useState([
        { userId: 1, fecha: '2024-11-20' }, // Ejemplo de ausencia para Juan Pérez
        { userId: 3, fecha: '2024-11-15' } // Ejemplo de ausencia para otro usuario
>>>>>>> Stashed changes
    ]);

    const handleAcceptClick = (reunion) => {
        setSelectedReunion(reunion);
        setActionType('accept');
        setIsConfirmPopupOpen(true);
    };

    const handleRejectClick = (reunion) => {
        setSelectedReunion(reunion);
        setActionType('reject');
        setIsConfirmPopupOpen(true);
    };

    // Funciones para manejar la confirmación
    const handleAcceptMeeting = (meeting) => {
        setConfirmationAction('accept');
        setShowConfirmation(true);
    };

    const handleRejectMeeting = (meeting) => {
        setConfirmationAction('reject');
        setShowConfirmation(true);
    };

    const handleInfoMeeting = (reunion) => {
<<<<<<< Updated upstream
        // Aquí puedes usar VentanaConfirm.js o cualquier otro componente para mostrar la información del evento
        setSelectedEvent(reunion);
=======
        setSelectedEvent({
            id: reunion.meetingId,
            title: reunion.title || reunion.nombre,
            start: `${reunion.meetingDate}T${reunion.startTime}`,
            end: `${reunion.meetingDate}T${reunion.endTime}`,
            allDay: reunion.allDay === 'true',
            extendedProps: {
                organizerId: reunion.organizerId,
                observations: reunion.observations,
                locationName: reunion.locationName,
                invitees: reunion.invitees || [] // Asegúrate de incluir los invitados aquí
            }
        });
>>>>>>> Stashed changes
        setIsEventDetailPopupOpen(true);
    };


    const handleConfirmAction = () => {
        if (confirmationAction === 'accept') {
            console.log('Reunión aceptada');
            // Aquí puedes agregar la lógica para aceptar la reunión
        } else if (confirmationAction === 'reject') {
            console.log('Reunión rechazada');
            // Aquí puedes agregar la lógica para rechazar la reunión
        }
        setShowConfirmation(false); // Cerrar la ventana de confirmación después de realizar la acción
<<<<<<< Updated upstream
    };    

    return (
        <>
        <NavBar isAdmin={false} />
        <div className='AdminCalendarapp-container main-content'>
            <div className="AdminCalendar-left-panel">
                <h3>Reuniones Pendientes</h3>
                <div className="meeting-list-pending">
                    {reunionesPendientes.length > 0 && (
                        <>
                            {reunionesPendientes.map((reunion) => (
                                <div key={reunion.id} className="meeting-item pending">
                                    <div className='meeting-info'>
                                        <p>{reunion.nombre}</p>
                                    </div>
                                    <div className="meeting-actions">
                                        <button className="action-button info-button" onClick={() => handleInfoMeeting(reunion)}>
                                            <img src={require('../media/informacion.png')} alt="Información" title='Información del Evento' />
                                        </button>
                                        <button className="action-reunion-button accept-button" onClick={() => handleAcceptMeeting(reunion)}>
                                            <img src={require('../media/garrapata.png')} alt="Aceptar" title='Aceptar' />
                                        </button>
                                        <button className="action-reunion-button reject-button" onClick={() => handleRejectMeeting(reunion)}>
                                            <img src={require('../media/cancelar.png')} alt="Rechazar" title='Rechazar' />
                                        </button>
                                    </div>
                                    {confirmAction && (
                                        <VentanaConfirm
                                            mensaje={confirmAction.message}
                                            onConfirm={confirmAction.onConfirm}
                                            onCancel={() => setConfirmAction(null)}
                                        />
                                    )}
                                </div>
                            ))}
                        </>
=======
    };

    const checkUserAbsence = (participant) => {
        return ausencias.some((ausencia) => {
            const ausenciaFecha = new Date(ausencia.fecha);
            const selectedFecha = new Date(popupSelectedDate);
            return (
                ausencia.userId === participant.id &&
                ausenciaFecha.getTime() === selectedFecha.getTime()
            );
        });
    };

    useEffect(() => {
        // Transformar reuniones aceptadas al formato del calendario
        const transformedAcceptedMeetings = reunionesAceptadas.map(reunion => ({
            id: reunion.meetingId,  // Asegúrate de que cada evento tenga un id único
            title: reunion.title || reunion.nombre,
            start: `${reunion.meetingDate}T${reunion.startTime}`,
            end: `${reunion.meetingDate}T${reunion.endTime}`,
            allDay: reunion.allDay === 'true',
            extendedProps: {
                meetingId: reunion.meetingId,
                organizerId: reunion.organizerId,
                observations: reunion.observations,
                locationName: reunion.locationName,
                invitees: reunion.invitees || []
            }
        }));

        // Reemplazar todos los eventos con las reuniones aceptadas (evitar duplicados)
        setRegularEvents([...transformedAcceptedMeetings]);
    }, [reunionesAceptadas]);

    useEffect(() => {
        const transformedPendingMeetings = reunionesPendientes.map(reunion => ({
            title: reunion.title || reunion.nombre,
            start: `${reunion.meetingDate}T${reunion.startTime}`,
            end: `${reunion.meetingDate}T${reunion.endTime}`,
            allDay: reunion.allDay === 'true',
            extendedProps: {
                meetingId: reunion.meetingId,
                organizerId: reunion.organizerId,
                observations: reunion.observations,
                locationName: reunion.locationName,
            }
        }));
        setPendingMeetingsEvents(transformedPendingMeetings);
    }, [reunionesPendientes]);


    return (
        <>
            <NavBar isAdmin={false} />
            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <div className='AdminCalendarapp-container main-content'>
                    <div className="AdminCalendar-left-panel">
                        <h3>Reuniones Pendientes</h3>
                        <div className="meeting-list-pending">
                            {reunionesPendientes.length > 0 && (
                                <>
                                    {reunionesPendientes.map((reunion) => (
                                        <div key={reunion.meetingId} className="meeting-item pending">
                                            <div className='meeting-info'>
                                                <p>{reunion.title}</p>
                                            </div>
                                            <div className="meeting-actions">
                                                <button className="action-button info-button" onClick={() => handleInfoMeeting(reunion)}>
                                                    <img src={require('../media/informacion.png')} alt="Información" title='Información del Evento' />
                                                </button>
                                                <button className="action-reunion-button accept-button" onClick={() => handleAcceptMeeting(reunion)}>
                                                    <img src={require('../media/garrapata.png')} alt="Aceptar" title='Aceptar' />
                                                </button>
                                                <button className="action-reunion-button reject-button" onClick={() => handleRejectMeeting(reunion)}>
                                                    <img src={require('../media/cancelar.png')} alt="Rechazar" title='Rechazar' />
                                                </button>
                                            </div>
                                            {confirmAction && (
                                                <VentanaConfirm
                                                    mensaje={confirmAction.message}
                                                    onConfirm={confirmAction.onConfirm}
                                                    onCancel={() => setConfirmAction(null)}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                        <h3>Reuniones Aceptadas</h3>
                        <div className="meeting-list-accepted">
                            {reunionesAceptadas.length > 0 && (
                                <>
                                    {reunionesAceptadas.map((reunion) => (
                                        <div key={reunion.meetingId} className="meeting-item accepted">
                                            <div className="meeting-item-content">
                                                <div className="meeting-info">
                                                    <p>{reunion.title}</p>
                                                </div>
                                                <div className="meeting-buttons">
                                                    <button className="info-button" onClick={() => handleInfoMeeting(reunion)}>
                                                        <img src={require('../media/informacion.png')} alt="Info" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                        <div className="AdminCalendar-add-time">
                            <button className="add-button" onClick={handleAddTimeClick}>+</button>
                            <p>Crear nueva reunión</p>
                        </div>
                    </div>

                    <div className="AdminCalendar-calendar-container">
                        <h2>Calendario de Trabajo</h2>
                        <div className="calendar-wrapper">
                            <FullCalendar
                                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                initialView="dayGridMonth"
                                eventSources={[
                                    { events: regularEvents.filter(event => event.extendedProps.isOrganizer), color: 'blue', textColor: 'white' },
                                    { events: regularEvents.filter(event => !event.extendedProps.isOrganizer), color: 'green', textColor: 'white' },
                                    { events: pendingMeetingsEvents, color: 'yellow', textColor: 'white' }
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
                    {isPopupOpen && currentStep === 1 && (
                        <div className="popup-overlay">
                            <div className="popup-container">
                                <h2>Crear nueva Reunión</h2>
                                <div className="AdminCalendar-input-group">
                                    <label htmlFor='eventName'>Nombre de la Reunión:</label>
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
                                    <label htmlFor='allDay'>¿Es una reunión de todo el día?</label>
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
                                    <label htmlFor='eventLocation'>Ubicación:</label>
                                    <select
                                        value={eventLocation}
                                        id='eventLocation'
                                        onChange={(e) => {
                                            setEventLocation(e.target.value)
                                        }}
                                    >
                                        <option value="Ciudad Real">Ciudad Real</option>
                                        <option value="Toledo">Toledo</option>
                                        <option value="Madrid">Madrid</option>
                                        <option value="Málaga">Málaga</option>
                                        <option value="Barcelona">Barcelona</option>
                                    </select>
                                </div>
                                <div className='AdminCalendar-input-group'>
                                    <label htmlFor='popupDescription'>Observaciones:</label>
                                    <textarea className='areaTexto' id='popupDescription' value={popupDescription} onChange={(e) => setPopupDescription(e.target.value)} />
                                </div>
                                <div className="AdminCalendar-button-group">
                                    <button className="save-button" onClick={handleNextStep}>Siguiente</button>
                                    <button className="close-button" onClick={handleClosePopup}>Cancelar</button>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Pop-up para Invitar Participantes */}
                    {isPopupOpen && currentStep === 2 && (
                        <div className="popup-overlay">
                            <div className="popup-container-participants">
                                <h2>Invitar Participantes</h2>

                                <div className="AdminCalendar-input-group">
                                    <label>Usuarios Disponibles:</label>
                                    <div className="search-participants-container">
                                        <input
                                            type="text"
                                            className="search-participants-input"
                                            placeholder="Buscar participantes..."
                                            value={searchTerm}
                                            onChange={handleSearchChange}
                                        />
                                    </div>
                                    {/* Lista de participantes disponibles */}
                                    <div className="participant-list-available">
                                        {filteredParticipants.length > 0 ? (
                                            filteredParticipants.map((participant) => (
                                                <div
                                                    key={participant.id}
                                                    className="available-participant-item"
                                                    onClick={() => handleSelectParticipant(participant)}
                                                >
                                                    {participant.nombre}
                                                </div>
                                            ))
                                        ) : (
                                            <p>No se encontraron participantes.</p>
                                        )}
                                    </div>
                                    {/* Lista de participantes seleccionados */}
                                    <label>Usuarios Seleccionados:</label>
                                    <div className="participant-list-selected">
                                        {selectedUsers.map((user) => (
                                            <div key={user.id} className={`selected-participant-item ${user.enAusencia ? 'en-ausencia' : 'disponible'}`}>
                                                <p>{user.nombre}</p>
                                                <button onClick={() => handleRemoveUser(user)}>
                                                    <img className='papelera-btn' src={require('../media/papelera.png')} alt="Eliminar" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                </div>
                                <div className="AdminCalendar-button-group">
                                    <button className="save-participants-button" onClick={handleSaveEvent}>Guardar</button>
                                    <button className="close-participants-button" onClick={handleClosePopup}>Cancelar</button>
                                </div>
                            </div>
                        </div>
                    )}
                    {isEventDetailPopupOpen && selectedEvent && (
                        <div className="popup-overlay">
                            <div className="popup-container">
                                <h2>Detalles del Evento</h2>
                                <div className="AdminCalendar-input-group">
                                    <label htmlFor='nombreEvento'>Nombre de la Reunión:</label>
                                    <p>{selectedEvent.title}</p>
                                </div>
                                <div className="AdminCalendar-input-group">
                                    <label htmlFor='fechaInicio'>Fecha:</label>
                                    <p>{selectedEvent.start ? selectedEvent.start.split('T')[0] : 'No definida'}</p>
                                </div>
                                {selectedEvent.allDay ? (
                                    <div className="AdminCalendar-input-group">
                                        <label htmlFor='allDayEvent'>Esta reunión es de todo el día</label>
                                    </div>
                                ) : (
                                    <>
                                        <div className="AdminCalendar-input-group">
                                            <label htmlFor='horaInicio'>Hora de inicio:</label>
                                            <p>{selectedEvent.start ? selectedEvent.start.split('T')[1].split('+')[0] : 'No definida'}</p>
                                        </div>
                                        <div className="AdminCalendar-input-group">
                                            <label htmlFor='horaFin'>Hora de fin:</label>
                                            <p>{selectedEvent.end ? selectedEvent.end.split('T')[1].split('+')[0] : 'No definida'}</p>
                                        </div>
                                    </>
                                )}
                                <div className="AdminCalendar-input-group">
                                    <label htmlFor='organizadorEvento'>Organizador:</label>
                                    <p>{selectedEvent.extendedProps?.organizerId || 'No definido'}</p>
                                </div>
                                <div className="AdminCalendar-input-group">
                                    <label htmlFor='ubicacionEvento'>Ubicación:</label>
                                    <p>{selectedEvent.extendedProps?.locationName || 'No definida'}</p>
                                </div>
                                <div className="AdminCalendar-input-group">
                                    <label htmlFor='descripcionEvento'>Observaciones:</label>
                                    <p>{selectedEvent.extendedProps?.observations || 'No definidas'}</p>
                                </div>
                                {/* Lista de Invitados */}
                                {selectedEvent.extendedProps?.invitees && selectedEvent.extendedProps.invitees.length > 0 && (
                                    <div className="AdminCalendar-input-group">
                                        <label>Lista de Invitados:</label>
                                        <ul>
                                            {selectedEvent.extendedProps.invitees.map((invitee, index) => (
                                                <li key={index}>
                                                    {invitee.userName} - {invitee.invitationStatus}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                <button className="close-button" onClick={() => setIsEventDetailPopupOpen(false)}>Cerrar</button>
                            </div>
                        </div>
                    )}
                    {/* Ventana de confirmación */}
                    {showConfirmation && (
                        <VentanaConfirm
                            onConfirm={() => handleConfirmAction()}
                            onCancel={() => setShowConfirmation(false)}
                            action={confirmationAction}
                        />
>>>>>>> Stashed changes
                    )}
                </div>
                <h3>Reuniones Aceptadas</h3>
                <div className="meeting-list-accepted">
                    {reunionesAceptadas.length > 0 && (
                        <>
                            {reunionesAceptadas.map((reunion) => (
                                <div key={reunion.id} className="meeting-item accepted">
                                    <div className="meeting-item-content">
                                        <div className="meeting-info">
                                            <p>{reunion.nombre}</p>
                                        </div>
                                        <div className="meeting-buttons">
                                            <button className="info-button" onClick={() => { setSelectedEvent(reunion); setIsEventDetailPopupOpen(true); }}>
                                                <img src={require('../media/informacion.png')} alt="Info" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>
                <div className="AdminCalendar-add-time">
                    <button className="add-button" onClick={handleAddTimeClick}>+</button>
                    <p>Crear nueva reunión</p>
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
            {isPopupOpen && currentStep === 1 && (
                <div className="popup-overlay">
                    <div className="popup-container">
                        <h2>Crear nuevo evento</h2>
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
                            <button className="save-button" onClick={() => setCurrentStep(2)}>Siguiente</button>
                            <button className="close-button" onClick={handleClosePopup}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
            {/* Pop-up para Invitar Participantes */}
            {isPopupOpen && currentStep === 2 && (
                <div className="popup-overlay">
                    <div className="popup-container-participants">
                        <h2>Invitar Participantes</h2>

                        <div className="AdminCalendar-input-group">
                            <label>Usuarios Disponibles:</label>
                            <div className="search-participants-container">
                                <input
                                    type="text"
                                    className="search-participants-input"
                                    placeholder="Buscar participantes..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                            </div>
                            {/* Lista de participantes disponibles */}
                            <div className="participant-list-available">
                                {filteredParticipants.length > 0 ? (
                                    filteredParticipants.map((participant) => (
                                        <div
                                            key={participant.id}
                                            className="available-participant-item"
                                            onClick={() => handleSelectParticipant(participant)}
                                        >
                                            {participant.nombre}
                                        </div>
                                    ))
                                ) : (
                                    <p>No se encontraron participantes.</p>
                                )}
                            </div>
                        </div>

                        {/* Lista de participantes seleccionados */}
                        <div className="AdminCalendar-input-group">
                            <label>Usuarios Seleccionados:</label>
                            <div className="participant-list-selected">
                                {selectedUsers.map((user) => (
                                    <div key={user.id} className="selected-participant-item">
                                        <p>{user.nombre}</p>
                                        <button onClick={() => handleRemoveUser(user)}>Eliminar</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="AdminCalendar-button-group">
                            <button className="save-participants-button" onClick={handleSaveEvent}>Guardar</button>
                            <button className="close-participants-button" onClick={handleClosePopup}>Cancelar</button>
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
                            <p>{selectedEvent.title || selectedEvent.nombre}</p>
                        </div>
                        <div className="AdminCalendar-input-group">
                            <label htmlFor='fechaInicio'>Fecha de Inicio:</label>
                            <p>{selectedEvent.start ? selectedEvent.start.toLocaleString() : selectedEvent.fecha}</p>
                        </div>
                        {selectedEvent.start && !selectedEvent.allDay && (
                            //<div className="AdminCalendar-input-group">
                            //    <label htmlFor='allDayEvent'>Este evento es de todo el día</label>
                            //</div>
                            /*) : (*/
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
                        {selectedEvent.extendedProps?.eventFrequency && (
                            <div className="AdminCalendar-input-group">
                                <label htmlFor='eventFrequency'>Frecuencia del Evento:</label>
                                <p>{selectedEvent.extendedProps.eventFrequency}</p>
                            </div>
                        )}
                        <button className="close-button" onClick={() => setIsEventDetailPopupOpen(false)}>Cerrar</button>
                    </div>
                </div>
            )}
            {/* Ventana de confirmación */}
            {showConfirmation && (
                <VentanaConfirm
                    onConfirm={() => handleConfirmAction()}
                    onCancel={() => setShowConfirmation(false)}
                    action={confirmationAction}
                />
            )}
        </div>
    </>
    );
};

export default UserCalendarUI;