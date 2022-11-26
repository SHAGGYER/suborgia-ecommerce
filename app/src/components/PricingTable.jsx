import React, { useContext, useEffect } from "react";
import IconCheck from "../images/icon_check.svg";
import PrimaryButton from "./UI/PrimaryButton";
import { ClipLoader } from "react-spinners";
import styled from "styled-components";
import AppContext from "../AppContext";

const PricingTableContainer = styled.section`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(3, 1fr);
  margin-top: 2rem;
  justify-content: center;
  align-items: center;
  padding-bottom: 3rem;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 768px) {
    grid-template-columns: 350px;
  }

  @media (max-width: 350px) {
    grid-template-columns: 1fr;
  }
`;

const PricingTableElement = styled.div`
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
  height: min-content;
  background-color: white;
  position: relative;

  img {
    width: 50px;
    position: absolute;
    top: -20px;
    right: -5px;
  }

  .header {
    border-bottom: 5px solid #e5e7eb;
    padding: 2rem;
    display: flex;
    justify-content: center;
    text-align: center;
  }

  .features {
    ul {
      list-style: none;

      li {
        padding: 1rem;
        border-bottom: 1px solid #e5e7eb;
        text-align: center;
      }
    }
  }

  .footer {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    padding: 3rem;

    h3 {
      font-size: 20px;
      font-family: "Anton", sans-serif;
      margin-bottom: 1rem;

      @media (max-width: 768px) {
        font-size: 30px;
      }
    }

    h4 {
      font-size: 22px;
    }
  }

  &.big {
    width: 400px;
    position: relative;
    right: 10px;
    z-index: 99;
    background-color: white;

    .header {
      padding: 3rem;
    }
  }
`;

function PricingTable({ onClick, btnText, noUserComparison }) {
  const { plans, user } = useContext(AppContext);
  const [loading, setLoading] = React.useState(false);
  const [chosenPlan, setChosenPlan] = React.useState(null);

  useEffect(() => {
    if (user) {
      const plan = plans.find((plan) => plan._id === user.planId);
      setChosenPlan(plan);
    }
  }, [user]);

  const handleClickPlan = async (plan) => {
    setLoading(true);
    await onClick(plan);
    setChosenPlan(plan);
    setLoading(false);
  };

  return (
    <PricingTableContainer>
      {plans.map((_plan, index) => (
        <PricingTableElement key={index}>
          {!noUserComparison
            ? user?.planId === _plan._id && <img src={IconCheck} alt="Check" />
            : chosenPlan?._id === _plan._id && (
                <img src={IconCheck} alt="Check" />
              )}
          <div className="header">
            <h2>{_plan.title}</h2>
          </div>

          <div className="features">
            <ul>
              <li>{_plan.amountShops} butikker</li>
              {_plan.tags.map((tag, index) => (
                <li key={index}>{tag}</li>
              ))}
            </ul>
          </div>

          <div className="footer">
            <h3>{_plan.price} kr. / måned</h3>
            {!noUserComparison ? (
              <PrimaryButton
                disabled={
                  loading || _plan.disabled || chosenPlan?._id === _plan._id
                }
                onClick={() => handleClickPlan(_plan)}
              >
                <ClipLoader loading={loading} size={20} />
                {btnText}
              </PrimaryButton>
            ) : (
              <PrimaryButton
                disabled={loading || _plan.disabled}
                onClick={() => handleClickPlan(_plan)}
              >
                <ClipLoader loading={loading} size={20} />
                {btnText}
              </PrimaryButton>
            )}
          </div>
        </PricingTableElement>
      ))}
    </PricingTableContainer>
  );
}

export default PricingTable;
