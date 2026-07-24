import styled, { css } from 'styled-components';

export const Backdrop = styled.button`
  position: fixed;
  inset: 0;
  z-index: 900;
  width: 100%;
  height: 100%;
  padding: 0;
  border: 0;
  background: rgba(6, 14, 32, 0.56);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
  pointer-events: ${({ $isOpen }) => ($isOpen ? 'auto' : 'none')};
  cursor: default;
  transition:
    opacity 240ms ease,
    visibility 240ms ease;
`;

export const NavigationPanel = styled.aside`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 910;
  display: flex;
  width: min(288px, calc(100vw - 48px));
  height: 100vh;
  height: 100dvh;
  flex-direction: column;
  border-right: 1px solid #3d4a3d;
  background: #131b2e;
  color: #dae2fd;
  transform: translateX(${({ $isOpen }) => ($isOpen ? '0' : '-100%')});
  transition: transform 260ms cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;

  @media (max-width: 720px) {
    width: min(280px, calc(100vw - 44px));
  }

  @media (prefers-reduced-motion: reduce) {
    transition-duration: 1ms;
  }
`;

export const ToggleButton = styled.button`
  position: absolute;
  top: 50%;
  left: 100%;
  display: grid;
  width: 38px;
  height: 80px;
  padding: 0 6px 0 2px;
  place-items: center;
  border: 1px solid ${({ $isOpen }) => ($isOpen ? '#4be277' : '#3d4a3d')};
  border-left: 0;
  background: ${({ $isOpen }) => ($isOpen ? '#4be277' : '#222a3d')};
  color: ${({ $isOpen }) => ($isOpen ? '#003915' : '#4be277')};
  clip-path: polygon(0 0, 72% 8%, 100% 50%, 72% 92%, 0 100%);
  cursor: pointer;
  transform: translateY(-50%);
  transition:
    background 160ms ease,
    border-color 160ms ease,
    color 160ms ease;

  svg {
    width: 20px;
    height: 20px;
    stroke-width: 2.2;
  }

  &:hover {
    border-color: #4be277;
    background: ${({ $isOpen }) => ($isOpen ? '#6bff8f' : '#2d3449')};
  }

  &:focus-visible {
    outline: 2px solid #6bff8f;
    outline-offset: 3px;
  }

  @media (max-width: 720px) {
    width: 34px;
    height: 68px;
    padding-right: 5px;

    svg {
      width: 18px;
      height: 18px;
    }
  }
`;

export const Header = styled.header`
  flex: 0 0 auto;
  padding: 20px 18px 18px;
  border-bottom: 1px solid #3d4a3d;
  background: #171f33;
`;

export const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const BrandMark = styled.span`
  display: grid;
  width: 40px;
  height: 40px;
  flex: 0 0 40px;
  place-items: center;
  border: 1px solid #4be277;
  border-radius: 4px;
  background: rgba(75, 226, 119, 0.1);
  color: #4be277;
  font-family: 'JetBrains Mono', monospace;
  font-size: 20px;
  font-weight: 700;
  line-height: 1;
`;

export const BrandText = styled.div`
  min-width: 0;

  strong,
  span {
    display: block;
  }

  strong {
    color: #dae2fd;
    font-size: 15px;
    font-weight: 700;
    line-height: 20px;
    letter-spacing: 0.04em;
  }

  span {
    margin-top: 2px;
    color: #869585;
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 500;
    line-height: 14px;
    letter-spacing: 0.1em;
  }
`;

export const SectionLabel = styled.p`
  flex: 0 0 auto;
  margin: 0;
  padding: 18px 18px 8px;
  color: #869585;
  font-size: 11px;
  font-weight: 700;
  line-height: 16px;
  letter-spacing: 0.1em;
`;

export const Menu = styled.ul`
  flex: 1 1 auto;
  min-height: 0;
  margin: 0;
  padding: 0 10px 14px;
  overflow-y: auto;
  list-style: none;
  scrollbar-color: #3d4a3d transparent;
  scrollbar-width: thin;

  li + li {
    margin-top: 4px;
  }

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 999px;
    background: #3d4a3d;
  }
`;

