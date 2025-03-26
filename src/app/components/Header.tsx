"use client";
import styled from "styled-components";
import Link from "next/link";

const HeaderDiv = styled.div`
  width: 100%;
  height: 100px;

  display: flex;
  align-items: center;
`;

const HeaderNav = styled.nav`
  display: flex;

  margin-left: 10px;
`;

const Element = styled(Link)`
  margin-left: 30px;

  color: black;
  text-decoration: none;
`;

const Title = styled.h1`
  margin-left: 20px;
`;

const TitleElement = styled(Link)`
  color: black;
  text-decoration: none;
`;

const Header = () => {
  return (
    <HeaderDiv>
      <TitleElement href="/">
        <Title>토도리</Title>
      </TitleElement>

      <HeaderNav>
        <Element href="/plan">계획</Element>
        <Element href="/project">프로젝트</Element>
        <Element href="/setting">설정</Element>
      </HeaderNav>
    </HeaderDiv>
  );
};

export default Header;
