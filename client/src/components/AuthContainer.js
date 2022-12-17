import styled from "styled-components";

export const AuthContainer = styled.div`
  max-width: 1100px;
  margin: 0 auto;

  .content {
    background-color: white;
    padding: 2rem;
    width: 600px;
    margin: 0 auto;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

    h1 {
      text-align: center;
      margin-bottom: 0.5rem;
    }

    .header {
      text-align: center;
      margin-bottom: 2rem;

      a {
        color: #007bff;
      }
    }
  }
`;
