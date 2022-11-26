import React, { useContext, useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import HttpClient from "../services/HttpClient";
import moment from "moment";
import timeGridPlugin from "@fullcalendar/timegrid";
import "@fullcalendar/timegrid/main.css";
import AppContext from "../AppContext";
import styled from "styled-components";
import { Alert, Confirm, CustomDialog, useDialog } from "react-st-modal";
import PrimaryButton from "./UI/PrimaryButton";
import cogoToast from "cogo-toast";
import { Form } from "./UI/Form";
import Services from "./Services";

const NewEventDialog = ({ start, end, shopId, services }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [usedServices, setUsedServices] = useState([]);
  const [usedEnd, setUsedEnd] = useState(end);
  const dialog = useDialog();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (usedServices.length) {
      const duration = usedServices.reduce((acc, x) => acc + x.minutes, 0);
      setUsedEnd(moment(start).add(duration, "minutes"));
    }
  }, [usedServices]);

  const onSubmit = async () => {
    const body = {
      name,
      email,
      phone,
      start,
      end: usedEnd,
      shopId,
      services: usedServices,
    };

    setLoading(true);
    await HttpClient().post("/api/booking", body);

    dialog.close(true);
  };

  const onServicesChanged = (_services) => {
    setUsedServices(_services);
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>{moment(start).format("DD-MM-YYYY")}</h2>
      <h4>
        {moment(start).format("HH:mm")} - {moment(usedEnd).format("HH:mm")}
      </h4>
      <br />
      <Form.TextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Form.TextField
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Form.TextField
        label="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <br />

      <Services services={services} onServicesChanged={onServicesChanged} />

      <PrimaryButton disabled={loading} onClick={onSubmit}>
        Gem
      </PrimaryButton>
    </div>
  );
};

const Event = styled.article`
  padding: 1rem;

  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1rem;

    td {
      border: 1px solid #ccc;
      padding: 0.5rem;
    }

    &:not(.vertical) td:first-child {
      width: 50%;
    }

    &:not(.vertical) td:last-child {
      width: 25%;
    }

    thead {
      tr td {
        font-weight: bold;
      }
    }

    &.vertical td:first-child {
      font-weight: bold;
    }
  }

  h3 {
    font-size: 17px;
    margin-bottom: 1rem;
  }
`;

export const EventDialog = ({ event }) => {
  const dialog = useDialog();

  const deleteEvent = async () => {
    const result = await Confirm(
      "Er du sikker på, at du vil slette denne booking?",
      "Slet booking",
      "Ja, slet booking",
      "Nej, behold booking"
    );
    if (!result) return;

    try {
      await HttpClient().delete(`/api/booking/event/${event.id}`);
      cogoToast.success("Booking slettet");
      dialog.close({ deleted: true });
    } catch (e) {
      console.error(e);
      cogoToast.error("Booking kunne ikke slettes");
    }
  };

  const confirmBooking = async () => {
    const result = await Confirm(
      "Er du sikker på, at du vil bekræfte denne booking?",
      "Bekræft booking",
      "Ja, bekræft booking",
      "Nej, vent lidt"
    );
    if (!result) return;

    try {
      await HttpClient().put(`/api/booking/confirm/${event.id || event._id}`);
      cogoToast.success("Booking bekræftet");
      dialog.close({ confirmed: true, ...event });
    } catch (e) {
      console.error(e);
      cogoToast.error("Booking kunne ikke bekræftes");
    }
  };

  return (
    <Event>
      <h3>Kunde</h3>
      <table className="vertical">
        <tbody>
          <tr>
            <td>Navn</td>
            <td>{event.title ? event.title : event.name}</td>
          </tr>
          <tr>
            <td>Telefon / Email</td>
            <td>
              {event.extendedProps
                ? `${event.extendedProps.phone} / ${event.extendedProps.email}`
                : `${event.phone} / ${event.email}`}
            </td>
          </tr>
          <tr>
            <td>Date</td>
            <td>
              {moment(event.start).format("DD-MM-YYYY HH:mm")} -{" "}
              {moment(event.end).format("HH:mm")}
            </td>
          </tr>
        </tbody>
      </table>

      <h3>Services</h3>
      <table>
        <thead>
          <tr>
            <td>Titel</td>
            <td>Pris</td>
            <td>Minutter</td>
          </tr>
        </thead>
        <tbody>
          {event.extendedProps
            ? event.extendedProps.services.map((service, index) => (
                <tr key={index}>
                  <td>{service.name}</td>
                  <td>{service.price} kr.</td>
                  <td>{service.minutes} min.</td>
                </tr>
              ))
            : event.services.map((service, index) => (
                <tr key={index}>
                  <td>{service.name}</td>
                  <td>{service.price} kr.</td>
                  <td>{service.minutes} min.</td>
                </tr>
              ))}
        </tbody>
      </table>

      {!event.confirmed &&
        !event.extendedProps?.confirmed &&
        (event.id || event._id) && (
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <PrimaryButton onClick={deleteEvent}>Slet Booking</PrimaryButton>
            <PrimaryButton onClick={confirmBooking}>
              Bekræft Booking
            </PrimaryButton>
          </div>
        )}

      {(event.extendedProps?.confirmed || event.confirmed) && (
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            alignItems: "center",
            color: "green",
          }}
        >
          <span>Booking er bekræftet</span>
          <PrimaryButton onClick={deleteEvent}>Slet Booking</PrimaryButton>
        </div>
      )}
    </Event>
  );
};

