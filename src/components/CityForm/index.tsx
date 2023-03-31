import { Button, Classes } from "@blueprintjs/core";
import { useEffect, useState } from "react";
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import styled from "styled-components";
import { format } from "date-fns";

import { City } from "../../api/cities";
import CitySelectList from "../CitySelectList";
import DateInput from "../DateInput";
import IntegerInput from "../IntegerInput";

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
      .${Classes.FORM_HELPER_TEXT} {
        text-align: left;
      }
    }
    .btn-submit {
      margin-top: 2rem;
    }
  }
`;

const CityFormLeft = styled.div`
  flex: 2;
`;

const CityFormRight = styled.div`
  flex: 1;
`;

export interface CityFormInputs {
  cities: (City | null)[];
  passengers: number | string;
  date: string;
}

interface CityFormProps {
  cities?: (City | null)[];
  passengers?: number | string;
  date?: string;
}

function CityForm(props: CityFormProps) {
  const methods = useForm<CityFormInputs>({
    defaultValues: {
      cities: props.cities || [{}, {}],
      passengers: props.passengers || 1,
      date: props.date || format(new Date(), "yyyy-MM-dd"),
    },
  });

  useEffect(() => {
    async function startValidation() {
      await methods.trigger();
    }
    startValidation();
  }, []);

  const onSubmit: SubmitHandler<CityFormInputs> = (data) => {
    console.log(data);
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
                name="passengers"
                control={methods.control}
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
                name="date"
                control={methods.control}
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
            text="Submit"
            type="submit"
          />
        </form>
      </CityFormContainer>
    </FormProvider>
  );
}

export default CityForm;
