import MediaExplorerDialog from "components/MediaExplorerDialog";
import { CustomDialog } from "react-st-modal";
import React from "react";

export const useMediaExplorerDialog = () => {
  const showMediaExplorerDialog = async () => {
    const image = await CustomDialog(<MediaExplorerDialog />);
    return image;
  };

  return {
    showMediaExplorerDialog,
  };
};
