import { useState } from 'react';
import type { AuditLogEntry } from '../types';

export const useAuditLogDetail = () => {
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const handleViewDetail = (log: AuditLogEntry) => {
    setSelectedLog(log);
    setDetailModalOpen(true);
  };

  const handleCloseDetail = () => {
    setDetailModalOpen(false);
    setSelectedLog(null);
  };

  return {
    selectedLog,
    detailModalOpen,
    handleViewDetail,
    handleCloseDetail,
  };
};
