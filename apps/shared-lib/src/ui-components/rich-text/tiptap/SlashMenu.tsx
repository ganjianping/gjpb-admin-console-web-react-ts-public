import React from 'react';
// Removed leading code fence

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
  const { open, menuCoords, filteredItems, selectedIndex, openSubmenu, setOpenSubmenu, handleMenuAction } = props;
  if (!open) return null;

  return (
    <dialog
      className="gjp-floating-menu"
      open
      style={{
        position: 'absolute',
        left: menuCoords?.left ?? 8,
        top: menuCoords?.top ?? 8,
        zIndex: 60,
      }}
      aria-label="Insert menu"
    >
      <div className="gjp-floating-menu__list">
        {filteredItems.length === 0 && <div className="gjp-floating-menu__empty">No results</div>}

        {filteredItems.map((it: any, idx: number) => {
          if (it.children && Array.isArray(it.children)) {
            const children = it.children as MenuItem[];
            if (children.length === 0) return null;

            const Icon = it.icon as IconType | undefined;

            return (
              <div key={it.id} className="gjp-floating-menu__group" style={{ position: 'relative' }}>
                <button
                  type="button"
                  className={`gjp-floating-menu__item ${openSubmenu === it.id ? 'is-open' : ''}`}
                  onClick={() => setOpenSubmenu(openSubmenu === it.id ? null : it.id)}
                  onMouseEnter={() => setOpenSubmenu(it.id)}
                  onMouseLeave={() => setOpenSubmenu(null)}
                >
                  <span className="gjp-floating-menu__icon">{Icon ? <Icon size={16} /> : null}</span>
                  <span className="gjp-floating-menu__label">{it.label}</span>
                  <span className="gjp-floating-menu__chev">▸</span>
                </button>

                {openSubmenu === it.id && (
                  <div className="gjp-floating-submenu" style={{ position: 'absolute', left: '100%', top: 0, minWidth: 140, zIndex: 65 }}>
                    {children.map((ch) => (
                      <button key={ch.id} type="button" className="gjp-floating-menu__item gjp-floating-submenu__item" onClick={() => handleMenuAction(ch.id)}>
                        <span className="gjp-floating-menu__label">{ch.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          const Icon = it.icon as IconType | undefined;

          return (
            <button
              key={it.id}
              type="button"
              className={`gjp-floating-menu__item ${selectedIndex === idx ? 'is-selected' : ''}`}
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
