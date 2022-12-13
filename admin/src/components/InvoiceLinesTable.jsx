import React from "react";
import { getTotal } from "../pages/Purchases";
import PrimaryButton from "./UI/PrimaryButton";
import styled from "styled-components";

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  border: 1px solid black;
  margin-top: 1rem;

  thead {
    td {
      font-weight: bold;
      padding: 1rem;
      border: 1px solid black;
    }
  }

  tbody {
    td {
      padding: 1rem;
      border: 1px solid black;
    }
  }

  tfoot {
    td {
      padding: 1rem;
      border: 1px solid black;
    }
  }
`;

function InvoiceLinesTable({ lines, setLines, editable }) {
  const getLineTotal = (line) => {
    let total = 0;

    total += line.quantity * line.sellPrice;

    if (isNaN(total)) return 0;

    return total;
  };
  const removeLine = (index) => {
    const _lines = [...lines];
    _lines.splice(index, 1);
    setLines(_lines);
  };

  const handleChangeLine = (prop, value, index) => {
    const _lines = [...lines];
    _lines[index][prop] = value;
    setLines(_lines);
  };
  return (
    <Table className="border-collapse border border-gray-300 p-4 mt-4 w-full">
      <thead>
        <tr>
          <td className="p-4 font-bold">Produkt</td>
          <td className="p-4 font-bold">Salgspris</td>
          <td className="p-4 font-bold">Antal</td>
          <td className="p-4 font-bold">Total</td>
          {editable && <td className="p-4 font-bold">Action</td>}
        </tr>
      </thead>
      <tbody>
        {lines.map((line, index) => (
          <tr className="border border-gray-300" key={index}>
            <td className="p-4">{line.product?.title}</td>
            <td className="p-4">
              {line.isDiscount && line.computationStyle === "percentage" ? (
                <span>{line.sellPrice}%</span>
              ) : (
                line.sellPrice.toFixed(2)
              )}
            </td>
            <td className="p-4">
              {editable ? (
                <input
                  type="text"
                  className="p-2 border border-gray-300 w-16"
                  value={line.quantity}
                  onChange={(e) =>
                    handleChangeLine("quantity", e.target.value, index)
                  }
                />
              ) : (
                line.quantity
              )}
            </td>
            <td className="p-4">{getLineTotal(line).toFixed(2)}</td>
            {editable && (
              <td className="p-4">
                <PrimaryButton type="button" onClick={() => removeLine(index)}>
                  Delete
                </PrimaryButton>
              </td>
            )}
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan={editable ? 4 : 3}></td>
          <td className="p-4" colSpan={1}>
            <span>Total: {getTotal(lines).toFixed(2)}</span>
          </td>
        </tr>
      </tfoot>
    </Table>
  );
}

export default InvoiceLinesTable;
