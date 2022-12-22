import React, { useRef } from "react";
import JoditEditor from "jodit-react";

export default function Editor({ value, onChange }) {
  const editor = useRef();

  const config = React.useMemo(
    () => ({
      readonly: false,
      spellcheck: false,
      minHeight: 300,
      toolbarButtonSize: "medium",
      showCharsCounter: false,
      showPlaceholder: false,
      showXPathInStatusbar: false,
      disablePlugins: "clean-html, paste",
      removeButtons: [
        "fullsize",
        "undo",
        "redo",
        "copyformat",
        "strikethrough",
        "eraser",
      ],
      buttons: [
        "bold",
        "italic",
        "underline",
        "|",
        "paragraph",
        "fontsize",
        "font",
        "|",
        "ul",
        "ol",
        "|",
        "indent",
        "outdent",
        "|",
        "left",
        "center",
        "right",
        "|",
        "link",
        "image",
        "hr",
      ],
    }),
    []
  );
  return (
    <div style={{ width: "100%" }}>
      <JoditEditor
        ref={editor}
        value={value}
        tabIndex={1}
        config={config}
        onBlur={(newContent) => onChange(newContent)} // preferred to use only this option to update the body for performance reasons
        onChange={(newContent) => {}}
      />
    </div>
  );
}
