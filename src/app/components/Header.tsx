"use client";
import styled from "styled-components";
import Link from "next/link";

const HeaderDiv = styled.div`
  position: relative;

  width: 100%;
  height: 12%;

  display: flex;
  justify-content: center;
  flex-direction: column;
`;

const HeaderContainer = styled.div`
  display: flex;

  margin-left: 20px;
`;

const HeaderNav = styled.nav`
  display: flex;
  align-items: center;

  margin-left: 40px;
`;

const Element = styled(Link)`
  margin-left: 50px;

  color: black;

  font-size: 13pt;
  font-family: "Pretendard";

  text-decoration: none;
`;

const Title = styled.h1`
  margin-left: 20px;
  font-family: "Pretendard";
`;

const TitleElement = styled(Link)`
  height: auto;

  color: black;
  text-decoration: none;
`;

const HorizontalLine = styled.div`
  position: absolute;

  left: 0;
  bottom: 0;

  background-color: black;
  width: 100%;
  height: 1px;
`;

const Header = () => {
  return (
    <HeaderDiv>
      <HeaderContainer>
        <TitleElement href="/">
          <Title>토도리</Title>
        </TitleElement>

        <HeaderNav>
          <Element href="/plan">계획</Element>
          <Element href="/project">프로젝트</Element>
          <Element href="/setting">설정</Element>
        </HeaderNav>
      </HeaderContainer>

      <HorizontalLine />
    </HeaderDiv>
  );
};

export default Header;
