import styled from "styled-components";

export const Pagination = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;
  margin-top: 1rem;
  margin-bottom: 1rem;

  .controls {
    display: flex;
    gap: 1rem;

    i {
      cursor: pointer;

      &.disabled {
        color: #e2e8f0;
      }
    }
  }
`;
