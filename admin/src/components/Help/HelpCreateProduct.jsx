import React, { useContext } from "react";
import AppContext from "../../AppContext";
import cogoToast from "cogo-toast";
import { ProductUpdateCreateDialog } from "../ProductUpdateCreateDialog";

export default function HelpCreateProduct() {
  const { setCurrentHelp, currentHelp } = useContext(AppContext);

  const onCreated = () => {
    cogoToast.success("Nice one!");
    setCurrentHelp(currentHelp + 1);
  };

  return (
    <div>
      <ProductUpdateCreateDialog onCreated={onCreated} />
    </div>
  );
}
