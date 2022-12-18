import React, { useContext } from "react";
import AppContext from "../../AppContext";
import cogoToast from "cogo-toast";
import PrimaryButton from "../UI/PrimaryButton";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-start;

  p {
    line-height: 1.5;
  }
`;

export default function HelpWelcome() {
  const { setCurrentHelp, currentHelp } = useContext(AppContext);

  const onNext = () => {
    cogoToast.success("Let's start!");
    setCurrentHelp(currentHelp + 1);
  };

  return (
    <Container>
      <h1>Welcome</h1>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem
        necessitatibus delectus dignissimos minima! Exercitationem voluptatibus
        possimus soluta dignissimos officia, vitae maxime aut qui. Totam,
        adipisci. Eligendi sapiente eum fuga id suscipit doloremque aspernatur
        optio provident similique, distinctio ratione repellat earum. Est
        numquam recusandae eos facere, architecto a dolores saepe nulla!
      </p>

      <PrimaryButton onClick={onNext}>Next</PrimaryButton>
    </Container>
  );
}
