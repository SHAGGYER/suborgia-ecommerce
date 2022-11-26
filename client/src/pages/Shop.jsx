import React, { useContext, useEffect, useState } from "react";
import Page from "../components/Page";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
import moment from "moment";
import da from "date-fns/locale/da";
import styled from "styled-components";
import PrimaryButton from "../components/UI/PrimaryButton";
import { CustomDialog } from "react-st-modal";
import BookingDialog from "../components/BookingDialog";
import { useParams } from "react-router-dom";
import HttpClient from "../services/HttpClient";
import Title from "../components/Title";
import cogoToast from "cogo-toast";
import Logo from "../images/logo.jpg";
import GoogleMapReact from "google-map-react";
import AppContext from "../AppContext";

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  max-width: 800px;
  margin: 2rem auto;

  img {
    width: 300px;
    margin: 0 auto;
  }
`;

const Services = styled.article`
  margin-bottom: 1rem;

  h3 {
    margin-bottom: 1rem;
  }
`;

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 1rem;

  thead td {
    font-weight: bold;
  }

  td {
    padding: 1rem;
    border: 1px solid black;
    text-align: center;

    button {
      width: 100%;
      justify-content: center;
    }
  }

  tr td:first-child {
    text-align: left;
  }

  tr td:last-child {
    width: 100px;
    max-width: 100px;
  }

  @media screen and (max-width: 400px) {
    .hide-mobile {
      display: none;
    }
  }
`;

const Time = styled.article`
  margin-bottom: 2rem;

  h3 {
    margin-bottom: 1rem;
    font-size: 20px;
  }

  input {
    padding: 1rem;
    width: 100%;
  }
`;

const Info = styled.fieldset`
  legend {
    font-weight: bold;
    font-size: 20px;
  }

  margin-bottom: 2rem;
  padding: 1rem;
  border: 1px solid #797979;
  align-self: start;
  width: 300px;
`;

const AnyReactComponent = ({ text }) => (
  <div
    style={{
      color: "white",
      display: "inline-flex",
      textAlign: "center",
      alignItems: "center",
      justifyContent: "center",
      transform: "translate(-50%, -50%)",
      width: 0,
      height: 0,
      borderLeft: "10px solid transparent",
      borderRight: "10px solid transparent",
      borderTop: "20px solid #f00",
    }}
  >
    {text}
  </div>
);

