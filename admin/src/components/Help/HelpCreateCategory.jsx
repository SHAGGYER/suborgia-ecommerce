import React, { useContext } from "react";
import AppContext from "../../AppContext";
import { CreateCategoryDialog } from "../../pages/Categories";
import cogoToast from "cogo-toast";

export default function HelpCreateCategory() {
  const { setCurrentHelp, currentHelp } = useContext(AppContext);

  const onCreated = () => {
    cogoToast.success("Good job!");
    setCurrentHelp(currentHelp + 1);
  };

  return (
    <div>
      <CreateCategoryDialog onCreated={onCreated} />
    </div>
  );
}
