import { useCombobox } from 'downshift';
import { IoClose } from 'react-icons/io5';
import { FiSearch } from 'react-icons/fi';
import styled, { css } from 'styled-components';

import { City } from '../types';

type ComboBoxProps = {
  data: City[] | undefined;
  isError: boolean;
  loading: boolean;
  onChange: (item: string) => void;
  selectCity: (item: City | null | undefined) => void;
};

export function ComboBox({
  data,
  isError,
  loading,
  onChange,
  selectCity,
}: ComboBoxProps) {
  const {
    getComboboxProps,
    getInputProps,
    getItemProps,
    getMenuProps,
    isOpen,
    highlightedIndex,
    reset,
    selectedItem,
  } = useCombobox({
    items: data || [],
    itemToString: city => (city ? city.name : ''),
    onInputValueChange: ({ inputValue }) => {
      onChange(inputValue as string);
    },
    onStateChange: ({ selectedItem }) => {
      selectCity(selectedItem);
    },
  });

  return (
    <StyledCombobox isOpen={isOpen}>
      <form className="input__box" {...getComboboxProps()}>
        <input className="input" {...getInputProps()} size="0" />
        {selectedItem ? (
          <span className="close" onClick={reset}>
            <IoClose color="#333" />
          </span>
        ) : (
          <FiSearch className="search" color="#333" />
        )}
      </form>

      <ul className="list__container" {...getMenuProps()}>
        {' '}
        {isOpen ? (
          loading ? (
            <ListItem>Loading...</ListItem>
          ) : isError ? (
            <ListItem>Error...</ListItem>
          ) : data && data.length > 0 ? (
            data.map((city, index) => (
              <ListItem
                isHighlighted={highlightedIndex === index}
                key={city.id}
                {...getItemProps({ item: city, index })}
              >
                {city.city}, {city.country}
              </ListItem>
            ))
          ) : (
            <ListItem>No results found</ListItem>
          )
        ) : null}
      </ul>
    </StyledCombobox>
  );
}

const StyledCombobox = styled.div<{ isOpen: boolean }>`
  display: flex;
  flex-direction: column;
  flex: 1 1 0;
  position: relative;
  max-width: 20rem;
  margin-left: 1rem;

  .input__box {
    display: flex;
    align-items: center;
    flex: 1 1 0;
    background: #fff;
    border-radius: 1000px;

    .input {
      color: #333;
      flex: 1 1 0;
      min-width: 0rem;
      border-radius: inherit;
      padding: 0.6rem 1.5rem;
      border: none;

      &:focus {
        outline: none;
      }
    }
    .close {
      font-size: 1.5rem;
      width: 2rem;
      cursor: pointer;
      display: flex;
      justify-content: center;
      flex: 0 0 2.5rem;
    }
    .search {
      font-size: 1.3rem;
      width: 2rem;
      flex: 0 0 2.5rem;
    }
  }

  .list__container {
    background: #fff;
    color: #000;
    overflow: auto;
    max-height: 16rem;
    padding: 0.25rem;
    border-radius: 6px;
    width: 100%;
    z-index: 50;
    position: absolute;
    top: 95%;
    left: 0;
    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000),
      var(--tw-shadow);
    ${props =>
      props.isOpen
        ? css`
            visibility: visible;
          `
        : css`
            visibility: hidden;
          `}

    .list__item {
      padding: 0.5rem;
      border-radius: 6px;
      font-weight: 500;
      font-size: 0.9rem;
    }
  }
`;

const ListItem = styled.li<{ isHighlighted?: boolean }>`
  padding: 0.5rem;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.9rem;
  ${props =>
    props.isHighlighted
      ? css`
          background: #a6acec;
        `
      : css`
          background: #fff;
        `}
`;
