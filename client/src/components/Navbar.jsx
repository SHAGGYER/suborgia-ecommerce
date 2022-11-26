import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import AppContext from "../AppContext";
import NavbarSubmenu from "./NavbarSubmenu";
import { CustomDialog } from "react-st-modal";
import LoginDialog from "./LoginDialog";
import SetupDialog from "./SetupDialog";
import IconHome from "../images/icon_home.svg";
import IconAccount from "../images/icon_account.svg";
import IconShop from "../images/icon_shop.svg";
import PaymentDialog from "./PaymentDialog";
import BillingDialog from "./BillingDialog";
import PersonalAdviceDialog from "./PersonalAdviceDialog";

const Container = styled.div`
  max-width: 100%;
  margin: 0 auto;
  background-color: var(--primary);
`;

const Wrapper = styled.nav`
  max-width: 1100px;
  margin: 0 auto;
  padding: 1rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .logo {
    font-family: "Anton", sans-serif;
    font-size: 45px;
    cursor: pointer;

    @media (max-width: 550px) {
      font-size: 25px;
    }
  }

  .toggler {
    display: none;
  }

  @media screen and (max-width: 550px) {
    .toggler {
      display: block;
      font-size: 30px;
      cursor: pointer;
    }
  }

  .nav {
    list-style: none;
    display: flex;
    gap: 0.5rem;
    margin-left: 0;
    padding: 0;
    align-items: center;

    .navlink {
      padding: 0.5rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.35rem;
      position: relative;

      img {
        width: 20px;
      }

      :hover {
        background-color: var(--primary-light);
      }
    }

    .submenu-link {
      padding: 0.5rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.35rem;

      img {
        width: 20px;
      }

      :hover {
        background-color: var(--primary);
      }
    }

    @media screen and (max-width: 550px) {
      flex-direction: column;
      justify-content: start;
      text-align: left;
      align-items: flex-start;
      position: absolute;
      right: 20px;
      top: 50px;
      background-color: white;
    }
  }
`;

export default function Navbar() {
  const history = useHistory();
  const { user, logout, setUser } = useContext(AppContext);
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(
    window.matchMedia("(max-width: 550px)").matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 550px)");
    mediaQuery.addEventListener("change", (e) => setIsMobile(e.matches));
  }, []);

  return (
    <Container>
      <Wrapper>
        <article className="logo" onClick={() => history.push("/")}>
          DaySure
        </article>

        {(open || !isMobile) && (
          <ul className="nav">
            <li className="navlink" onClick={() => history.push("/")}>
              <img src={IconHome} alt="Home" />
              Home
            </li>
            <li className="navlink" onClick={() => history.push("/sales")}>
              <img src={IconShop} alt="Shop" />
              Til Forretninger
            </li>
            <NavbarSubmenu
              title="Konto"
              icon={IconAccount}
              content={() => (
                <div style={{ width: 200, padding: "1rem" }}>
                  {!user ? (
                    <ul
                      className="nav"
                      style={{
                        flexDirection: "column",
                        alignItems: "stretch",
                      }}
                    >
                      <li
                        onClick={() => {
                          window.location.href = import.meta.env.VITE_USER_URL;
                        }}
                        className="submenu-link"
                      >
                        Log Ind
                      </li>
                    </ul>
                  ) : (
                    <ul
                      className="nav"
                      style={{
                        flexDirection: "column",
                        alignItems: "stretch",
                      }}
                    >
                      <li
                        onClick={() =>
                          (window.location.href = import.meta.env.VITE_USER_URL)
                        }
                        className="submenu-link"
                      >
                        Gå til Admin Panel
                      </li>
                      <li onClick={logout} className="submenu-link">
                        Log Ud
                      </li>
                    </ul>
                  )}
                </div>
              )}
            />
          </ul>
        )}

        <div className="toggler">
          <i className="fas fa-bars" onClick={() => setOpen(!open)}></i>
        </div>
      </Wrapper>
    </Container>
  );
}
