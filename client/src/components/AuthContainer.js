import styled from "styled-components";

export const AuthContainer = styled.div`
  max-width: 1100px;
  margin: 0 auto;

  .content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
    background-color: white;
    padding: 2rem;
    width: 600px;
    margin: 0 auto;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

    form {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      align-items: flex-start;
    }

    h1 {
      text-align: center;
    }

    .header {
      text-align: center;

      a {
        color: #007bff;
      }
    }
  }
`;
