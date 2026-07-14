import styled, { css } from 'styled-components';
import { NavLink } from 'react-router-dom';

const activeTabStyles = css`
  border-color: rgba(75, 226, 119, 0.42);
  background: rgba(75, 226, 119, 0.1);
  color: #4be277;

  &::after {
    content: '';
    position: absolute;
    right: 12px;
    bottom: -9px;
    left: 12px;
    height: 2px;
    background: #4be277;
  }
`;

const tabStyles = css`
  position: relative;
  appearance: none;
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  min-height: 38px;
  padding: 0 16px;
  border: 1px solid transparent;
  border-radius: 4px;
  background: transparent;
  color: #869585;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 700;
  line-height: 20px;
  text-decoration: none;
  cursor: pointer;
  transition: border-color 150ms ease, background-color 150ms ease,
    color 150ms ease;

  svg {
    width: 16px;
    height: 16px;
    flex: 0 0 auto;
    margin-right: 8px;
  }

  &:hover {
    border-color: #3d4a3d;
    background: #131b2e;
    color: #dae2fd;
  }

  &:focus-visible {
    outline: 2px solid #4be277;
    outline-offset: 2px;
  }
`;

export const TabBar = styled.div`
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 4px;
  min-height: 56px;
  padding: 8px 32px;
  overflow-x: auto;
  border-bottom: 1px solid #334155;
  background: rgba(11, 19, 38, 0.96);
  scrollbar-width: thin;
  scrollbar-color: #3d4a3d transparent;

  @media (max-width: 720px) {
    padding-right: 16px;
    padding-left: 16px;
  }
`;

export const TabLink = styled(NavLink)`
  ${tabStyles}

  &[aria-current='page'] {
    ${activeTabStyles}
  }

  @media (max-width: 720px) {
    padding-right: 12px;
    padding-left: 12px;
    font-size: 12px;
  }
`;

export const TabButton = styled.button`
  ${tabStyles}

  &.is-active {
    ${activeTabStyles}
  }

  @media (max-width: 720px) {
    padding-right: 12px;
    padding-left: 12px;
    font-size: 12px;
  }
`;
