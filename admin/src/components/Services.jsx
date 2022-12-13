import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  background-color: var(--primary-light);
  padding: 1rem;
  margin-bottom: 1rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;

  article {
    border: 1px solid black;
    padding: 1rem;
    display: flex;
    gap: 0.25rem;
    flex-wrap: wrap;
    align-items: start;

    .service {
      border: 1px solid black;
      padding: 0.5rem;
      transition: all 0.3s ease-in-out;
      cursor: pointer;

      &:hover {
        background-color: var(--primary);
      }
    }
  }
`;

function Services({ services, onServicesChanged }) {
  const [selectedServices, setSelectedServices] = useState([]);
  const [usedServices, setUsedServices] = useState(services);

  useEffect(() => {
    if (selectedServices.length) {
      onServicesChanged(selectedServices);
    }
  }, [selectedServices]);

  const onServiceClick = (service, removeMode = false) => {
    if (removeMode) {
      setUsedServices([...usedServices, service]);
      setSelectedServices([
        ...selectedServices.filter((x) => x._id !== service._id),
      ]);
      return;
    }

    setUsedServices([...usedServices.filter((x) => x._id !== service._id)]);
    setSelectedServices([...selectedServices, service]);
    return;
  };

  return (
    <Container>
      <article>
        {usedServices.map((service, index) => (
          <div
            className="service"
            key={index}
            onClick={() => onServiceClick(service)}
          >
            <h3>{service.name}</h3>
            <h4>{service.minutes} mins</h4>
            <h5>{service.price} DKK</h5>
          </div>
        ))}
      </article>
      <article>
        {selectedServices.map((service, index) => (
          <div
            className="service"
            key={index}
            onClick={() => onServiceClick(service, true)}
          >
            <h3>{service.name}</h3>
            <h4>{service.minutes} mins</h4>
            <h5>{service.price} DKK</h5>
          </div>
        ))}
      </article>
    </Container>
  );
}

export default Services;
