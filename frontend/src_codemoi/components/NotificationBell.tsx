import React, { useMemo, useState } from 'react';
import { IconButton, Badge, Menu, MenuItem, Typography, Divider, Tooltip, ListItemIcon, Box } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import { useBackgroundJobsStore } from '../stores/backgroundJobsStore';
import { format } from 'date-fns';

const formatDateForDisplay = (date: Date | null) => {
  return date ? format(date, 'dd/MM/yyyy') : 'N/A';
};

const NotificationBell: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const jobs = useBackgroundJobsStore((state) => state.jobs);
  const jobToView = useBackgroundJobsStore((state) => state.jobToView);
  const setJobToView = useBackgroundJobsStore((state) => state.setJobToView);
  const markJobAsRead = useBackgroundJobsStore((state) => state.markJobAsRead);
  const clearCompletedJobs = useBackgroundJobsStore((state) => state.clearCompletedJobs);
  const clearJob = useBackgroundJobsStore((state) => state.clearJob);

  const completedJobs = useMemo(() => {
    return Array.from(jobs.values())
      .filter(job => (job.status === 'success' && job.data) || job.status === 'success_empty')
      .sort((a, b) => (b.params.toDate?.getTime() || 0) - (a.params.toDate?.getTime() || 0)); // Sắp xếp mới nhất lên đầu
  }, [jobs]);

  const failedJobs = useMemo(() => {
    return Array.from(jobs.values())
      .filter(job => job.status === 'failed')
      .sort((a, b) => (b.params.toDate?.getTime() || 0) - (a.params.toDate?.getTime() || 0));
  }, [jobs]);

  const unreadCount = useMemo(() => {
    return completedJobs.filter(job => !job.read).length;
  }, [completedJobs]);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleViewResult = (jobId: string) => {
    const job = jobs.get(jobId);
    if (job) {
      setJobToView(job);
      markJobAsRead(jobId);
    }
    handleCloseMenu();
  };

  const handleDismissError = (jobId: string) => {
    clearJob(jobId);
  };

  const handleClearAll = () => {
    clearCompletedJobs();
    handleCloseMenu();
  };

  return (
    <>
      <Tooltip title="Kết quả đồng bộ">
        <IconButton color="inherit" onClick={handleOpenMenu}>
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        sx={{ mt: 1 }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Typography variant="h6" sx={{ px: 2, py: 1 }}>Thông báo</Typography>
        <Divider />
        {failedJobs.length > 0 && (
          <>
            {failedJobs.map(job => (
              <MenuItem key={job.id} onClick={() => handleDismissError(job.id)}>
                <Typography variant="body2" color="error">
                  Lỗi đồng bộ chuyến {job.params.chthu}-{job.params.tuiso}: {job.message}
                </Typography>
              </MenuItem>
            ))}
            <Divider />
          </>
        )}
        {completedJobs.length === 0 ? (
          <MenuItem disabled>
            <Typography variant="body2" color="text.secondary">Không có kết quả nào.</Typography>
          </MenuItem>
        ) : (
          completedJobs.map(job => (
            <MenuItem 
              key={job.id} 
              onClick={() => handleViewResult(job.id)} 
              selected={jobToView?.id === job.id}
              sx={{
                ...(jobToView?.id === job.id && {
                  backgroundColor: 'action.selected',
                }),
              }}
            >
              <Typography 
                variant="body2" 
                fontWeight={!job.read ? 'bold' : 'normal'}
              >
                {job.status === 'success' ? 
                  ( <>
                      Kết quả cho ngày <strong>{formatDateForDisplay(job.params.fromDate)}</strong>, chuyến <strong>{job.params.chthu}-{job.params.tuiso}</strong> (<strong>{job.params.mabcDong}</strong> → <strong>{job.params.mabcNhan}</strong>)
                    </>
                  )
                  : 
                  <Box component="span" sx={{ display: 'flex', alignItems: 'center', fontStyle: 'italic', color: 'text.secondary' }}>
                    <SearchOffIcon fontSize="small" sx={{ mr: 1 }}/>
                    <span>Không có dữ liệu cho chuyến {job.params.chthu}-{job.params.tuiso} ({job.params.mabcDong} → {job.params.mabcNhan})</span>
                  </Box>
                }
              </Typography>
            </MenuItem>
          ))
        )}
        {completedJobs.length > 0 && (
          <>
            <Divider />
            <MenuItem onClick={handleClearAll}>
              <ListItemIcon>
                <ClearAllIcon fontSize="small" />
              </ListItemIcon>
              <Typography variant="body2" color="text.secondary">Xóa tất cả kết quả</Typography>
            </MenuItem>
          </>
        )}
      </Menu>
    </>
  );
};

export default NotificationBell; 