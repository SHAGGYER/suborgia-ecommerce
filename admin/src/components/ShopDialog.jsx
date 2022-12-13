import React, { useState } from "react";
import styled from "styled-components";
import HttpClient from "../services/HttpClient";
import { Form } from "./UI/Form";
import PrimaryButton from "./UI/PrimaryButton";
import { UI } from "./UI/UI";
import { useDialog } from "react-st-modal";
import cogoToast from "cogo-toast";
import slugify from "slugify";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import GoogleMapReact from "google-map-react";
import FloatingTextField from "./FloatingTextField";

const AnyReactComponent = ({ text }) => (
  <div
    style={{
      color: "white",
      background: "grey",
      padding: "15px 10px",
      display: "inline-flex",
      textAlign: "center",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "100%",
      transform: "translate(-50%, -50%)",
    }}
  >
    {text}
  </div>
);

const Wrapper = styled.div`
  background-color: var(--primary);
  padding: 2rem;

  h2 {
    margin: 0;
    margin-bottom: 1rem;
    font-size: 40px;
  }
`;

export default function ShopDialog({ shop }) {
  const dialog = useDialog();
  const [usedShop, setUsedShop] = useState(
    shop || {
      slug: "",
      name: "",
      city: "",
      address: "",
      zip: "",
      phone: "",
    }
  );
  const [shopError, setShopError] = useState({});
  const [latLng, setLatLng] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!shop) {
        const { data } = await HttpClient().post("/api/shop", usedShop);

        cogoToast.success("Shop oprettet");
        dialog.close(data.shop);
      } else {
        await HttpClient().put("/api/shop/" + shop._id, usedShop);

        cogoToast.success("Shop opdateret");
        dialog.close(true);
      }
    } catch (error) {
      if (error.response) {
        setShopError(error.response.data.errors);
      }
    }
  };

  const autocompletionRequest = {
    componentRestrictions: {
      country: "dk",
    },
    types: ["address"],
  };

  const chooseCity = async (event) => {
    setLatLng(null);
    const address =
      event.value.terms.length > 3
        ? event.value.terms[0].value + " " + event.value.terms[1].value
        : event.value.terms[0].value;

    const results = await geocodeByAddress(event.value.description);
    const { long_name: postalCode = "" } =
      results[0].address_components.find((c) =>
        c.types.includes("postal_code")
      ) || {};

    const { long_name: city = "" } =
      results[0].address_components.find((c) => c.types.includes("locality")) ||
      {};

    const latLng = await getLatLng(results[0]);
    setLatLng({
      latitude: latLng.lat,
      longitude: latLng.lng,
    });

    setShopError({ ...shopError, address: null, city: null, zip: null });

    setUsedShop({
      ...usedShop,
      address,
      city,
      latitude: latLng.lat,
      longitude: latLng.lng,
      zip: postalCode,
    });
  };

  const handleChangeDetails = (prop, event) => {
    const _shop = { ...usedShop };
    _shop[prop] = event.target.value;
    if (prop === "name") {
      _shop.slug = slugify(_shop.name);
    }

    if (prop === "zip") {
      const regex = /^\d{4}$/;
      if (!regex.test(event.target.value)) {
        setShopError({ ...shopError, zip: "Postnummer skal være 4 cifre" });
      } else {
        setShopError({});
      }
    }

    if (prop === "phone") {
      const regex = /^\d{8}$/;
      if (!regex.test(event.target.value)) {
        setShopError({ ...shopError, phone: "Telefon skal være 8 cifre" });
      } else {
        setShopError({});
      }
    }

    setUsedShop(_shop);
  };

  const isSubmitDisabled = () => {
    return Object.values(shopError).some((x) => x !== null);
  };

  return (
    <Wrapper>
      <h2>Opret Shop</h2>

      <form onSubmit={onSubmit}>
        <FloatingTextField
          value={usedShop.name}
          onChange={(e) => handleChangeDetails("name", e)}
          label={"Shoppens Navn"}
          error={shopError.name}
        />
        <UI.Spacer bottom={1} />

        <FloatingTextField
          readOnly
          label={"URL"}
          value={`https://daysure.dk/${slugify(usedShop.name, {
            lower: true,
          })}`}
        />
        <UI.Spacer bottom={1} />

        {!usedShop.address ? (
          <div style={{ background: "var(--primary-light)", padding: "1rem" }}>
            <GooglePlacesAutocomplete
              autocompletionRequest={autocompletionRequest}
              selectProps={{
                className: "w-full",
                onChange: chooseCity,
                placeholder: "Adresse...",
                loadingMessage: () => {
                  return "Vent venligst...";
                },
                styles: {
                  control: (base) => ({
                    ...base,
                    border: "1px solid var(--primary)",
                    borderRadius: 0,
                  }),
                },
                noOptionsMessage: () => "Ingen resultater...",
              }}
            />
            {shopError.address && (
              <p style={{ color: "red" }}>{shopError.address}</p>
            )}
          </div>
        ) : (
          <>
            <PrimaryButton
              type="button"
              onClick={() => {
                setUsedShop({ ...usedShop, address: null });
              }}
            >
              Vælg adresse igen
            </PrimaryButton>
            <UI.Spacer bottom={1} />
            <FloatingTextField
              readOnly
              label="Adresse"
              value={usedShop.address}
            />
          </>
        )}
        <UI.Spacer bottom={1} />

        {latLng && (
          <div style={{ height: 300, width: "100%" }}>
            <GoogleMapReact
              bootstrapURLKeys={{ key: import.meta.env.VITE_GOOGLE_API_KEY }}
              defaultCenter={{
                lat: latLng.latitude,
                lng: latLng.longitude,
              }}
              defaultZoom={15}
            >
              <AnyReactComponent
                lat={latLng.latitude}
                lng={latLng.longitude}
                text={"Her"}
              />
            </GoogleMapReact>
          </div>
        )}
        <UI.Spacer bottom={1} />

        <FloatingTextField
          label="Postnr."
          error={shopError.zip}
          value={usedShop.zip}
          readOnly
        />
        <UI.Spacer bottom={1} />

        <FloatingTextField
          label="By"
          error={shopError.city}
          value={usedShop.city}
          readOnly
        />
        <UI.Spacer bottom={1} />

        <FloatingTextField
          label="Telefon"
          error={shopError.phone}
          value={usedShop.phone}
          onChange={(e) => handleChangeDetails("phone", e)}
        />
        <UI.Spacer bottom={1} />

        <PrimaryButton disabled={isSubmitDisabled()} type="submit">
          {shop ? "Gem" : "Opret"}
        </PrimaryButton>
      </form>
    </Wrapper>
  );
}
