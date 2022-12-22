import React, { useContext, useEffect } from "react";
import styled from "styled-components";
import AppContext from "../AppContext";
import LogoutButton from "./LogoutButton";
import { useLocation, useNavigate } from "react-router-dom";
import SidebarMenu from "./SidebarMenu";

const SidebarWrapper = styled.div`
  width: 300px;
  height: 100%;
  background-color: #0f172a;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  color: white;

  .header {
    display: flex;
    text-align: center;
    flex-direction: column;
    padding: 1rem;

    h1 {
      margin-bottom: 0.5rem;
      line-height: 1;
      font-family: "Anton", sans-serif;
      letter-spacing: 2px;
    }
  }

  .content {
    flex: 1;
    padding: 1rem;

    .section {
      margin-bottom: 1rem;
      span {
        display: block;
        padding-left: 1rem;
        margin-bottom: 0.5rem;
        color: #728af8;
        text-transform: uppercase;
        font-size: 14px;
      }

      p {
        padding-left: 1rem;
        font-size: 12px;
        color: #737783;
        margin-bottom: 1rem;
        font-weight: bold;
      }

      ul {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
          padding: 0.75rem 1rem;
          margin: 0 0 0.5rem;
          border-radius: 0.5rem;
          background-color: transparent;
          font-size: 14px;
          cursor: pointer;
          user-select: none;
          color: #c6c8cc;
          display: flex;
          gap: 0.75rem;
          align-items: center;

          i {
            font-size: 20px;
          }

          &:hover,
          &.active {
            background-color: #2c3344;
            color: white;
          }
        }
      }
    }
  }
`;

function Sidebar(props) {
  const { admin, logout } = useContext(AppContext);
  const location = useLocation();
  const [closeSubmenus, setCloseSubmenus] = React.useState(false);
  const [currentOpen, setCurrentOpen] = React.useState(null);

  useEffect(() => {
    if (closeSubmenus) {
      setCloseSubmenus(false);
    }
  }, [closeSubmenus]);

  const navigate = useNavigate();

  const items = [
    {
      section: "Dashboards",
      description: "Overview of your store",
      items: [
        {
          title: "Dashboard",
          to: "/",
          icon: <i className="fa-solid fa-gauge-high" />,
        },
        {
          title: "Analytics",
          to: "/analytics",
          icon: <i className="fa-solid fa-gauge-high" />,
        },
      ],
    },
    {
      section: "Resources",
      description: "Manage your store",
      items: [
        {
          title: "Users",
          icon: <i className="fa-solid fa-users" />,
          items: [
            {
              title: "Browse",
              to: "/users",
            },
          ],
        },
        {
          title: "Categories",
          icon: <i className="fa-solid fa-table-cells-large" />,
          items: [
            {
              title: "Browse",
              to: "/categories",
            },
          ],
        },
        {
          title: "Brands",
          icon: <i className="fa-solid fa-table-cells-large" />,
          items: [
            {
              title: "Browse",
              to: "/brands",
            },
          ],
        },
        {
          title: "Products",
          icon: <i className="fa-brands fa-shopify" />,
          items: [
            {
              title: "Browse",
              to: "/products",
            },
          ],
        },
        {
          title: "Orders",
          icon: <i className="fa-brands fa-shopify" />,
          items: [
            {
              title: "Browse",
              to: "/orders",
            },
          ],
        },
        {
          title: "Coupons",
          icon: <i className="fa-regular fa-handshake" />,
          items: [
            {
              title: "Browse",
              to: "/coupons",
            },
          ],
        },
        {
          title: "Banners",
          icon: <i className="fa-solid fa-image" />,
          items: [
            {
              title: "Browse",
              to: "/banners",
            },
            {
              title: "Create",
              to: "/banners/create",
            },
          ],
        },
        {
          title: "Blog",
          icon: <i className="fa-regular fa-handshake" />,
          items: [
            {
              title: "Browse",
              to: "/blog",
            },
          ],
        },
      ],
    },
    {
      section: "Settings",
      description: "Edit your store settings",
      items: [
        {
          title: "Settings",
          to: "/settings",
          icon: <i className="fa-solid fa-gear" />,
        },
      ],
    },
  ];

  const doesItemIncludePath = (item) => {
    const paths = item.items.map((item) => item.to);
    return paths.includes(location.pathname);
  };

  return (
    <SidebarWrapper>
      <div className="header">
        <h1>DaySure ACP</h1>
        <p>{admin.name}</p>
      </div>

      <div className="content">
        {items.map((section, index) => (
          <div key={index} className="section">
            <span>{section.section}</span>
            <p>{section.description}</p>
            <ul>
              {section.items.map((item, index) =>
                item.items ? (
                  <SidebarMenu
                    key={index}
                    title={item.title}
                    items={item.items}
                    icon={item.icon}
                    close={closeSubmenus}
                    triggerClose={() => setCloseSubmenus(true)}
                    currentOpen={currentOpen}
                    setCurrentOpen={setCurrentOpen}
                    defaultOpen={() => doesItemIncludePath(item)}
                  />
                ) : (
                  <li
                    key={index}
                    className={location.pathname === item.to ? "active" : ""}
                    onClick={() => navigate(item.to)}
                  >
                    {item.icon}
                    {item.title}
                  </li>
                )
              )}
            </ul>
          </div>
        ))}
      </div>

      <LogoutButton onClick={logout}>Logout</LogoutButton>
    </SidebarWrapper>
  );
}

export default Sidebar;
