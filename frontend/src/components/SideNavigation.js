import { useEffect, useId, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  FiActivity,
  FiArchive,
  FiBox,
  FiChevronLeft,
  FiChevronRight,
  FiClipboard,
  FiGrid,
  FiLayers,
  FiLogOut,
  FiPackage,
  FiSettings,
  FiUser,
  FiWifi,
} from 'react-icons/fi';
import {
  Backdrop,
  Brand,
  BrandMark,
  BrandText,
  ErrorMessage,
  Footer,
  Header,
  Menu,
  MenuButton,
  MenuIcon,
  MenuLabel,
  MenuNumber,
  NavigationPanel,
  SectionLabel,
  SignOutButton,
  ToggleButton,
} from './SideNavigationCss';

const MENU_ITEMS = [
  { number: '01', label: '대시보드 화면', path: '/dashboard', icon: FiGrid },
  { number: '02', label: '사용자 계정 화면', path: '/account', icon: FiUser },
  { number: '03', label: '작업 지시', path: '/work-orders', icon: FiClipboard },
  { number: '04', label: '자재 / LOT', path: '/materials', icon: FiBox },
  { number: '4.1', label: 'BOM 관리', path: '/materials/bom', icon: FiLayers },
  { number: '4.2', label: 'LOT 관리', path: '/materials/lots', icon: FiPackage },
  { number: '4.3', label: '재고 관리', path: '/materials/inventory', icon: FiArchive },
  { number: '05', label: '알람 이력', path: '/alarms', icon: FiActivity },
  { number: '06', label: '통신 상태', path: '/communications', icon: FiWifi },
  { number: '07', label: '설정', path: '/settings', icon: FiSettings },
];

function SideNavigation({ onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const navigationId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState('');

  const activePath = useMemo(() => {
    const matchingItem = MENU_ITEMS.filter(
      ({ path }) =>
        location.pathname === path || location.pathname.startsWith(`${path}/`),
    ).sort((first, second) => second.path.length - first.path.length)[0];

    return matchingItem?.path;
  }, [location.pathname]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);
    setLogoutError('');

    try {
      const result = onLogout ? await onLogout() : true;

      if (result === false) {
        setLogoutError('로그아웃을 완료하지 못했습니다. 다시 시도해주세요.');
        return;
      }

      setIsOpen(false);
      navigate('/account/login', { replace: true });
    } catch {
      setLogoutError('로그아웃 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <Backdrop
        type="button"
        $isOpen={isOpen}
        onClick={() => setIsOpen(false)}
        aria-label="사이드바 닫기"
        tabIndex={isOpen ? 0 : -1}
      />

      <NavigationPanel id={navigationId} $isOpen={isOpen} aria-label="주 메뉴">
        <ToggleButton
          type="button"
          $isOpen={isOpen}
          onClick={() => setIsOpen((current) => !current)}
          aria-expanded={isOpen}
          aria-controls={navigationId}
          aria-label={isOpen ? '사이드바 닫기' : '사이드바 열기'}
        >
          {isOpen ? (
            <FiChevronLeft aria-hidden="true" />
          ) : (
            <FiChevronRight aria-hidden="true" />
          )}
        </ToggleButton>

        <Header>
          <Brand>
            <BrandMark aria-hidden="true">M</BrandMark>
            <BrandText>
              <strong>MES CONTROL</strong>
              <span>PRODUCTION SYSTEM</span>
            </BrandText>
          </Brand>
        </Header>

        <SectionLabel>MAIN NAVIGATION</SectionLabel>

        <Menu aria-label="MES 화면 메뉴">
          {MENU_ITEMS.map(({ number, label, path, icon: Icon }) => {
            const isActive = activePath === path;

            return (
              <li key={path}>
                <MenuButton
                  type="button"
                  $isActive={isActive}
                  onClick={() => handleNavigation(path)}
                  aria-current={isActive ? 'page' : undefined}
                  tabIndex={isOpen ? 0 : -1}
                >
                  <MenuIcon $isActive={isActive}>
                    <Icon aria-hidden="true" />
                  </MenuIcon>
                  <MenuNumber>{number}</MenuNumber>
                  <MenuLabel>{label}</MenuLabel>
                </MenuButton>
              </li>
            );
          })}
        </Menu>

        <Footer>
          {logoutError && <ErrorMessage role="alert">{logoutError}</ErrorMessage>}
          <SignOutButton
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            tabIndex={isOpen ? 0 : -1}
          >
            <FiLogOut aria-hidden="true" />
            <span>{isLoggingOut ? '로그아웃 중...' : '로그아웃'}</span>
          </SignOutButton>
        </Footer>
      </NavigationPanel>
    </>
  );
}

export default SideNavigation;
