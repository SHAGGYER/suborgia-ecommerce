import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import AppContext from "../AppContext";
import HttpClient from "../services/HttpClient";
import cogoToast from "cogo-toast";
import { ClipLoader } from "react-spinners";
import { Form } from "../components/UI/Form";
import PrimaryButton from "../components/UI/PrimaryButton";
import { Confirm, CustomDialog } from "react-st-modal";
import ShopDialog from "../components/ShopDialog";
import { UI } from "../components/UI/UI";
import queryString from "query-string";
import { useNavigate, useLocation } from "react-router-dom";
import { Alert } from "../components/UI/Alert";
import IconArrowDown from "../images/icon_arrow_down.svg";
import IconArrowUp from "../images/icon_arrow_up.svg";
import IconTimes from "../images/icon_times.svg";
import Calendar from "../components/Calendar";
import moment from "moment";
import OpeningHours from "../components/OpeningHours";
import { Alert as AlertDialog } from "react-st-modal";

const Shop = styled.article`
  display: flex;
  flex-direction: column;
  background-color: rgba(233, 223, 228, 0.48);
  padding: 1rem;

  h3 {
    margin-bottom: 1rem;
  }
`;

const ShopContainer = styled.section`
  background-color: var(--primary-dark);
  padding: 1rem;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 1rem;

  select {
    padding: 1rem;
    width: 300px;
  }

  ${Shop} {
    width: 300px;
  }
`;

const PlanContainer = styled.section`
  display: grid;
  grid-template-columns: 1fr;
  grid-column-gap: 10px;
  grid-row-gap: 10px;
  max-width: 800px;
  margin-bottom: 1rem;
`;

const Plan = styled.div`
  display: flex;
  gap: 0.25rem;

  > div {
    background-color: var(--primary-dark);
    padding: 1rem;
    height: 100%;

    &.full-width {
      width: 100%;
    }

    table {
      border-collapse: collapse;
      width: 100%;
      margin-bottom: 1rem;

      td {
        padding: 1rem;
        border: 1px solid black;
        background-color: #fff;

        input {
          padding: 0.5rem;
          width: 100%;
        }
      }

      .w-50 {
        width: 50px;
      }

      .w-100px {
        width: 100px;
      }
    }
  }

  a {
    color: var(--red);
    display: block;
    margin-top: 1rem;
  }

  h2 {
    font-family: "Anton", sans-serif;
    font-size: 25px;
    margin-bottom: 0.5rem;
  }

  h4 {
    font-size: 20px;
    margin-bottom: 0;
  }

  p {
    margin-bottom: 0.5rem;
  }

  button {
    background-color: var(--primary-light);
    border: none;
    padding: 0.5rem 1rem;
    font-size: 18px;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;

    :disabled {
      cursor: not-allowed;
      color: black;
    }
  }

  &.column {
    flex-direction: column;
    gap: 10px;
  }
`;

