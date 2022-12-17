import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import AppContext from "../AppContext";
import NavbarSubmenu from "./NavbarSubmenu";

const Container = styled.div`
  width: 100%;
  margin: 0 auto;
  background-color: var(--primary);

  .menu-footer {
    display: none;
  }

  @media screen and (max-width: 1100px) {
    .menu-footer {
      display: grid;
      grid-template-columns: 1fr 1fr;
      align-items: center;
      background-color: black;

      article {
        background-color: black;
        padding: 1rem;
        width: 100%;
        text-align: center;

        a {
          color: white;
          text-decoration: none;
        }
      }
    }
  }
`;

const Wrapper = styled.nav`
  max-width: 1100px;
  margin: 0 auto;
  padding: 1rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;

  .main-menu {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

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

    .toggler {
      display: none;
      position: absolute;
      top: 10px;
      right: 10px;

      i {
        font-size: 30px;
        cursor: pointer;
        color: white;
      }
    }

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

        <div className="toggler">
          <i className="fa-solid fa-bars" />
        </div>
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
  const { user, logout } = useContext(AppContext);
  const history = useHistory();

  return (
    <>
      <ul className="nav">
        <li className="navlink" onClick={() => history.push("/")}>
          Home
        </li>
        <li className="navlink" onClick={() => history.push("/sales")}>
          Til Forretninger
        </li>
      </ul>
    </>
  );
};

export default function Navbar() {
  const { user, logout } = useContext(AppContext);
  const history = useHistory();
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

        <div className="main-menu">
          <Menu />
        </div>

        <div>
          <ul className="nav">
            <NavbarSubmenu
              title="Account"
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
                          history.push("/login");
                        }}
                        className="submenu-link"
                      >
                        Login
                      </li>
                      <li
                        onClick={() => {
                          history.push("/register");
                        }}
                        className="submenu-link"
                      >
                        Create Account
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
                      <li onClick={logout} className="submenu-link">
                        Logout
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
        </div>

        <div className="toggler">
          <i className="fas fa-bars" onClick={() => setOpen(!open)}></i>
        </div>
      </Wrapper>
      <div className="menu-footer">
        <article>
          <a href="#">Account</a>
        </article>
        <article>
          <a href="#" onClick={() => history.push("/cart")}>
            Cart
          </a>
        </article>
      </div>
      <Sidebar open={open} setOpen={setOpen} />
    </Container>
  );
}
