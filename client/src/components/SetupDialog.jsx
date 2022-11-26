import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { Form } from "./UI/Form";
import { UI } from "./UI/UI";
import { Stepper, Step } from "react-form-stepper";
import HttpClient from "../services/HttpClient";
import { useDialog } from "react-st-modal";
import cogoToast from "cogo-toast";

const Wrapper = styled.div`
  background-color: var(--primary-light);
  padding: 1rem;
  position: relative;

  .toggler {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 20px;
    cursor: pointer;
  }

  h2 {
    margin: 0;
    margin-bottom: 1rem;
    font-size: 40px;
  }
`;

const ACTIVITY_LEVELS_FORMULA = {
  male: {
    SEDENTARY: 1.2,
    LIGHT: 1.375,
    MODERATE: 1.55,
    VERY_ACTIVE: 1.725,
    EXTREMELY_ACTIVE: 1.9,
  },
  female: {
    SEDENTARY: 1.1,
    LIGHT: 1.275,
    MODERATE: 1.35,
    VERY_ACTIVE: 1.525,
    EXTREMELY_ACTIVE: 1.725,
  },
};

const ACTIVITY_LEVELS = {
  SEDENTARY: "Sedentary (office job)",
  LIGHT: "Little Active (1-3 times a week)",
  MODERATE: "Active (3-5 times a week)",
  VERY_ACTIVE: "Very Active (6-7 times a week)",
  EXTREMELY_ACTIVE: "Extremely Active (twice a day)",
};

