import React, { useContext, useEffect, useState } from "react";
import Page from "../components/Page";
import styled from "styled-components";
import AppContext from "../AppContext";
import { useHistory } from "react-router-dom";
import IconCheck from "../images/icon_check.svg";
import IconShop from "../images/icon_shop.svg";
import IconAcp from "../images/icon_acp.svg";
import IconFast from "../images/icon_fast.svg";
import IconSecure from "../images/icon_secure.svg";
import IconReliable from "../images/icon_reliable.svg";
import IconOptions from "../images/icon_options.svg";
import PrimaryButton from "../components/UI/PrimaryButton";

const ThreeColumns = styled.section`
  margin-bottom: 12rem;

  h2 {
    text-align: center;
    font-size: 30px;
    margin-bottom: 4rem;
  }

  article {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-row-gap: 6rem;
    grid-column-gap: 1rem;
    margin-bottom: 2rem;

    div {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      img {
        height: 100px;
        margin-bottom: 2rem;
      }

      h3 {
        margin-bottom: 0.25rem;
      }

      p {
        text-align: center;
      }
    }
  }
`;

const OneOneColumn = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 2rem;
  align-items: center;
  margin: 8rem 0 0;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-gap: 2rem;
    margin: 4rem 0 0;

    img {
      max-width: 400px;
      display: none;
    }
  }

  .right {
    text-align: left;
    display: flex;
    flex-direction: column;
    gap: 1.75rem;
    align-items: flex-start;

    @media (max-width: 768px) {
      &.mobile-top {
        grid-row-start: 1;
      }
    }

    h4 {
      font-size: 1.5rem;
      font-weight: 700;
    }

    p {
      line-height: 1.8;
    }
  }
`;

const ThreeTwoColumns = styled.section`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 1rem;
  margin-bottom: 12rem;
  margin-top: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }

  .left {
    background-image: linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%);

    padding: 4rem;
    display: flex;
    gap: 1rem;
    align-items: center;
    justify-content: space-evenly;

    h2 {
      font-size: 50px;
    }

    p {
    }

    ul {
      list-style-type: none;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      li {
        display: flex;
        gap: 0.5rem;
        align-items: center;

        img {
          width: 35px;
        }
      }
    }
  }

  .right {
    background-color: #8ec5fc;
    background-image: linear-gradient(62deg, #8ec5fc 0%, #e0c3fc 100%);
    padding: 4rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;

    h2 {
      text-align: center;
      margin-bottom: 1rem;
    }

    .flex {
      display: flex;
      flex-direction: column;

      gap: 1rem;
      align-items: center;

      img {
        width: 100px;
      }
    }
  }
`;

const PricingTableContainer = styled.article`
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

const PricingTable = styled.div`
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
  height: min-content;

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
      font-size: 40px;
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

export default function Sales() {
  const { setPlan, setUser, plans } = useContext(AppContext);
  const history = useHistory();

  return (
    <Page>
      <ThreeTwoColumns>
        <div className="left">
          <h2>
            Prisvenlig <br /> tidsbestilling
          </h2>
          <ul>
            <li>
              <img src={IconCheck} alt="checkmark" />
              <span>Opret dine services</span>
            </li>
            <li>
              <img src={IconCheck} alt="checkmark" />
              <span>Du får en kalender</span>
            </li>
            <li>
              <img src={IconCheck} alt="checkmark" />
              <span>Op til 10 butikker</span>
            </li>
            <li>
              <img src={IconCheck} alt="checkmark" />
              <span>Kunder får bekræftelse via email</span>
            </li>
          </ul>
        </div>
      </ThreeTwoColumns>

      <ThreeColumns>
        <h2>Dine Features</h2>
        <article>
          <div>
            <img src={IconShop} alt="shop" />
            <h3>Online Booking</h3>
            <p>Acceptér online bookinger</p>
          </div>
          <div>
            <img src={IconAcp} alt="acp" />
            <h3>Admin Kontrol Panel</h3>
            <p>Du får din egen admin kontrol panel</p>
          </div>
          <div>
            <img src={IconFast} alt="fast" />
            <h3>Hurtig Betjening</h3>
            <p>Siden indlæser og arbejder hurtigt</p>
          </div>
          <div>
            <img src={IconSecure} alt="secure" />
            <h3>Sikker Oplevelse</h3>
            <p>Dine dataer er sikre hos DaySure</p>
          </div>
          <div>
            <img src={IconReliable} alt="reliable" />
            <h3>Pålidelig Service</h3>
            <p>Arbejdsglæder bliver mere behagelig</p>
          </div>
          <div>
            <img src={IconOptions} alt="options" />
            <h3>Mange Muligheder</h3>
            <p>Der leveres en fuldstænding pakke</p>
          </div>
        </article>
      </ThreeColumns>

      <PricingTableContainer>
        {plans.map((_plan, index) => (
          <PricingTable key={index}>
            <div className="header">
              <h2>{_plan.title}</h2>
            </div>

            <div className="features">
              <ul>
                {_plan.tags.map((tag, index) => (
                  <li key={index}>{tag}</li>
                ))}
              </ul>
            </div>

            <div className="footer">
              {/*  <h4>
                kun <strike>{_plan.before} kr</strike>
              </h4>*/}
              <h3>{_plan.price} kr. / måned</h3>
              <PrimaryButton
                disabled={_plan.disabled}
                onClick={() => {
                  setPlan(_plan);
                  history.push("/new-account");
                }}
              >
                Prøv gratis
              </PrimaryButton>
              <p style={{ marginTop: "1rem" }}>Intet kreditkort nødvendig</p>
            </div>
          </PricingTable>
        ))}
      </PricingTableContainer>

      {/*      <OneOneColumn>
        <article>
          <img src={WordpressLongImage} alt="Wordpress logo"/>
        </article>
        <article className="right mobile-top">
          <h4>Fremragende hjemmesider, ét klik!</h4>
          <p>
            WordPress er et open source CMS, som er designet til at være en
            nemt at bruge og enkel at installere.
          </p>
          <PrimaryButton>Begynd Her</PrimaryButton>
        </article>
      </OneOneColumn>*/}
    </Page>
  );
}
