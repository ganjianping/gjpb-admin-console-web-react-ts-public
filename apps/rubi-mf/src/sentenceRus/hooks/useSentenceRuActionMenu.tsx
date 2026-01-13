import React from "react";
import { Menu, MenuItem } from "@mui/material";
import { Eye, Edit2, Trash2 } from "lucide-react";
import type { SentenceRu } from "../types/sentenceRu.types";

export const useSentenceRuActionMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedSentenceRu, setSelectedSentenceRu] = React.useState<SentenceRu | null>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, sentenceRu: SentenceRu) => {
    setAnchorEl(event.currentTarget);
    setSelectedSentenceRu(sentenceRu);
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
          if (selectedSentenceRu) onAction('view');
          handleCloseMenu();
        }}
      >
        <Eye size={16} style={{ marginRight: 8 }} />
        View
      </MenuItem>
      <MenuItem
        onClick={() => {
          if (selectedSentenceRu) onAction('edit');
          handleCloseMenu();
        }}
      >
        <Edit2 size={16} style={{ marginRight: 8 }} />
        Edit
      </MenuItem>
      <MenuItem
        onClick={() => {
          if (selectedSentenceRu) onAction('delete');
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
    selectedSentenceRu,
  };
};
