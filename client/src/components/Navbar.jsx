import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import AppContext from "../AppContext";
import NavbarSubmenu from "./NavbarSubmenu";

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
    color: white;

    @media (max-width: 550px) {
      font-size: 25px;
    }
  }

  .toggler {
    display: none;
  }

  @media screen and (max-width: 1100px) {
    .toggler {
      display: block;
      font-size: 30px;
      cursor: pointer;
      color: white;
    }
  }

  .nav {
    list-style: none;
    display: flex;
    gap: 0.5rem;
    margin-left: 0;
    padding: 0;
    align-items: center;

    @media screen and (max-width: 1100px) {
      display: none;
    }

    > .navlink {
      padding: 0.5rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.35rem;
      position: relative;
      color: white;

      :hover {
        background-color: var(--primary-light);
      }
    }
  }
`;

const SidebarStyled = styled.div`
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: 300px;
    height: 100vh;
    background-color: var(--primary);
    z-index: 1000;
    transform: translateX(-100%);
    opacity: 0;
    transition: all 0.5s ease-in-out;

    &.open {
      transform: translateX(0);
      opacity: 1;
    }

    .nav {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding: 1rem 0;
      color: white;
      position: relative;

      > .navlink {
        padding: 1rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.35rem;
        position: relative;
        color: white;

        :hover {
          background-color: var(--primary);
        }
      }
    }
  }

  .backdrop {
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }
`;

const Sidebar = ({ open, setOpen }) => {
  useEffect(() => {
    let handler = () => {
      console.log("clicked");
      setOpen(false);
    };

    const navlinks = document.querySelectorAll(
      ".sidebar .navlink:not(.no-close)"
    );

    navlinks.forEach((navlink) => {
      navlink.addEventListener("click", handler);
    });

    return () => {
      navlinks.forEach((navlink) => {
        navlink.removeEventListener("click", handler);
      });
    };
  }, []);

  return (
    <SidebarStyled>
      <div className={"sidebar " + (open ? "open" : "")}>
        <Menu />
      </div>

      <div
        className="backdrop"
        style={{ display: open ? "block" : "none" }}
        onClick={() => setOpen(false)}
      ></div>
    </SidebarStyled>
  );
};

const Menu = ({}) => {
  const { user } = useContext(AppContext);
  const history = useHistory();

  return (
    <ul className="nav">
      <li className="navlink" onClick={() => history.push("/")}>
        Home
      </li>
      <li className="navlink" onClick={() => history.push("/sales")}>
        Til Forretninger
      </li>
      <NavbarSubmenu
        title="Konto"
        content={() => (
          <div style={{ width: 200, padding: "1rem" }}>
            {!user ? (
              <ul
                style={{
                  display: "flex",
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
      <li className="navlink" onClick={() => history.push("/cart")}>
        Cart
      </li>
    </ul>
  );
};

export default function Navbar() {
  const history = useHistory();
  const { user, logout } = useContext(AppContext);
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(
    window.matchMedia("(max-width: 550px)").matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1100px)");
    mediaQuery.addEventListener("change", (e) => setIsMobile(e.matches));
  }, []);

  return (
    <Container>
      <Wrapper>
        <article className="logo" onClick={() => history.push("/")}>
          DaySure
        </article>

        <Menu />

        <div className="toggler">
          <i className="fas fa-bars" onClick={() => setOpen(!open)}></i>
        </div>
      </Wrapper>
      <Sidebar open={open} setOpen={setOpen} />
    </Container>
  );
}
