import React, {useState} from 'react';
import styled from "styled-components";
import {Form} from "./UI/Form";
import {UI} from "./UI/UI";
import PrimaryButton from "./UI/PrimaryButton";
import HttpClient from "../services/HttpClient";
import cogoToast from "cogo-toast";
import {useDialog} from "react-st-modal";


const Wrapper = styled.div`
  background-color: var(--primary-light);
  padding: 1rem;

  h2 {
    margin: 0;
    margin-bottom: 1rem;
    font-size: 40px;
  }
`;


function PersonalAdviceDialog() {
  const dialog = useDialog()
  const [name, setName] = useState("")
  const [type, setType] = useState("")
  const [details, setDetails] = useState("")

  const sendInquiry = async (e) => {
    e.preventDefault()
    await HttpClient().post("/api/inquiries", {
      type,
      details,
      name
    })

    cogoToast.success("Din forespørgsel er sendt")
    dialog.close()
  }

  return (
    <Wrapper>
      <h2>Personlig Rådgivning</h2>
      <form onSubmit={sendInquiry}>
        <Form.TextField value={name} onChange={e => setName(e.target.value)} label="Dit navn"
                        placeholder="Navn"/>

        <UI.Spacer bottom={1}/>

        <Form.Select value={type} onChange={e => setType(e.target.value)} label="Type">
          <option value="">Vælg type</option>
          <option value="phone">Telefon</option>
          <option value="skype">Skype</option>
          <option value="discord">Discord</option>
        </Form.Select>


        {type && (
          <>
            <UI.Spacer bottom={1}/>
            {type === "phone" && (
              <Form.TextField value={details} onChange={e => setDetails(e.target.value)} label="Telefonnummer"
                              placeholder="+45 12345678"/>
            )}

            {type === "skype" && (
              <Form.TextField value={details} onChange={e => setDetails(e.target.value)} label="Skype Brugernavn"
                              placeholder="skype"/>
            )}

            {type === "discord" && (
              <Form.TextField value={details} onChange={e => setDetails(e.target.value)} label="Discord Brugernavn"
                              placeholder="discord"/>
            )}
          </>
        )}

        <UI.Spacer bottom={1}/>

        <PrimaryButton type={"submit"}>Send</PrimaryButton>
      </form>
    </Wrapper>
  );
}

export default PersonalAdviceDialog;