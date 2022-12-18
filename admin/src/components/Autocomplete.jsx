import React from "react";
import styled from "styled-components";
import FloatingTextField from "./FloatingTextField";
import { useClickOutside } from "../hooks/ClickOutside";
import HttpClient from "../services/HttpClient";

const AutocompleteStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  position: relative;

  .results {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 0.5rem;
    width: 100%;
    border: 3px solid #efefef;
    background-color: white;
    position: absolute;
    top: 50px;
    z-index: 1;
    max-height: 400px;
    overflow-y: auto;

    div {
      padding: 0.5rem;
      cursor: pointer;
      width: 100%;

      &:hover {
        background-color: #efefef;
      }
    }
  }
`;

export default function Autocomplete({ label, url, prop, onSelect, error }) {
  const [value, setValue] = React.useState("");
  const [items, setItems] = React.useState([]);
  const [open, setOpen] = React.useState(false);

  const ref = React.useRef();
  useClickOutside(ref, () => setOpen(false));

  React.useEffect(() => {
    let timer;
    if (value) {
      timer = setTimeout(() => {
        search();
      }, 500);
    }
    return () => clearTimeout(timer);
  }, [value]);

  const search = async () => {
    const { data } = await HttpClient().get(url + "?search=" + value);
    setItems(data.content.data);
    setOpen(true);
  };

  return (
    <AutocompleteStyled>
      <FloatingTextField
        error={error}
        label={label}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      {open && (
        <article className="results" ref={ref}>
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                onSelect(item);
                setOpen(false);
              }}
            >
              {item[prop]}
            </div>
          ))}
        </article>
      )}
    </AutocompleteStyled>
  );
}
