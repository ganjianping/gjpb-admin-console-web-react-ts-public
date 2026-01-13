import React from "react";
import { Menu, MenuItem } from "@mui/material";
import { Eye, Edit2, Trash2 } from "lucide-react";
import type { ExpressionRu } from "../types/expressionRu.types";

export const useExpressionRuActionMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedExpressionRu, setSelectedExpressionRu] = React.useState<ExpressionRu | null>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, expressionRu: ExpressionRu) => {
    setAnchorEl(event.currentTarget);
    setSelectedExpressionRu(expressionRu);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const renderActionMenu = (onAction: (action: 'view' | 'edit' | 'delete') => void) => (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleCloseMenu}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <MenuItem
        onClick={() => {
          if (selectedExpressionRu) onAction('view');
          handleCloseMenu();
        }}
      >
        <Eye size={16} style={{ marginRight: 8 }} />
        View
      </MenuItem>
      <MenuItem
        onClick={() => {
          if (selectedExpressionRu) onAction('edit');
          handleCloseMenu();
        }}
      >
        <Edit2 size={16} style={{ marginRight: 8 }} />
        Edit
      </MenuItem>
      <MenuItem
        onClick={() => {
          if (selectedExpressionRu) onAction('delete');
          handleCloseMenu();
        }}
        sx={{ color: 'error.main' }}
      >
        <Trash2 size={16} style={{ marginRight: 8 }} />
        Delete
      </MenuItem>
    </Menu>
  );

  return {
    handleOpenMenu,
    handleCloseMenu,
    renderActionMenu,
    selectedExpressionRu,
  };
};
