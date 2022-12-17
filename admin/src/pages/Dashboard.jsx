import React from "react";
import Page from "../components/Page";
import ProgressTimeline from "../components/ProgressTimeline";
import Coupons from "./Coupons";
import styled from "styled-components";
import CreateProduct from "./CreateProduct";
import HelpCreateCategory from "../components/Help/HelpCreateCategory";
import AppContext from "../AppContext";
import HelpCreateProduct from "../components/Help/HelpCreateProduct";
import HelpCreateCoupon from "../components/Help/HelpCreateCoupon";
import HelpWelcome from "../components/Help/HelpWelcome";
import HelpFinish from "../components/Help/HelpFinish";

const DashboardStyled = styled.div`
  display: grid;
  height: 100%;
  grid-template-columns: 500px 1fr;
  gap: 2rem;

  .timeline {
    padding: 1rem;
    height: 100%;
    overflow-y: auto;
  }

  .content {
    border: 1px solid #e2e8f0;
    height: 100%;
    overflow-y: auto;
    padding: 1rem;
  }
`;

const items = [
  {
    title: "Welcome to the dashboard",
    description:
      "This is the dashboard. Here you can manage your store. You can create categories, products, coupons and more.",
    component: <HelpWelcome />,
  },
  {
    title: "Create a category",
    component: <HelpCreateCategory />,
    description: "First you will need to create your first category.",
  },
  {
    title: "Create a product",
    component: <HelpCreateProduct />,
    description: "Then you will need to create your first product.",
  },
  {
    title: "Create a coupon",
    component: <HelpCreateCoupon />,
    description: "Now you can create your first coupon.",
  },
  {
    title: "Finish",
    description: "You are all set. You can now start selling your products.",
    component: <HelpFinish />,
  },
];

export default function Dashboard() {
  const { currentHelp, setCurrentHelp } = React.useContext(AppContext);
  console.log(currentHelp);

  const [component, setComponent] = React.useState(
    items[currentHelp].component
  );
  return (
    <>
      <DashboardStyled>
        <div className="timeline">
          <ProgressTimeline
            items={items}
            selected={currentHelp}
            setSelected={setCurrentHelp}
            onChange={(index) => {
              setComponent(items[index].component);
            }}
          />
        </div>
        <div className="content">{component}</div>
      </DashboardStyled>
    </>
  );
}
