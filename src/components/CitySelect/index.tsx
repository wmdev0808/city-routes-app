import { useCallback, useState } from "react";

import { Button, Menu } from "@blueprintjs/core";
import { MenuItem2, MenuItem2Props } from "@blueprintjs/popover2";
import {
  ItemListRendererProps,
  ItemRendererProps,
  Suggest2,
} from "@blueprintjs/select";

import { City, fetchCities } from "../../api/cities";
import Skeleton from "../Skeleton";

export interface CitySelectProps {
  onItemSelect?: (item: City) => void;
}

function CitySelect(props: CitySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<City[]>([]);
  const [query, setQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<City | null>();

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
    return query ? (
      <Button icon="cross" minimal onClick={clearQuery} />
    ) : undefined;
  }, [query]);

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
    setSelectedItem(null);
  }

  async function handleQueryChange(
    query: string,
    event?: React.ChangeEvent<HTMLInputElement>
  ) {
    setQuery(query);

    if (query) {
      if (!selectedItem || selectedItem.name !== query) {
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
    setSelectedItem(item);
    setQuery(item.name);
    setIsOpen(false);

    if (props.onItemSelect) {
      props.onItemSelect(item);
    }
  }

  // Close a popover
  function handleKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (event.key === "Escape") {
      setIsOpen(false);
    }
  }

  function dismissPopover(event: React.FocusEvent<HTMLInputElement>) {
    setIsOpen(false);
  }

  return (
    <Suggest2<City>
      inputProps={{
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
      selectedItem={selectedItem}
    />
  );
}

export default CitySelect;
