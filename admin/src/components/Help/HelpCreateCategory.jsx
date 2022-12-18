import React, { useContext } from "react";
import AppContext from "../../AppContext";
import cogoToast from "cogo-toast";
import { CategoryUpdateCreateDialog } from "../CategoryUpdateCreateDialog";

export default function HelpCreateCategory() {
  const { setCurrentHelp, currentHelp } = useContext(AppContext);

  const onCreated = () => {
    cogoToast.success("Good job!");
    setCurrentHelp(currentHelp + 1);
  };

  return (
    <div>
      <CategoryUpdateCreateDialog onCreated={onCreated} />
    </div>
  );
}
