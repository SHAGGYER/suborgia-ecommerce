import React, { useContext } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import AppContext from "../AppContext";
import LogoutButton from "./LogoutButton";
import moment from "moment";

const SidebarWrapper = styled.div`
  width: 300px;
  height: 100%;
  background-color: var(--primary);
  overflow-y: auto;
  display: flex;
  flex-direction: column;

  .header {
    display: flex;
    text-align: center;
    flex-direction: column;
    padding: 1rem;

    h1 {
      margin-bottom: 0.5rem;
      line-height: 1;
      font-family: "Anton", sans-serif;
    }
  }

  .content {
    flex: 1;
    padding: 1rem;

    ul {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        padding: 0.5rem;
        margin: 0.5rem 0;
        border-radius: 0.5rem;
        background-color: var(--primary-dark);
        font-size: 1.2rem;
        font-weight: bold;
        cursor: pointer;

        &:hover {
          background-color: var(--primary-light);
        }
      }
    }
  }
`;

function Sidebar(props) {
  const { user, logout, appSettings, isAdmin } = useContext(AppContext);

  const navigate = useNavigate();

  const getAmountDaysLeftOnTrial = () => {
    return moment(user.stripeSubscriptionCurrentPeriodEnd).diff(
      moment(),
      "days"
    );
  };

  return (
    <SidebarWrapper>
      <div className="header">
        <h1>DaySure</h1>
        <p>{user?.name}</p>
        {user.isTrialing && (
          <p>Afprøvelse ({getAmountDaysLeftOnTrial()} dage tilbage)</p>
        )}
        {isAdmin && <p>VIA ADMIN</p>}
      </div>

      <div className="content">
        <ul>
          <li onClick={() => navigate("/")}>Dashboard</li>
          <li onClick={() => navigate("/live-feed")}>Live Feed</li>
          <li onClick={() => navigate("/purchases")}>Betalinger</li>
          <li onClick={() => navigate("/products")}>Produkter</li>
          <li onClick={() => navigate("/settings")}>Indstillinger</li>
          <li onClick={() => navigate("/help-center")}>Help Center</li>
          {appSettings?.appEnv === "production" && (
            <>
              <li onClick={() => navigate("/subscription")}>Abonnement</li>
              <li onClick={() => navigate("/update-card")}>
                Opdater Kreditkort
              </li>
            </>
          )}
        </ul>
      </div>

      <LogoutButton onClick={logout}>Logout</LogoutButton>
    </SidebarWrapper>
  );
}

export default Sidebar;
