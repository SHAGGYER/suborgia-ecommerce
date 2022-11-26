import React, {useEffect} from 'react';
import DatePicker from "react-datepicker";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
import da from "date-fns/locale/da";
import "react-datepicker/dist/react-datepicker.css";
import styled from "styled-components";
import cogoToast from "cogo-toast";
import moment from "moment";
import PrimaryButton from "./UI/PrimaryButton";
import HttpClient from "../services/HttpClient";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: start;

  h3 {
    font-size: 16px;
    font-weight: normal;
    text-decoration: underline;
  }

  button {
    margin-bottom: 0;
  }

  article {
    display: flex;
    align-items: end;
    gap: 0.5rem;
  }

  input {
    padding: 1rem;
    width: 100%;
  }

  .work-free-days {
    display: flex;
    gap: 1rem;

    label {
      display: flex;
      gap: 0.5rem;

      input[type="checkbox"] {
        width: 20px;
        height: 20px;
      }
    }
  }


`

function OpeningHours({shop, setShop}) {
  const [startTime, setStartTime] = React.useState(shop?.startTime ? moment(shop.startTime, "HH:mm").toDate() : new Date());
  const [endTime, setEndTime] = React.useState(shop?.endTime ? moment(shop.endTime, "HH:mm").toDate() : new Date());
  const [workFreeDays, setWorkFreeDays] = React.useState({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    0: false
  });

  useEffect(() => {
    if (shop) {
      setStartTime(shop.startTime ? moment(shop.startTime, "HH:mm").toDate() : new Date());
      setEndTime(shop.endTime ? moment(shop.endTime, "HH:mm").toDate() : new Date());
      setWorkFreeDays({
        1: shop.workFreeDays.includes(1),
        2: shop.workFreeDays.includes(2),
        3: shop.workFreeDays.includes(3),
        4: shop.workFreeDays.includes(4),
        5: shop.workFreeDays.includes(5),
        6: shop.workFreeDays.includes(6),
        0: shop.workFreeDays.includes(0)
      });
    }
  }, [shop])

  const save = async event => {
    event.preventDefault();


    if (moment(startTime).isSameOrAfter(endTime)) {
      cogoToast.error("Sluttid skal være efter starttid");
      return;
    }

    const data = {
      startTime: moment(startTime).format("HH:mm"),
      endTime: moment(endTime).format("HH:mm"),
      shopId: shop._id,
      workFreeDays: Object.keys(workFreeDays).filter(day => workFreeDays[day]).map(day => parseInt(day))
    }

    try {
      await HttpClient().post("/api/shop/opening-hours", data);
      setShop({
        ...shop,
        workFreeDays: Object.keys(workFreeDays).filter(day => workFreeDays[day]).map(day => parseInt(day)),
        startTime: moment(startTime, "HH:mm").format("HH:mm"),
        endTime: moment(endTime, "HH:mm").format("HH:mm")
      });
      cogoToast.success("Åbningstider opdateret");
    } catch (e) {
      cogoToast.error("Der skete en fejl");
    }
  }

  const handleChangeWorkFreeDays = (prop, event) => {
    setWorkFreeDays({
      ...workFreeDays,
      [prop]: event.target.checked
    });
  }

  return (
    <div className={"full-width"}>
      <h2>Åbningstider</h2>
      <Form onSubmit={save}>
        <article>
          <div>
            <label htmlFor="startTime">
              Starttid
              <DatePicker
                selected={startTime}
                onChange={(date) => setStartTime(date)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                locale={da}
                timeCaption="Start Tidspunkt"
                dateFormat="HH:mm"
              />
            </label>
          </div>
          <div>
            <label htmlFor="startTime">
              Sluttid
              <DatePicker
                selected={endTime}
                onChange={(date) => setEndTime(date)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                locale={da}
                timeCaption="Slut Tidspunkt"
                dateFormat="HH:mm"
              />
            </label>
          </div>
        </article>

        <h3>Arbejdsfrie dage</h3>
        <div className="work-free-days">
          <label>
            Mandag
            <input type="checkbox" checked={workFreeDays[1]} onChange={e => handleChangeWorkFreeDays(1, e)}/>
          </label>
          <label>
            Tirsdag
            <input type="checkbox" checked={workFreeDays[2]} onChange={e => handleChangeWorkFreeDays(2, e)}/>
          </label>
          <label>
            Onsdag
            <input type="checkbox" checked={workFreeDays[3]}
                   onChange={e => handleChangeWorkFreeDays(3, e)}/>
          </label>
          <label>
            Torsdag
            <input type="checkbox" checked={workFreeDays[4]}
                   onChange={e => handleChangeWorkFreeDays(4, e)}/>
          </label>
          <label>
            Fredag
            <input type="checkbox" checked={workFreeDays[5]} onChange={e => handleChangeWorkFreeDays(5, e)}/>
          </label>
          <label>
            Lørdag
            <input type="checkbox" checked={workFreeDays[6]}
                   onChange={e => handleChangeWorkFreeDays(6, e)}/>
          </label>
          <label>
            Søndag
            <input type="checkbox" checked={workFreeDays[0]} onChange={e => handleChangeWorkFreeDays(0, e)}/>
          </label>
        </div>

        <PrimaryButton type={"submit"}>Gem</PrimaryButton>


      </Form>
    </div>
  );
}

export default OpeningHours;