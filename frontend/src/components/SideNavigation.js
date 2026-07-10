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

const ALL_ROLES = ['admin', 'supervisor', 'operator'];
const MANAGEMENT_ROLES = ['admin', 'supervisor'];
const ROLE_ALIASES = {
  관리자: 'admin',
  지시자: 'supervisor',
  작업자: 'operator',
};

const MENU_ITEMS = [
  { number: '01', label: '대시보드 화면', path: '/dashboard', icon: FiGrid, roles: ALL_ROLES },
  { number: '02', label: '사용자 계정 화면', path: '/account', icon: FiUser, roles: ALL_ROLES },
  { number: '03', label: '작업 지시', path: '/work-orders', icon: FiClipboard, roles: MANAGEMENT_ROLES },
  { number: '04', label: '자재 / LOT', path: '/materials', icon: FiBox, roles: ALL_ROLES },
  { number: '4.1', label: 'BOM 관리', path: '/materials/bom', icon: FiLayers, roles: ALL_ROLES },
  { number: '4.2', label: 'LOT 관리', path: '/materials/lots', icon: FiPackage, roles: ALL_ROLES },
  { number: '4.3', label: '재고 관리', path: '/materials/inventory', icon: FiArchive, roles: ALL_ROLES },
  { number: '05', label: '알람 이력', path: '/alarms', icon: FiActivity, roles: ALL_ROLES },
  { number: '06', label: '통신 상태', path: '/communications', icon: FiWifi, roles: ALL_ROLES },
  { number: '07', label: '설정', path: '/settings', icon: FiSettings, roles: ['admin'] },
];

const normalizeRole = (role) => ROLE_ALIASES[role] || role;

const getStoredRole = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return (
      window.sessionStorage.getItem('userRole') ||
      window.localStorage.getItem('userRole')
    );
  } catch {
    return null;
  }
};

function SideNavigation({ onLogout, userRole }) {
  const navigate = useNavigate();
  const location = useLocation();
  const navigationId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState('');
  const currentUserRole = normalizeRole(userRole || getStoredRole()) || 'admin';

  const visibleMenuItems = useMemo(
    () => MENU_ITEMS.filter(({ roles }) => roles.includes(currentUserRole)),
    [currentUserRole],
  );

  const activePath = useMemo(() => {
    const matchingItem = visibleMenuItems.filter(
      ({ path }) =>
        location.pathname === path || location.pathname.startsWith(`${path}/`),
    ).sort((first, second) => second.path.length - first.path.length)[0];

    return matchingItem?.path;
  }, [location.pathname, visibleMenuItems]);

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

      try {
        window.sessionStorage.removeItem('userRole');
        window.localStorage.removeItem('userRole');
      } catch {
        // 저장소 사용이 제한된 환경에서도 로그아웃 이동은 계속 진행합니다.
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
          {visibleMenuItems.map(({ number, label, path, icon: Icon }) => {
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