function Dashboard(props) {
  const { user, plans, socket } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [shops, setShops] = useState([]);
  const [services, setServices] = useState([]);
  const [shop, setShop] = useState(null);
  const [selectedShopId, setSelectedShopId] = useState(null);
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    getShops();
    const plan = plans.find((x) => x._id === user.planId);
    setPlan(plan);
  }, []);

  useEffect(() => {
    if (shops.length) {
      if (shops.length === 1) {
        setSelectedShopId(shops[0]._id);
        setShop(shops[0]);
        getServicesForShop(shops[0]._id);
      }
    }
  }, [shops]);

  const openShopDialog = async () => {
    const result = await CustomDialog(<ShopDialog shop={shop} />);
    if (result) {
      getShops();
    }
  };

  const openCalendarDialog = async () => {
    if (!services.length || !shop.startTime || !shop.endTime) {
      return await AlertDialog(
        "Du skal oprette en service og angive åbningstider før du kan åbne kalenderen.",
        "Information"
      );
    }

    await CustomDialog(
      <Calendar shop={shop} services={services} socket={socket} />,
      {
        defaultBodyOverflow: "hidden",
        className: "calendar-dialog",
      }
    );
  };

  const getShops = async () => {
    try {
      const { data } = await HttpClient().get("/api/shop/by-user-id");
      setShops(data.shops);
    } catch (e) {
      setSelectedShopId(null);
      setShop(null);
      setShops([]);
    }
  };

  const getServicesForShop = async (shopId) => {
    const response = await HttpClient().get("/api/shop/services/" + shopId);
    setServices(response.data.services);
  };

  const openCreateShopDialog = async () => {
    const result = await CustomDialog(<ShopDialog />);
    if (result) {
      await getShops();
      setSelectedShopId(result._id);
      setShop(result);
    }
  };

  const addService = () => {
    setServices([
      ...services,
      {
        name: "",
        price: "",
        minutes: "",
      },
    ]);
  };

  const handleChangeNewService = (prop, index, event) => {
    const newServices = [...services];
    newServices[index][prop] = event.target.value;
    setServices(newServices);
  };

  const handleMoveService = (index, direction) => {
    const newServices = [...services];
    const [removed] = newServices.splice(index, 1);
    if (direction === "up") {
      removed.position = index - 1;
      newServices.splice(index - 1, 0, removed);
    } else {
      removed.position = index + 1;
      newServices.splice(index + 1, 0, removed);
    }
    setServices(newServices);
  };

  async function handleDeleteService(index) {
    if (services[index]._id) {
      await HttpClient().delete("/api/shop/services/" + services[index]._id);
    }

    const newServices = [...services];
    newServices.splice(index, 1);
    setServices(newServices);
  }

  const saveServices = async () => {
    setLoading(true);
    const { data } = await HttpClient().post("/api/shop/services/" + shop._id, {
      services: services.map((service, index) => {
        return {
          ...service,
          position: index,
        };
      }),
    });
    setLoading(false);
    setServices(data.services);
    cogoToast.success("Services gemt");
  };

  const handleChangeShop = async (event) => {
    const shopId = event.target.value;
    setSelectedShopId(shopId);

    if (shopId) {
      const shop = shops.find((x) => x._id === shopId);
      setShop(shop);
      await updateLastSelectedShopId(shop);
      await getServicesForShop(shop._id);
    } else {
      setShop(null);
    }
  };

  const updateLastSelectedShopId = async (shop) => {
    await HttpClient().post("/api/shop/change-last-selected-shop-id", {
      shopId: shop._id,
    });
  };

  const deleteShop = async () => {
    const result = await Confirm(
      "Er du sikker på at du vil slette butikken?",
      "Slet butik",
      "Ja, slet",
      "Nej"
    );
    if (!result) {
      return;
    }

    setLoading(true);
    await HttpClient().delete("/api/shop/" + shop._id);
    cogoToast.success("Butikken er slettet");
    await getShops();
    setShop(null);
    setSelectedShopId(null);
    setLoading(false);
  };

  const hasSubscription = () => {
    return (
      user.stripeSubscriptionStatus === "active" ||
      user.stripeSubscriptionStatus === "trialing" ||
      moment().isBefore(user.stripeSubscriptionCurrentPeriodEnd)
    );
  };

  const canCreateShop = () => {
    return shops.length < 1;
  };

  return (
    <>
      {hasSubscription() ? (
        <>
          <ShopContainer>
            {(shops.length < plan?.amountShops ||
              (hasSubscription() && canCreateShop())) && (
              <PrimaryButton onClick={openCreateShopDialog}>
                Opret Shop
              </PrimaryButton>
            )}
            {!!shops.length && (
              <Form.Select
                value={selectedShopId || ""}
                label="Valgt Shop"
                onChange={handleChangeShop}
              >
                <option value="">Vælg én</option>
                {shops
                  .filter((x, i) => i < plan?.amountShops || hasSubscription())
                  .map((shop, index) => {
                    return (
                      <option key={index} value={shop._id}>
                        {shop.name}
                      </option>
                    );
                  })}
              </Form.Select>
            )}
          </ShopContainer>
          <UI.Spacer bottom={1} />
          {!!shop && (
            <>
              <PlanContainer>
                <Plan className="div1 column">
                  <div className={"full-width"}>
                    <h2>{shop.name}</h2>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <PrimaryButton onClick={openCalendarDialog}>
                        Se Kalender
                      </PrimaryButton>
                      <PrimaryButton
                        onClick={() =>
                          window.open(
                            import.meta.env.VITE_CLIENT_URL + "/" + shop.slug,
                            "_blank"
                          )
                        }
                      >
                        Besøg Butik
                      </PrimaryButton>
                      <PrimaryButton onClick={openShopDialog}>
                        Redigér Butik
                      </PrimaryButton>
                    </div>
                    <table>
                      <tbody>
                        <tr>
                          <td>Adresse</td>
                          <td>{shop.address}</td>
                        </tr>
                        <tr>
                          <td>By</td>
                          <td>{shop.city}</td>
                        </tr>
                        <tr>
                          <td>Postnummer</td>
                          <td>{shop.zip}</td>
                        </tr>

                        <tr>
                          <td>Telefon</td>
                          <td>{shop.phone}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Plan>
              </PlanContainer>
              <UI.Spacer bottom={1} />
              <PlanContainer>
                <Plan>
                  <OpeningHours setShop={setShop} shop={shop} />
                </Plan>
              </PlanContainer>
              <UI.Spacer bottom={1} />
              <PlanContainer>
                <Plan>
                  <div className="full-width">
                    <h2>Services</h2>
                    <PrimaryButton onClick={addService}>
                      Tilføj Service
                    </PrimaryButton>
                    {!!services.length && (
                      <>
                        <table>
                          <thead>
                            <tr>
                              <td>Service</td>
                              <td>Pris</td>
                              <td>Minutter</td>
                              <td>Flyt</td>
                              <td>Slet</td>
                            </tr>
                          </thead>
                          <tbody>
                            {services
                              .sort((a, b) => {
                                return a.position - b.position;
                              })
                              .map((service, index) => (
                                <tr key={index}>
                                  <td>
                                    <input
                                      value={service.name}
                                      onChange={(event) =>
                                        handleChangeNewService(
                                          "name",
                                          index,
                                          event
                                        )
                                      }
                                    />
                                  </td>
                                  <td className="w-100px">
                                    <input
                                      type="number"
                                      value={service.price}
                                      onChange={(event) =>
                                        handleChangeNewService(
                                          "price",
                                          index,
                                          event
                                        )
                                      }
                                    />
                                  </td>
                                  <td className="w-100px">
                                    <input
                                      type={"number"}
                                      value={service.minutes}
                                      onChange={(event) =>
                                        handleChangeNewService(
                                          "minutes",
                                          index,
                                          event
                                        )
                                      }
                                    />
                                  </td>
                                  <td className="w-50">
                                    <div
                                      style={{
                                        display: "flex",
                                        gap: "0.5rem",
                                        alignItems: "center",
                                      }}
                                    >
                                      {index > 0 && (
                                        <img
                                          style={{ width: 15 }}
                                          src={IconArrowUp}
                                          alt="up"
                                          onClick={() =>
                                            handleMoveService(index, "up")
                                          }
                                        />
                                      )}
                                      {index < services.length - 1 && (
                                        <img
                                          style={{ width: 15 }}
                                          src={IconArrowDown}
                                          alt="down"
                                          onClick={() =>
                                            handleMoveService(index, "down")
                                          }
                                        />
                                      )}
                                    </div>
                                  </td>
                                  <td className="w-50">
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                      }}
                                    >
                                      <img
                                        style={{ width: 15 }}
                                        src={IconTimes}
                                        alt="trash"
                                        onClick={() =>
                                          handleDeleteService(index)
                                        }
                                      />
                                    </div>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>

                        <PrimaryButton onClick={saveServices}>
                          <ClipLoader loading={loading} size={15} />
                          Gem
                        </PrimaryButton>
                      </>
                    )}
                  </div>
                </Plan>
              </PlanContainer>
              <PrimaryButton onClick={deleteShop}>
                <ClipLoader loading={loading} size={15} />
                Slet
              </PrimaryButton>
            </>
          )}
        </>
      ) : (
        <Alert error style={{ maxWidth: 800, padding: "2rem" }}>
          <h2>OBS!</h2>
          <UI.Spacer bottom={1} />
          <p>Du har ikke et aktivt abonnement.</p>
        </Alert>
      )}
    </>
  );
}

export default Dashboard;
