import React from 'react';

type IconType = React.FC<{ size?: number }>;

interface MenuItem {
  id: string;
  label: string;
  icon?: IconType;
  children?: MenuItem[];
}

interface SlashMenuProps {
  open: boolean;
  menuCoords: { left: number; top: number } | null;
  menuItems: any[];
  filteredItems: any[];
  selectedIndex: number;
  openSubmenu: string | null;
  setOpenSubmenu: (s: string | null) => void;
  handleMenuAction: (id: string) => void;
}

export default function SlashMenu(props: Readonly<SlashMenuProps>) {
  const {
    open,
    menuCoords,
    menuItems,
    filteredItems,
    selectedIndex,
    openSubmenu,
    setOpenSubmenu,
    handleMenuAction,
  } = props;

  if (!open) return null;

  const flattenedIndexOf = (id: string) => filteredItems.findIndex((f: any) => f.id === id);
  const empty = !filteredItems || filteredItems.length === 0;

  // Compute position: center the menu at the caret x-coordinate and place slightly above the caret y.
  // Clamp to viewport to avoid overflow.
  const rawLeft = menuCoords?.left ?? 8;
  const rawTop = (menuCoords?.top ?? 8) - 10; // nudge above the caret
  let finalLeft = rawLeft;
  let finalTop = rawTop;
  if (typeof window !== 'undefined') {
    const vw = window.innerWidth;
    const menuWidthEstimate = 260; // conservative estimate
    finalLeft = Math.min(Math.max(rawLeft, 12), Math.max(12, vw - menuWidthEstimate - 12));
    finalTop = Math.max(8, rawTop);
  }

  return (
    <dialog
      className="gjp-floating-menu"
      open
      style={{
        position: 'absolute',
        left: finalLeft,
        top: finalTop,
        zIndex: 60,
        transform: 'translateX(-50%)',
        background: 'var(--rt-bg, #fff)',
        borderRadius: 8,
        padding: '6px',
        boxShadow: '0 6px 20px rgba(20,20,30,0.12)',
        border: '1px solid rgba(0,0,0,0.06)',
        minWidth: 220,
      }}
      aria-label="Insert menu"
    >
      <div className="gjp-floating-menu__list">
        {empty && <div className="gjp-floating-menu__empty" style={{ padding: 8 }}>No results</div>}

        {menuItems.map((it: any) => {
          // group with children
          if (it.children && Array.isArray(it.children)) {
            const children = (it.children as MenuItem[]).filter(
              (ch) => flattenedIndexOf(ch.id) !== -1 || filteredItems.length === 0
            );
            if (children.length === 0) return null;

            const Icon = it.icon as IconType | undefined;

            return (
              <div
                key={it.id}
                className="gjp-floating-menu__group"
                style={{ position: 'relative' }}
                onMouseEnter={() => setOpenSubmenu(it.id)}
                onMouseLeave={() => setOpenSubmenu(null)}
                aria-haspopup="true"
              >
                <button
                  type="button"
                  className={`gjp-floating-menu__item ${openSubmenu === it.id ? 'is-open' : ''}`}
                  onClick={() => setOpenSubmenu(openSubmenu === it.id ? null : it.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '6px 8px',
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                  role="menuitem"
                >
                  <span className="gjp-floating-menu__icon" style={{ width: 18, display: 'inline-flex', justifyContent: 'center' }}>{Icon ? <Icon size={18} /> : null}</span>
                  <span className="gjp-floating-menu__label" style={{ flex: 1 }}>{it.label}</span>
                  <span className="gjp-floating-menu__chev">▸</span>
                </button>

                {openSubmenu === it.id && (
                  <div
                    className="gjp-floating-submenu"
                    style={{
                      position: 'absolute',
                      left: '100%',
                      top: 0,
                      minWidth: 160,
                      zIndex: 65,
                      background: 'var(--rt-bg, #fff)',
                      borderRadius: 6,
                      boxShadow: '0 6px 18px rgba(20,20,30,0.12)',
                      border: '1px solid rgba(0,0,0,0.06)',
                      padding: 6,
                    }}
                    role="menu"
                  >
                    {children.map((ch) => {
                      const idx = flattenedIndexOf(ch.id);
                      return (
                        <button
                          key={ch.id}
                          type="button"
                          className={`gjp-floating-menu__item gjp-floating-submenu__item ${idx === selectedIndex ? 'is-selected' : ''}`}
                          onClick={() => handleMenuAction(ch.id)}
                          style={{
                            display: 'block',
                            padding: '6px 10px',
                            width: '100%',
                            border: 'none',
                            textAlign: 'left',
                            background: 'transparent',
                            cursor: 'pointer',
                          }}
                          role="menuitem"
                        >
                          <span className="gjp-floating-menu__label">{ch.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          // single actionable item
          const Icon = it.icon as IconType | undefined;
          const idx = flattenedIndexOf(it.id);
          if (filteredItems.length > 0 && idx === -1) return null;

          return (
            <button
              key={it.id}
              type="button"
              className={`gjp-floating-menu__item ${idx === selectedIndex ? 'is-selected' : ''}`}
              onClick={() => handleMenuAction(it.id)}
            >
              <span className="gjp-floating-menu__icon">{Icon ? <Icon size={16} /> : null}</span>
              <span className="gjp-floating-menu__label">{it.label}</span>
            </button>
          );
        })}
      </div>
    </dialog>
  );
}
