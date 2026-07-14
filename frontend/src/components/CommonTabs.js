import { useRef } from 'react';
import { TabBar, TabButton, TabLink } from './CommonTabsCss';

function CommonTabs({
  activeKey,
  ariaLabel,
  className,
  items,
  onChange,
}) {
  const buttonRefs = useRef([]);
  const usesLinks = items.every((item) => Boolean(item.to));

  const selectButtonTab = (item, index) => {
    onChange?.(item.id ?? item.key);
    buttonRefs.current[index]?.focus();
  };

  const handleButtonKeyDown = (event, index) => {
    let nextIndex;

    if (event.key === 'ArrowRight') {
      nextIndex = (index + 1) % items.length;
    } else if (event.key === 'ArrowLeft') {
      nextIndex = (index - 1 + items.length) % items.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = items.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    selectButtonTab(items[nextIndex], nextIndex);
  };

  return (
    <TabBar
      as={usesLinks ? 'nav' : 'div'}
      aria-label={ariaLabel}
      className={className}
      role={usesLinks ? undefined : 'tablist'}
    >
      {items.map((item, index) => {
        const itemKey = item.id ?? item.key ?? item.to;
        const Icon = item.icon;
        const content = (
          <>
            {Icon && <Icon aria-hidden="true" />}
            {item.label}
          </>
        );

        if (item.to) {
          return (
            <TabLink
              key={itemKey}
              to={item.to}
              end={item.end}
            >
              {content}
            </TabLink>
          );
        }

        const isActive = activeKey === itemKey;

        return (
          <TabButton
            key={itemKey}
            ref={(element) => {
              buttonRefs.current[index] = element;
            }}
            type="button"
            role="tab"
            aria-controls={item.panelId}
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            className={isActive ? 'is-active' : undefined}
            onClick={() => selectButtonTab(item, index)}
            onKeyDown={(event) => handleButtonKeyDown(event, index)}
          >
            {content}
          </TabButton>
        );
      })}
    </TabBar>
  );
}

export default CommonTabs;
