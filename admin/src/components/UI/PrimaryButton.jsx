import styled from "styled-components";

const PrimaryButtonStyled = styled.button`
  background-color: var(--primary);
  border: none;
  padding: 0.5rem 1rem;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease-in-out;
  border-radius: 0.5rem;

  &:hover {
    background-color: var(--primary-dark);
    color: white;
  }

  img {
    width: 20px;
  }

  cursor: ${(props) => (!!props.$loading ? "not-allowed" : "pointer")};

  :disabled {
    cursor: not-allowed;
    opacity: 50%;
  }
`;

export default function PrimaryButton({
  type,
  children,
  disabled,
  loading,
  onClick,
}) {
  return (
    <PrimaryButtonStyled
      type={type ? type : "submit"}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading && <i className="fa-solid fa-spinner fa-spin"></i>}
      {children}
    </PrimaryButtonStyled>
  );
}
