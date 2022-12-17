import React, { useEffect } from "react";
import styled from "styled-components";

const ProgressTimelineStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  border: none;
  padding-left: 2rem;

  ul {
    list-style: none;
    li {
      position: relative;
      padding: 1.25rem 0;
      cursor: pointer;

      &.selected .checkmark {
        background-color: white;
        border: 3px solid var(--primary);

        span {
          color: var(--primary);
        }
      }

      &.pending .checkmark {
        background-color: white;
        border: 3px solid #cbd5e1;
        span {
          color: #cbd5e1;
        }
      }

      &.pending .line,
      &.selected .line {
        background-color: #cbd5e1;
      }

      article {
        padding-left: 2rem;
        position: relative;
        top: -1.25rem;

        h3 {
          font-size: 14px;
          font-weight: bold;
        }

        p {
          font-size: 12px;
          color: #737783;
        }
      }

      .line {
        position: absolute;
        top: 0;
        left: 0;
        width: 3px;
        height: 100%;
        background-color: var(--primary);
        z-index: 1;
      }

      .checkmark {
        z-index: 2;
        position: absolute;
        top: 0;
        left: -14px;
        border-radius: 50%;
        padding: 0.25rem;
        background-color: var(--primary);
        width: 30px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;

        span {
          color: white;
        }

        i {
          color: white;
        }
      }

      &:hover:not(.selected) {
        .checkmark {
          background-color: #3730a3;
          border: 3px solid #3730a3;
        }

        &.pending .checkmark {
          background-color: white;
          border: 3px solid #c0c9d5;
        }
      }
    }
  }
`;

export default function ProgressTimeline({
  items,
  selected,
  setSelected,
  onChange,
}) {
  const handleChange = (index) => {
    setSelected(index);
    onChange(index);
  };

  useEffect(() => {
    if (selected >= 0) {
      onChange(selected);
    }
  }, [selected]);

  return (
    <ProgressTimelineStyled>
      <ul>
        {items.map((item, index) => (
          <li
            key={index}
            onClick={() => handleChange(index)}
            className={
              selected === index
                ? "selected"
                : selected < index
                ? "pending"
                : ""
            }
          >
            <div className={"checkmark"}>
              {selected <= index ? (
                <span>{index + 1}</span>
              ) : (
                <i className="fas fa-check"></i>
              )}
            </div>
            <div className="line"></div>
            <article>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          </li>
        ))}
      </ul>
    </ProgressTimelineStyled>
  );
}
