import React, { useContext } from "react";
import AppContext from "../../AppContext";
import cogoToast from "cogo-toast";
import { CouponUpdateCreateDialog } from "../CouponUpdateCreateDialog";

export default function HelpCreateCoupon() {
  const { setCurrentHelp, currentHelp } = useContext(AppContext);

  const onCreated = () => {
    cogoToast.success("Very good!");
    setCurrentHelp(currentHelp + 1);
  };

  return (
    <div>
      <CouponUpdateCreateDialog onCreated={onCreated} />
    </div>
  );
}
