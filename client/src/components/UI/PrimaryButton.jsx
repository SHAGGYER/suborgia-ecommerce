import styled from "styled-components";

const PrimaryButton = styled.button`
  background-color: var(--primary-light);
  border: none;
  padding: 0.5rem 2rem;
  color: black;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 17px;
  transition: all 0.3s ease-in-out;

  img {
    width: 20px;
  }

  :hover {
    background-color: var(--primary-dark);
  }
  
  :disabled {
    opacity: 50%;
    cursor: not-allowed;
    
    :hover {
      background-color: var(--primary-light);
    }
  }

  cursor: ${(props) => (!!props.$loading ? "not-allowed" : "pointer")};
`;

export default PrimaryButton;
