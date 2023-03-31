import { NumericInput } from "@blueprintjs/core";
import { useState } from "react";
import { City } from "../api/cities";
import CityForm from "../components/CityForm";
import CitySelect from "../components/CitySelect";
import CitySelectList from "../components/CitySelectList";
import DateInput from "../components/DateInput";
import IntegerInput from "../components/IntegerInput";

function HomePage() {
  return <CityForm />;
}

export default HomePage;
