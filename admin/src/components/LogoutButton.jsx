import styled from "styled-components";

const LogoutButton = styled.button`
  background-color: #ff62c6;
  border: none;
  padding: 1rem 1rem;
  color: black;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
  justify-content: center;

  img {
    width: 20px;
  }

  cursor: ${(props) => (!!props.$loading ? "not-allowed" : "pointer")};
`;

export default LogoutButton;