export const MenuButton = styled.button`
  position: relative;
  display: grid;
  width: 100%;
  min-height: 48px;
  grid-template-columns: 30px 30px minmax(0, 1fr);
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  overflow: hidden;
  border: 1px solid ${({ $isActive }) => ($isActive ? '#4be277' : 'transparent')};
  border-radius: 4px;
  background: ${({ $isActive }) =>
    $isActive ? 'rgba(75, 226, 119, 0.10)' : 'transparent'};
  color: ${({ $isActive }) => ($isActive ? '#dae2fd' : '#bccbb9')};
  text-align: left;
  cursor: pointer;
  transition:
    background 140ms ease,
    border-color 140ms ease,
    color 140ms ease;

  ${({ $isActive }) =>
    $isActive &&
    css`
      &::before {
        position: absolute;
        top: 10px;
        bottom: 10px;
        left: 0;
        width: 3px;
        background: #4be277;
        content: '';
      }
    `}

  &:hover {
    border-color: ${({ $isActive }) => ($isActive ? '#4be277' : '#3d4a3d')};
    background: ${({ $isActive }) =>
      $isActive ? 'rgba(75, 226, 119, 0.14)' : '#222a3d'};
    color: #dae2fd;
  }

  &:focus-visible {
    outline: 2px solid #4be277;
    outline-offset: 2px;
  }
`;

export const MenuIcon = styled.span`
  display: grid;
  width: 30px;
  height: 30px;
  place-items: center;
  border: 1px solid ${({ $isActive }) => ($isActive ? '#4be277' : '#3d4a3d')};
  border-radius: 4px;
  background: ${({ $isActive }) =>
    $isActive ? 'rgba(75, 226, 119, 0.08)' : '#171f33'};
  color: ${({ $isActive }) => ($isActive ? '#4be277' : '#869585')};

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const MenuNumber = styled.span`
  color: #869585;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 500;
  line-height: 16px;
  letter-spacing: 0.05em;
`;

export const MenuLabel = styled.span`
  overflow: hidden;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const Footer = styled.footer`
  flex: 0 0 auto;
  padding: 14px 18px 18px;
  border-top: 1px solid #3d4a3d;
  background: #171f33;
`;

export const WorkerInfo = styled.section`
  margin-bottom: 12px;
  padding: 12px;
  border: 1px solid #3d4a3d;
  border-radius: 4px;
  background: #131b2e;
`;

export const WorkerIdentity = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #222a3d;
`;

export const WorkerAvatar = styled.span`
  display: grid;
  width: 34px;
  height: 34px;
  flex: 0 0 34px;
  place-items: center;
  border: 1px solid rgba(75, 226, 119, 0.5);
  border-radius: 4px;
  background: rgba(75, 226, 119, 0.1);
  color: #4be277;
  font-size: 14px;
  font-weight: 700;
`;

export const WorkerName = styled.div`
  min-width: 0;

  span,
  strong {
    display: block;
  }

  span {
    color: #869585;
    font-size: 9px;
    font-weight: 700;
    line-height: 13px;
    letter-spacing: 0.09em;
    text-transform: uppercase;
  }

  strong {
    margin-top: 2px;
    overflow: hidden;
    color: #dae2fd;
    font-size: 14px;
    line-height: 19px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const WorkerDetails = styled.dl`
  display: grid;
  gap: 5px;
  margin: 10px 0 0;
`;

export const WorkerDetail = styled.div`
  display: grid;
  grid-template-columns: 58px minmax(0, 1fr);
  align-items: center;
  gap: 8px;
  min-height: 18px;
`;

export const WorkerDetailLabel = styled.dt`
  color: #869585;
  font-size: 10px;
  line-height: 14px;
`;

export const WorkerDetailValue = styled.dd`
  margin: 0;
  overflow: hidden;
  color: #bccbb9;
  font-family: ${({ $mono }) =>
    $mono ? "'JetBrains Mono', monospace" : 'inherit'};
  font-size: 11px;
  font-weight: 600;
  line-height: 16px;
  text-align: right;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ErrorMessage = styled.p`
  margin: 0 0 10px;
  padding: 8px 10px;
  border: 1px solid rgba(255, 180, 174, 0.45);
  border-radius: 4px;
  background: rgba(147, 0, 10, 0.2);
  color: #ffb4ae;
  font-size: 12px;
  line-height: 18px;
`;

export const SignOutButton = styled.button`
  display: flex;
  width: 100%;
  min-height: 44px;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: 1px solid #3d4a3d;
  border-radius: 4px;
  background: #222a3d;
  color: #dae2fd;
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  cursor: pointer;
  transition:
    background 140ms ease,
    border-color 140ms ease,
    color 140ms ease;

  svg {
    width: 17px;
    height: 17px;
  }

  &:hover:not(:disabled) {
    border-color: #ffb4ae;
    background: rgba(147, 0, 10, 0.18);
    color: #ffb4ae;
  }

  &:focus-visible {
    outline: 2px solid #ffb4ae;
    outline-offset: 2px;
  }

  &:disabled {
    cursor: wait;
    opacity: 0.6;
  }
`;
