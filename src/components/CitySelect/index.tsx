import { useCallback, useState } from "react";

import { Button, Intent, Menu } from "@blueprintjs/core";
import { Classes, MenuItem2, MenuItem2Props } from "@blueprintjs/popover2";
import {
  ItemListRendererProps,
  ItemRendererProps,
  Suggest2,
} from "@blueprintjs/select";

import { City, fetchCities } from "../../api/cities";
import Skeleton from "../Skeleton";

export interface CitySelectProps {
  intent?: Intent;
  onChange: (item: City | null) => void;
  value: City | null;
}

function CitySelect(props: CitySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<City[]>([]);
  const [query, setQuery] = useState("");

  function getCityItemProps(
    city: City,
    { handleClick, handleFocus, modifiers, ref, query }: ItemRendererProps
  ): MenuItem2Props & React.Attributes {
    return {
      active: modifiers.active,
      disabled: modifiers.disabled,
      elementRef: ref,
      key: city.name,
      onClick: handleClick,
      onFocus: handleFocus,
      roleStructure: "listoption",
      text: city.name,
    };
  }

  function renderCity(city: City, props: ItemRendererProps) {
    return <MenuItem2 {...getCityItemProps(city, props)} />;
  }

  function renderInputValue(city: City) {
    return city.name;
  }

  const renderInputGroupRight = useCallback(() => {
    return props.value && props.value.name ? (
      <Button icon="cross" minimal onClick={clearQuery} />
    ) : undefined;
  }, [props.value]);

  function renderCityList(listProps: ItemListRendererProps<City>) {
    if (isLoading) {
      return <Skeleton />;
    }

    if (items.length > 0) {
      return (
        <Menu
          role="listbox"
          {...listProps.menuProps}
          ulRef={listProps.itemsParentRef}
        >
          {listProps.items.map((city, index) =>
            listProps.renderItem(city, index)
          )}
        </Menu>
      );
    }

    return (
      <Menu
        role="listbox"
        {...listProps.menuProps}
        ulRef={listProps.itemsParentRef}
      >
        <MenuItem2
          disabled={true}
          text="No results."
          roleStructure="listoption"
        />
      </Menu>
    );
  }

  function clearQuery() {
    setQuery("");
    props.onChange(null);
  }

  async function handleQueryChange(
    query: string,
    event?: React.ChangeEvent<HTMLInputElement>
  ) {
    setQuery(query);

    if (query) {
      if (!props.value || props.value.name !== query) {
        setIsLoading(true);
        setIsOpen(true);
        const cities = await fetchCities(query);
        setIsLoading(false);
        setItems(cities);
      }
    } else {
      setIsLoading(false);
      setIsOpen(false);
    }
  }

  function handleItemSelect(item: City) {
    setIsOpen(false);

    if (props.onChange) {
      props.onChange(item);
    }
  }

  // Close a popover
  function handleKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (event.key === "Escape") {
      setIsOpen(false);
    }
  }

  function dismissPopover(event: React.FocusEvent<HTMLInputElement>) {
    if (!event.relatedTarget?.className.includes(Classes.POPOVER2_DISMISS)) {
      setIsOpen(false);
    }
  }

  return (
    <Suggest2<City>
      fill
      inputProps={{
        intent: props.intent,
        onBlur: dismissPopover,
        onKeyDown: handleKeyDown,
        rightElement: renderInputGroupRight(),
      }}
      inputValueRenderer={renderInputValue}
      items={items}
      itemListRenderer={renderCityList}
      itemRenderer={renderCity}
      onItemSelect={handleItemSelect}
      onQueryChange={handleQueryChange}
      popoverProps={{
        isOpen: isOpen,
        matchTargetWidth: true,
        minimal: false,
      }}
      query={query}
      selectedItem={props.value}
    />
  );
}

export default CitySelect;