export default function SetupDialog({ setUser, user, withRegister }) {
  const dialog = useDialog();
  const [currentStep, setCurrentStep] = useState(0);
  const [tdee, setTdee] = useState(null);
  const [height, setHeight] = useState(user?.height ? user.height : "");
  const [weight, setWeight] = useState(user?.weight ? user.weight : "");
  const [age, setAge] = useState(user?.age ? user.age : "");
  const [gender, setGender] = useState(user?.gender ? user.gender : "");
  const [activityLevel, setActivityLevel] = useState(
    user?.activityLevel ? user.activityLevel : ""
  );
  const [targetWeight, setTargetWeight] = useState(
    user?.targetWeight ? user.targetWeight : ""
  );
  const [goal, setGoal] = useState(user?.goal ? user.goal : "");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [error, setError] = useState({});

  const register = async () => {
    try {
      const body = {
        email,
        password,
        passwordAgain,
      };

      const { data } = await HttpClient().post("/api/auth/register", body);
      localStorage.setItem("token", data.token);
      cogoToast.success("Du har nu registreret dig");
      await save();
      dialog.close();
      window.location.href = "/journal";
    } catch (e) {
      if (e.response && e.response.status === 403) {
        setError(e.response.data.errors);
      }
    }
  };

  useEffect(() => {
    if (currentStep === 2) {
      calculate();
    }
  }, [currentStep]);

  const calculate = () => {
    const parsedHeight = parseFloat(height);
    const parsedWeight = parseFloat(weight);
    const parsedAge = parseFloat(age);

    let formula;
    if (gender === "male") {
      formula =
        parsedHeight * 6.25 + parsedWeight * 9.99 - parsedAge * 4.92 + 5;
      formula = ACTIVITY_LEVELS_FORMULA.male[activityLevel] * formula;
    } else {
      formula =
        parsedHeight * 6.25 + parsedWeight * 9.99 - parsedAge * 4.92 - 161;
      formula = ACTIVITY_LEVELS_FORMULA.female[activityLevel] * formula;
    }

    setTdee(formula);
  };

  const save = async () => {
    const { data } = await HttpClient().post("/api/user/finish-setup", {
      kcal: tdee,
      weight,
      targetWeight,
      gender,
      height,
      age,
      goal,
      activityLevel,
    });

    dialog.close(true);

    if (!withRegister) {
      setUser(data.user);
    }
  };

  return (
    <Wrapper>
      <i className="fas fa-times toggler" onClick={() => dialog.close()} />
      <Stepper activeStep={currentStep}>
        <Step label="Basics" />
        <Step label="TDEE" />
        <Step label="Mål" />
        <Step label="Opsummering" />
        {withRegister && <Step label="Konto" />}
      </Stepper>

      <UI.Spacer bottom={1} />

      {currentStep === 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Form.TextField
            value={age}
            onChange={(e) => setAge(e.target.value)}
            label="Alder"
          />

          <Form.Select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            label="Køn"
          >
            <option value="">Vælg Køn</option>
            <option value="male">Mand</option>
            <option value="female">Kvinde</option>
          </Form.Select>

          <div>
            <UI.Button success onClick={() => setCurrentStep(currentStep + 1)}>
              Næste
            </UI.Button>
          </div>
        </div>
      )}

      {currentStep === 1 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Form.TextField
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            label="Højde"
          />

          <Form.TextField
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            label="Vægt"
          />

          <Form.Select
            label="Aktivitetsniveau"
            value={activityLevel}
            onChange={(e) => setActivityLevel(e.target.value)}
          >
            <option value="">Vælg aktivitetsniveau</option>
            {Object.keys(ACTIVITY_LEVELS).map((key, index) => (
              <option key={index} value={key}>
                {ACTIVITY_LEVELS[key]}
              </option>
            ))}
          </Form.Select>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <UI.Button success onClick={() => setCurrentStep(currentStep + 1)}>
              Næste
            </UI.Button>
            <UI.Button error onClick={() => setCurrentStep(currentStep - 1)}>
              Forrige
            </UI.Button>
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Form.Select
            label="Dit Mål"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          >
            <option value="">Vælg dit mål</option>
            <option value="weight-loss">Vægttab</option>
            <option value="weight-gain">Tage På</option>
            <option value="healthy-life">Sundt Livsstil</option>
          </Form.Select>

          {(goal === "weight-loss" || goal === "weight-gain") && (
            <Form.TextField
              value={targetWeight}
              onChange={(e) => setTargetWeight(e.target.value)}
              label="Målvægt"
            />
          )}

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <UI.Button success onClick={() => setCurrentStep(currentStep + 1)}>
              Næste
            </UI.Button>
            <UI.Button error onClick={() => setCurrentStep(currentStep - 1)}>
              Forrige
            </UI.Button>
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {goal === "healthy-life" && (
            <p>Vedligholdelse: {parseInt(tdee)} kcal</p>
          )}
          {goal === "weight-loss" && (
            <>
              <p>
                For at <b>tabe dig</b>, skal du spise følgende antal kalorier
                per dag (ca.)
              </p>
              <p>
                <b>{parseInt(tdee) - 500}</b> kcal
              </p>
            </>
          )}

          {goal === "weight-gain" && (
            <p>Øge Vægt: {parseInt(tdee) + 200} kcal</p>
          )}

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <UI.Button
              success
              onClick={
                !withRegister
                  ? () => save()
                  : () => setCurrentStep(currentStep + 1)
              }
            >
              {withRegister ? "Næste" : "Gem"}
            </UI.Button>
            <UI.Button error onClick={() => setCurrentStep(currentStep - 1)}>
              Forrige
            </UI.Button>
          </div>
        </div>
      )}

      {currentStep === 4 && withRegister && (
        <div>
          <Form.TextField
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label={"Email"}
            error={error.email}
          />
          <UI.Spacer bottom={1} />
          <Form.TextField
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            label={"Password"}
            error={error.password}
          />
          <UI.Spacer bottom={1} />
          <Form.TextField
            value={passwordAgain}
            onChange={(e) => setPasswordAgain(e.target.value)}
            type="password"
            label={"Password Again"}
            error={error.passwordAgain}
          />
          <UI.Spacer bottom={1} />

          <UI.Button success onClick={register}>
            Register
          </UI.Button>
        </div>
      )}
    </Wrapper>
  );
}