function Calendar({ shop, services, socket }) {
  const calendarRef = useRef();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (socket) {
      const handler = () => {
        calendarRef.current.getApi().refetchEvents();
      };

      socket.on("new-booking", handler);

      return () => {
        socket.off("new-booking", handler);
      };
    }
  }, [socket]);

  useEffect(() => {
    setTimeout(() => {
      setLoaded(true);
    }, 1000);
    /*
                                                                                                                                if (calendarRef.current) {
                                                                                                                                  calendarRef.current
                                                                                                                                    .getApi()
                                                                                                                                    .changeView('timeGridWeek')
                                                                                                                        
                                                                                                                        
                                                                                                                                }*/
  }, []);

  const updateEvent = async (info) => {
    await HttpClient().put(`/api/booking/barber/${info.event.id}`, {
      startDate: info.event.start,
      endDate: info.event.end,
    });
  };

  const handleEventClick = async (info) => {
    const result = await CustomDialog(<EventDialog event={info.event} />);
    if (result) {
      calendarRef.current.getApi().refetchEvents();
    }
  };

  const handleDateSelect = async (info) => {
    if (
      moment(info.start).format("DD-MM-YYYY") !==
      moment(info.end).format("DD-MM-YYYY")
    ) {
      await Alert("Du skal vælge datoer fra samme dag");
      return;
    }

    const result = await CustomDialog(
      <NewEventDialog
        services={services}
        start={info.start}
        end={info.end}
        shopId={shop._id}
      />
    );

    if (result) {
      calendarRef.current.getApi().refetchEvents();
    }
  };

  return (
    <div style={{ padding: "1rem", maxWidth: 900 }}>
      {loaded && shop && (
        <FullCalendar
          height={700}
          editable={true}
          droppable={true}
          slotLabelFormat={{
            hour: "2-digit",
            minute: "2-digit",
            meridiem: false,
            hour12: false,
          }}
          ref={calendarRef}
          businessHours={[
            {
              daysOfWeek: [1, 2, 3, 4, 5, 6, 0].filter(
                (x) => !shop.workFreeDays.includes(x)
              ),
              startTime: shop.startTime,
              endTime: shop.endTime,
            },
          ]}
          scrollTime={shop.startTime}
          eventDrop={(event) => updateEvent(event)}
          eventResize={(info) => updateEvent(info)}
          eventClick={(info) => handleEventClick(info)}
          eventAllow={(dropInfo, draggedEvent) => {
            if (moment(dropInfo.start).isBefore(moment())) {
              return false;
            }
            return true;
          }}
          selectable={true}
          selectConstraint="businessHours"
          select={(selectionInfo) => handleDateSelect(selectionInfo)}
          slotDuration={"00:15:00"}
          firstDay={1}
          eventSources={[
            {
              events: async function (info, successCallback, failureCallback) {
                const start = moment(info.start).toISOString();
                const end = moment(info.end).toISOString();
                const { data } = await HttpClient().get(
                  import.meta.env.VITE_SERVER_URL +
                    `/api/booking/barber/${shop._id}?start=${start}&end=${end}`
                );
                successCallback(data);
              },
            },
          ]}
          plugins={[interactionPlugin, timeGridPlugin]}
          initialView="timeGridWeek"
        />
      )}
    </div>
  );
}

export default Calendar;
