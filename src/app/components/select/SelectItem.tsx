import { Atom, useAtom } from "jotai";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const SelectItemDiv = styled.div`
  width: auto;
  z-index: 1;
`;

const OptionsDiv = styled.div`
  background-color: white;

  position: relative;

  width: 110px;
  height: 25px;

  margin-right: 5px;

  border: 1px solid black;
  border-radius: 2px;

  text-align: left;
  font-size: 10pt;

  display: flex;
  align-items: center;
  font-family: "Pretendard";
`;

const Options = styled.input`
  position: absolute;

  background-color: rgba(0, 0, 0, 0);

  width: 100%;
  height: 100%;

  padding: 5px;

  border: none;

  outline: none;
`;

const Arrow = styled.svg`
  position: absolute;

  width: 12px;

  right: 8px;
`;

const DropDownDiv = styled.div<{ dropDownOpened: boolean }>`
  position: absolute;

  width: 112px;

  display: ${({ dropDownOpened }) => (dropDownOpened ? "flex" : "none")};
  flex-direction: column;

  z-index: 2;
`;

const DropDown = styled.button<{ selected: boolean }>`
  background-color: ${({ selected }) =>
    selected ? "rgb(113, 158, 255)" : "rgb(255, 255, 255)"};

  border: none;
  border-bottom: 1px solid black;
  border-left: 1px solid black;
  border-right: 1px solid black;

  padding: 7px;

  color: ${({ selected }) => (selected ? "white" : "black")};
  font-size: 10pt;
  text-align: left;
`;

interface SelectItemProps {
  elements: Record<string, any>;
  selectState: Atom<string>;
}

export const SelectItem = ({ elements, selectState }: SelectItemProps) => {
  const [dropDownOpened, openingDropDown] = useState(false);
  const [selectedItem, setSelectedItem] = useAtom(selectState);
  const optionsRef = useRef<HTMLInputElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // 상태 업데이트 함수
  const getNextKey = (currentKey: string, mark: number) => {
    const keys = Object.keys(elements);
    let index = keys.indexOf(currentKey);
    if (index + mark < 0) index = keys.length;
    return keys[(index + mark) % keys.length];
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 포커스 상태 체크
      if (!optionsRef.current || document.activeElement !== optionsRef.current)
        return;

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          setSelectedItem(getNextKey(selectedItem, -1)); // 위로 이동
          break;
        case "ArrowDown":
          e.preventDefault();
          setSelectedItem(getNextKey(selectedItem, 1)); // 아래로 이동
          break;
        case "Enter":
          e.preventDefault();
          openingDropDown(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedItem, elements]);

  return (
    <SelectItemDiv>
      <OptionsDiv>
        <Options
          type="text"
          name="subject"
          value={elements[selectedItem]}
          onClick={() => openingDropDown(!dropDownOpened)}
          ref={optionsRef}
          readOnly
        />
        <Arrow
          width="15"
          height="9"
          viewBox="0 0 15 9"
          fill="none"
          onClick={() => openingDropDown(!dropDownOpened)}
          transform={`rotate(${dropDownOpened ? "180" : "0"} 0 0)`}
        >
          <path
            d="M1 1L7.5 7.5L13.9962 1.00378"
            stroke="black"
            strokeLinecap="round"
          />
        </Arrow>
      </OptionsDiv>

      <DropDownDiv dropDownOpened={dropDownOpened} ref={dropdownRef}>
        {Object.entries(elements).map(([key, value], index) => (
          <DropDown
            key={index}
            onClick={() => {
              setSelectedItem(key);
              openingDropDown(false);
            }}
            selected={value === elements[selectedItem]}
          >
            {value}
          </DropDown>
        ))}
      </DropDownDiv>
    </SelectItemDiv>
  );
};
