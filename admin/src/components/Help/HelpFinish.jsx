import React, { useContext } from "react";
import AppContext from "../../AppContext";

export default function HelpFinish() {
  const { setCurrentHelp, currentHelp } = useContext(AppContext);

  return (
    <div>
      <h1>Finish</h1>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem
        necessitatibus delectus dignissimos minima! Exercitationem voluptatibus
        possimus.
      </p>
    </div>
  );
}
