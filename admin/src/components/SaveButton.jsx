import React from "react";
import PrimaryButton from "./UI/PrimaryButton";

export default function SaveButton({
  onSaveAndClose,
  loading,
  onDelete,
  noDelete,
}) {
  return (
    <div style={{ display: "flex", gap: "0.25rem", alignItems: "center" }}>
      <PrimaryButton loading={loading} type="button" onClick={onSaveAndClose}>
        Save & Close
      </PrimaryButton>
      {!noDelete && (
        <PrimaryButton loading={loading} typ="button" onClick={onDelete}>
          Delete Row
        </PrimaryButton>
      )}
    </div>
  );
}