function Shop() {
  const { slug } = useParams();
  const { socket } = useContext(AppContext);
  const [shop, setShop] = React.useState({});
  const [bookings, setBookings] = React.useState([]);
  const [start, setstart] = React.useState(new Date());
  const [allTimes, setAllTimes] = React.useState([]);
  const [selectedServices, setSelectedServices] = React.useState([]);
  const [services, setServices] = React.useState([]);
  const [minDate, setMinDate] = useState(new Date());
  const [isClosed, setIsClosed] = useState(false);
  const [lng, setLng] = useState(null);

  const maxDate = moment(minDate).add(30, "days").toDate();

  useEffect(() => {
    getShop();
  }, []);

  useEffect(() => {
    if (start && bookings.length) {
      const times = getAvailableTimes(bookings);
      if (!times.length) {
      }
    }
  }, [start, bookings]);

  const getShop = async () => {
    const response = await HttpClient().get(`/api/shop/${slug}`);
    const servicesResponse = await HttpClient().get(
      `/api/shop/services/${response.data.shop._id}`
    );
    setServices(servicesResponse.data.services);
    setShop(response.data.shop);
    setLng(response.data.shop.longitude);

    const nextAvailableDate = getNextAvailableDay(
      moment().toDate(),
      response.data.shop
    );

    await getBookings(response.data.shop, nextAvailableDate);
  };

  const getBookings = async (shop, date) => {
    const { data } = await HttpClient().get(
      `/api/booking/${shop._id}?date=${date}`
    );

    let bookingsTimes = [];

    if (data.bookings.length) {
      bookingsTimes = getAvailableTimes(data.bookings);
    }

    setBookings(bookingsTimes);
    getAllTimes(bookingsTimes, date, shop);
  };

  const isWorkFreeDay = (date) => {
    return !shop.workFreeDays?.includes(moment(date).day());
  };

  const getNextAvailableDay = (date, shop) => {
    if (moment().add(30, "days").isBefore(moment(date))) {
      setIsClosed(true);
      return moment(date).toDate();
    }

    setIsClosed(false);

    if (shop.workFreeDays?.includes(moment(date).day())) {
      const newDate = moment(date).add(1, "days").toDate();
      return getNextAvailableDay(newDate, shop);
    }

    return moment(date).toDate();
  };

  function getAvailableTimes(takenTimes) {
    const times = [];
    takenTimes.forEach((takenTime) => {
      const start = moment({
        hour: moment(takenTime.start).hours(),
        minute: moment(takenTime.start).minutes(),
      });
      const end = moment({
        hour: moment(takenTime.end).hours(),
        minute: moment(takenTime.end).minutes(),
      });
      const diff = end.diff(start, "minutes");
      for (let i = 0; i <= diff; i += 15) {
        times.push({
          hour: moment(start).add(i, "minutes").hours(),
          minute: moment(start).add(i, "minutes").minutes(),
        });
      }

      times.pop();
    });

    return times;
  }

  const getAllTimes = (bookings, date, shop) => {
    const times = [];
    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < 60; j += 15) {
        /*
         * Check if the current day's time is after given hour & minute
         * */
        if (moment(date).isBefore(moment())) {
          if (
            moment(date)
              .set({ hour: moment().hours(), minute: moment().minutes() })
              .isAfter(
                moment({
                  hour: i,
                  minute: j,
                })
              )
          ) {
            continue;
          }
        }

        let startHour = 8;
        let startMinute = 0;
        let endHour = 17;
        let endMinute = 0;

        if (shop?.startTime && shop?.endTime) {
          startHour = moment(shop.startTime, "HH:mm").hours();
          startMinute = moment(shop.startTime, "HH:mm").minutes();
          endHour = moment(shop.endTime, "HH:mm").hours();
          endMinute = moment(shop.endTime, "HH:mm").minutes();
        }

        if (
          moment({ hour: i, minute: j }).isBefore(
            moment({ hour: startHour, minute: startMinute })
          )
        ) {
          continue;
        }

        if (
          moment({ hour: i, minute: j }).isSameOrAfter(
            moment({ hour: endHour, minute: endMinute })
          )
        ) {
          continue;
        }

        if (bookings.find((x) => x.hour === i && x.minute === j)) {
          continue;
        }

        times.push({
          hour: i,
          minute: j,
        });
      }
    }

    setAllTimes(times);
    if (times.length) {
      setstart(
        moment(date).hours(times[0].hour).minutes(times[0].minute).toDate()
      );
    }
  };

  const checkAvailableServices = (date, services) => {
    if (services.length === 0) {
      return;
    }

    const unavailable = isServiceUnavailable(
      services[services.length - 1],
      date,
      services
    );
    if (unavailable) {
      services.pop();
      setSelectedServices(services);
      return checkAvailableServices(date, services);
    }
  };

  const isServiceUnavailable = (service, date = null, services = null) => {
    const startDate = moment(date || start);
    const usedServices = services || selectedServices;
    const totalMinutes = moment
      .duration(
        usedServices.reduce((prev, cur) => prev + cur.minutes, 0),
        "minutes"
      )
      .asMinutes();
    const add = moment(startDate).add(
      !!services ? totalMinutes : totalMinutes + service.minutes,
      "minutes"
    );

    let returner = false;

    /*
     * Check if we are facing the end of the current day
     * */

    const endHour = moment(shop.endTime, "HH:mm").hours();
    const endMinute = moment(shop.endTime, "HH:mm").minutes();

    const endOfDay = moment(date || start).set({
      hour: endHour,
      minute: endMinute,
    });
    if (moment(add).isAfter(endOfDay)) {
      return true;
    }

    for (let time of bookings) {
      /*
       * We add 15 mins, because we want at least 15 mins for the job
       * */
      const comparer = moment(start)
        .set({
          hour: time.hour,
          minute: time.minute,
        })
        .add(15, "minutes");

      if (comparer.isBetween(start, add)) {
        returner = true;
        break;
      }

      if (
        comparer.hours() === add.hours() &&
        comparer.minutes() === add.minutes()
      ) {
        returner = true;
        break;
      }

      returner = false;
    }

    return returner;
  };

  const getServicesDuration = () => {
    return selectedServices.reduce((prev, cur) => prev + cur.minutes, 0);
  };

  const openBookingDialog = async () => {
    const result = await CustomDialog(
      <BookingDialog
        socket={socket}
        shopId={shop?._id}
        onBookingError={() =>
          getBookings(shop?._id, moment(start).format("YYYY-MM-DD"))
        }
        serviceMinutes={getServicesDuration()}
        services={selectedServices}
        start={start}
      />
    );

    if (result) {
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  const addService = (service) => {
    setSelectedServices([...selectedServices, service]);
  };

  const removeService = (service) => {
    setSelectedServices(
      selectedServices.filter((x) => x.name !== service.name)
    );
  };

  const isServiceSelected = (service) => {
    return selectedServices.find((x) => x.name === service.name);
  };

  const handleDateChange = async (date) => {
    setstart(date);

    if (moment(date).date() === moment(start).date()) {
      checkAvailableServices(date, [
        ...selectedServices.sort((a, b) => a.position - b.position),
      ]);
      return;
    }

    await getBookings(shop, moment(date).format("YYYY-MM-DD"));
  };

  return (
    <Page>
      <Wrapper>
        {shop && (
          <>
            <Title style={{ fontSize: 40 }}>{shop?.name}</Title>

            <Info>
              <legend>Oplysninger om butikken</legend>
              <p>{shop?.address}</p>
              <p>
                {shop?.city}, {shop?.zip}
              </p>
              <p>Telefon: {shop?.phone}</p>
              <p>
                Kørselsvejledning:{" "}
                <a
                  href={`https://www.google.com/maps/place/${shop?.address},${shop?.zip} ${shop?.city}`}
                  target="_blank"
                >
                  Klik her
                </a>
              </p>
            </Info>

            {lng && (
              <div style={{ height: 300, width: "100%", marginBottom: "1rem" }}>
                <GoogleMapReact
                  bootstrapURLKeys={{
                    key: import.meta.env.VITE_GOOGLE_API_KEY,
                  }}
                  defaultCenter={{
                    lat: shop.latitude,
                    lng: shop.longitude,
                  }}
                  defaultZoom={15}
                >
                  <AnyReactComponent lat={shop.latitude} lng={shop.longitude} />
                </GoogleMapReact>
              </div>
            )}

            {!allTimes.length && (
              <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                <p style={{ color: "red" }}>Butikken er desværre lukket nu</p>
              </div>
            )}

            {start && (
              <Time>
                <h3>Vælg Dato</h3>
                <DatePicker
                  selected={start}
                  onChange={(date) => handleDateChange(date)}
                  minDate={minDate}
                  maxDate={maxDate}
                  filterDate={(date) => isWorkFreeDay(date)}
                  dateFormat="dd-MM-yyyy"
                  locale={da}
                />
              </Time>
            )}

            {!!services.length && !!start && !isClosed && (
              <>
                <Time>
                  <h3>Vælg Tidspunkt</h3>
                  <DatePicker
                    selected={start}
                    onChange={(date) => handleDateChange(date)}
                    showTimeSelect
                    disabled={!allTimes.length}
                    showTimeSelectOnly
                    timeIntervals={15}
                    includeTimes={[
                      ...allTimes.map(({ hour, minute }) =>
                        setHours(setMinutes(new Date(), minute), hour)
                      ),
                    ]}
                    locale={da}
                    timeCaption="Tidspunkt"
                    dateFormat="HH:mm"
                  />
                </Time>

                <Services>
                  <h3>Vælg Services</h3>
                  <Table>
                    <thead>
                      <tr>
                        <td style={{ width: 300 }}>Service</td>
                        <td className="hide-mobile">Pris</td>
                        <td>Tid</td>
                        <td>Tilføj</td>
                      </tr>
                    </thead>
                    <tbody>
                      {services
                        .sort((a, b) => a.position - b.position)
                        .map((service, index) => (
                          <tr key={index}>
                            <td style={{ width: 400 }}>{service.name}</td>
                            <td className="hide-mobile">{service.price} kr</td>
                            <td>{service.minutes} min.</td>
                            <td>
                              <PrimaryButton
                                disabled={
                                  !allTimes.length ||
                                  (isServiceUnavailable(service) &&
                                    !isServiceSelected(service))
                                }
                                onClick={
                                  isServiceSelected(service)
                                    ? () => removeService(service)
                                    : () => addService(service)
                                }
                              >
                                {isServiceSelected(service)
                                  ? "Fjern"
                                  : "Tilføj"}
                              </PrimaryButton>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>

                  {selectedServices.length > 0 && (
                    <PrimaryButton
                      disabled={!allTimes.length}
                      onClick={openBookingDialog}
                    >
                      Bestil
                    </PrimaryButton>
                  )}
                </Services>
              </>
            )}
          </>
        )}
      </Wrapper>
    </Page>
  );
}

export default Shop;
