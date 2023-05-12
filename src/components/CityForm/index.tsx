import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button, Classes } from "@blueprintjs/core";
import type { SubmitHandler } from "react-hook-form";
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form";
import styled from "styled-components";
import { format } from "date-fns";

import type { City } from "../../api/cities";
import CitySelectList from "../CitySelectList";
import DateInput from "../DateInput";
import IntegerInput from "../IntegerInput";
import useCitySearchParams from "../../hooks/useCitySearchParams";

const CityFormContainer = styled.div`
  display: flex;
  flex: 1;
  .city-form {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    .city-form-fields {
      display: flex;
      flex: 1;
      flex-direction: column;
      .${Classes.INPUT} {
        border-radius: 6px;
      }
      .${Classes.FORM_HELPER_TEXT} {
        color: red;
        text-align: left;
      }
      .${Classes.INTENT_DANGER} {
        .${Classes.INPUT} {
          border: 1px solid red;
        }
        .${Classes.FORM_HELPER_TEXT} {
          color: red;
        }
      }

      @media (min-width: 768px) {
        flex-direction: row;
      }
    }
    .btn-submit {
      margin-top: 2rem;
      width: 100%;
      @media (min-width: 768px) {
        width: auto;
      }
    }
  }
`;

const CityFormLeft = styled.div`
  flex: 2;
`;

const CityFormRight = styled.div`
  display: flex;
  flex: 1;
  margin-top: 2rem;
  > div:first-of-type {
    padding-right: 1rem;
  }
  > div:last-of-type {
    padding-left: 1rem;
  }
  @media (min-width: 768px) {
    display: block;
    margin-top: 0;
    & > div:first-of-type,
    & > div:last-of-type {
      padding: 0;
    }
  }
`;

export interface CityFormInputs {
  cities: City[];
  passengers: string;
  date: string;
}

export interface CityFormProps {
  cities?: City[];
  passengers?: string;
  date?: string;
}

function CityForm(props: CityFormProps) {
  const methods = useForm<CityFormInputs>({
    defaultValues: {
      cities: props.cities || [{}, {}],
      passengers: props.passengers || "1",
      date: props.date || format(new Date(), "yyyy-MM-dd"),
    },
    mode: "onChange",
  });
  const formValues = useWatch({ control: methods.control });
  const [searchParams] = useSearchParams();
  const [, setCitySearchParams] = useCitySearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    setCitySearchParams(formValues as CityFormInputs);
  }, [formValues]);

  useEffect(() => {
    async function startValidation() {
      await methods.trigger();
    }
    startValidation();
  }, []);

  const onSubmit: SubmitHandler<CityFormInputs> = () => {
    navigate(`/search-results?${searchParams.toString()}`);
  };

  return (
    <FormProvider {...methods}>
      <CityFormContainer>
        <form className="city-form" onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="city-form-fields">
            <CityFormLeft>
              <CitySelectList />
            </CityFormLeft>
            <CityFormRight>
              <Controller
                control={methods.control}
                name="passengers"
                render={({ field: { onChange, value } }) => (
                  <IntegerInput
                    label="Passengers"
                    min={0}
                    onChange={onChange}
                    value={value}
                  />
                )}
                rules={{
                  required: true,
                  validate: {
                    greaterThanZero: (value) => Number(value) > 0,
                  },
                }}
              />
              <Controller
                control={methods.control}
                name="date"
                render={({ field: { onChange, value } }) => (
                  <DateInput label="Date" onChange={onChange} value={value} />
                )}
                rules={{
                  required: true,
                  validate: {
                    afterToday: (value) =>
                      value >= format(new Date(), "yyyy-MM-dd"),
                  },
                }}
              />
            </CityFormRight>
          </div>

          <Button
            className="btn-submit"
            disabled={!methods.formState.isValid}
            large
            text="Submit"
            type="submit"
          />
        </form>
      </CityFormContainer>
    </FormProvider>
  );
}

export default CityForm;
