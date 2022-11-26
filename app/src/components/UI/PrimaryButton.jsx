import styled from "styled-components";

const PrimaryButton = styled.button`
  background-color: var(--primary-light);
  border: none;
  padding: 0.75rem 1.5rem;
  color: black;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  img {
    width: 20px;
  }

  cursor: ${(props) => (!!props.$loading ? "not-allowed" : "pointer")};

  :disabled {
    cursor: not-allowed;
    opacity: 50%;
  }
`;

export default PrimaryButton;
