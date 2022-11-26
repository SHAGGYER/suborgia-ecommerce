import React, { useContext, useEffect } from "react";
import { EventDialog } from "../components/Calendar";
import { CustomDialog } from "react-st-modal";
import styled from "styled-components";
import AppContext from "../AppContext";
import moment from "moment";
import HttpClient from "../services/HttpClient";

const BookingContainer = styled.div`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: #f5f5f5;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  max-width: 700px;

  article {
    padding: 1rem;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &.confirmed {
      background-color: #3ac55d;
    }
  }
`;

export default function LiveFeed() {
  const { bookings, setBookings, shops } = useContext(AppContext);

  const [bookingsToday, setBookingsToday] = React.useState([]);

  useEffect(() => {
    getBookingsToday();
  }, []);

  const openEventDialog = async (booking) => {
    const result = await CustomDialog(<EventDialog event={booking} />);
    console.log(result);
    if (result?.deleted) {
      getBookingsToday();
    } else if (result) {
      setBookingsToday((prev) => {
        return prev.map((b) => {
          if (b._id === result._id) {
            return result;
          }
          return b;
        });
      });

      setBookings((prev) => {
        return prev.map((b) => {
          if (b._id === result._id) {
            return result;
          }
          return b;
        });
      });
    }
  };

  const getBookingsToday = async () => {
    for (let shop of shops) {
      const { data } = await HttpClient().get(
        `/api/booking/barber/${shop._id}?start=${moment().startOf(
          "day"
        )}&end=${moment().endOf("day")}`
      );
      setBookingsToday(data);
    }
  };

  return (
    <>
      <h1>Live feed</h1>
      <p>Her er dine bookings for i dag</p>

      <BookingContainer>
        {bookings.concat(bookingsToday).map((booking, index) => (
          <article
            key={index}
            onClick={() => openEventDialog(booking)}
            className={`${booking.confirmed && "confirmed"}`}
          >
            <span>{booking.title || booking.name}</span>
            <span>{booking.confirmed ? "Bekræftet" : "Ikke Bekræftet"}</span>
            <div>
              <span>
                {moment(booking.start).format("DD-MM-YYYY HH:mm")} -{" "}
                {moment(booking.end).format("HH:mm")}
              </span>
            </div>
          </article>
        ))}
      </BookingContainer>
    </>
  );
}
