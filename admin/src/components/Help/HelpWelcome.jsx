import React, { useContext } from "react";
import AppContext from "../../AppContext";
import cogoToast from "cogo-toast";
import PrimaryButton from "../UI/PrimaryButton";

export default function HelpWelcome() {
  const { setCurrentHelp, currentHelp } = useContext(AppContext);

  const onNext = () => {
    cogoToast.success("Let's start!");
    setCurrentHelp(currentHelp + 1);
  };

  return (
    <div>
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
    </div>
  );
}
