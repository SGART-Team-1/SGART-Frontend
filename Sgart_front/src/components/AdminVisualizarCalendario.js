import React, { useState, useEffect, useCallback } from 'react';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import '../App.css';
import NavBar from './NavBar';
import LoadingSpinner from './LoadingSpinner';

const AdminCalendar = () => {
    const [meetings, setMeetings] = useState([]);
    const [selectedMeeting, setSelectedMeeting] = useState(null);
    const [invitees, setInvitees] = useState([]);
    const [isMeetingDetailPopupOpen, setIsMeetingDetailPopupOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Función para cargar las reuniones desde el backend
    const loadMeetings = useCallback(async () => {
        try {
            setIsLoading(true);
            console.log("Intentando cargar meetings desde el backend...");

            const response = await fetch('/administrador/calendarios/loadMeetings');
            if (!response.ok) {
                throw new Error(`Error al cargar los meetings: ${response.statusText}`);
            }

            const backendMeetings = await response.json();
            // Transformación de los datos del backend
            const transformedMeetings = backendMeetings.map(meeting => ({
                id: meeting.meetingId,
                title: meeting.title || "Título no especificado",
                start: `${meeting.meetingDate}T${meeting.startTime}`,
                end: `${meeting.meetingDate}T${meeting.endTime}`,
                allDay: meeting.allDay,
                extendedProps: {
                    location: meeting.locationName,
                    description: meeting.observations,
                    organizerName: meeting.organizerName, // Añadido
                },
            }));
            setMeetings(transformedMeetings);
            console.log("Meetings transformados:", transformedMeetings);

        } catch (error) {
            console.error("Error al cargar los meetings: ", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Función para cargar la lista de invitados por POST
    const loadInvitees = useCallback(async (meetingId) => {
        try {
            setIsLoading(true);
            console.log(`Intentando cargar invitados para la reunión con ID: ${meetingId}`);

            const response = await fetch(`/administrador/calendarios/invitados`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ meetingId }),
            });

            if (!response.ok) {
                throw new Error(`Error al cargar los invitados: ${response.statusText}`);
            }

            const backendInvitees = await response.json();
            console.log("Lista de invitados cargada:", backendInvitees);
            const transformedInvitees = backendInvitees.map(invitee => ({
                userName: invitee.userName,
                invitationStatus: invitee.status,
            }));
            setInvitees(transformedInvitees);

        } catch (error) {
            console.error("Error al cargar los invitados: ", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadMeetings();
    }, [loadMeetings]);

    const handleEventClick = async (clickInfo) => {
        console.log("Evento seleccionado:", clickInfo.event);
        setSelectedMeeting({
            title: clickInfo.event.title,
            start: clickInfo.event.start,
            end: clickInfo.event.end,
            location: clickInfo.event.extendedProps.location,
            description: clickInfo.event.extendedProps.description,
            organizerName: clickInfo.event.extendedProps.organizerName, // Capturar organizerName
        });
        await loadInvitees(clickInfo.event.id);
        setIsMeetingDetailPopupOpen(true);
    };

    return (
        <>
            <NavBar isAdmin={true} />
            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <div className='admin-calendar-view'>
                    <div className="admin-calendar-container">
                        <h2>Calendario de Reuniones de la Empresa</h2>
                        <div className="calendar-wrapper">
                            <FullCalendar
                                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                initialView="dayGridMonth"
                                events={meetings}
                                eventClick={handleEventClick}
                                height="100%"
                            />
                        </div>
                    </div>

                    {/* Pop-up para Detalles del Meeting */}
                    {isMeetingDetailPopupOpen && selectedMeeting && (
                        <div className="popup-overlay">
                            <div className="popup-container">
                                <h2>Detalles de la Reunión</h2>
                                <div className="admin-calendar-input-group">
                                    <label>Nombre de la Reunión:</label>
                                    <p>{selectedMeeting.title}</p>
                                </div>
                                <div className="admin-calendar-input-group">
                                    <label>Fecha de la Reunión:</label>
                                    <p>{new Date(selectedMeeting.start).toLocaleDateString()}</p>
                                </div>
                                <div className="admin-calendar-input-group">
                                    <label>Hora de Inicio:</label>
                                    <p>{new Date(selectedMeeting.start).toLocaleTimeString()}</p>
                                </div>
                                <div className="admin-calendar-input-group">
                                    <label>Hora de Fin:</label>
                                    <p>{new Date(selectedMeeting.end).toLocaleTimeString()}</p>
                                </div>
                                <div className="admin-calendar-input-group">
                                    <label>Ubicación:</label>
                                    <p>{selectedMeeting.location}</p>
                                </div>
                                <div className="admin-calendar-input-group">
                                    <label>Organizador:</label> {/* Campo nuevo */}
                                    <p>{selectedMeeting.organizerName}</p>
                                </div>
                                <div className="admin-calendar-input-group">
                                    <label>Observaciones:</label>
                                    <p>{selectedMeeting.description}</p>
                                </div>

                                {/* Lista de Invitados */}
                                <div className="admin-calendar-input-group">
                                    <label>Lista de Invitados:</label>
                                    <ul>
                                        {invitees.map((invitee, index) => (
                                            <li key={index}>
                                                {invitee.userName} - {invitee.invitationStatus}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <button className="close-button" onClick={() => setIsMeetingDetailPopupOpen(false)}>Cerrar</button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default AdminCalendar;
