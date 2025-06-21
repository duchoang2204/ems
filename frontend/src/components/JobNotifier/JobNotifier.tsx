import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useBackgroundJobsStore } from '../../stores/backgroundJobsStore';

const JobNotifier: React.FC = () => {
  const jobs = useBackgroundJobsStore((state) => state.jobs);
  const markJobAsNotified = useBackgroundJobsStore((state) => state.markJobAsNotified);
  const clearJob = useBackgroundJobsStore((state) => state.clearJob);

  useEffect(() => {
    jobs.forEach((job) => {
      // Chỉ hiển thị toast cho job thất bại và chưa được thông báo
      if (job.status === 'failed' && !job.notified) {
        markJobAsNotified(job.id); // Đánh dấu đã thông báo lỗi
        toast.error(
          <div>
            <div>Không thể đồng bộ cho chuyến {job.params.chthu}-{job.params.tuiso}.</div>
            <div style={{ fontSize: '12px', marginTop: '4px' }}>{job.message}</div>
          </div>,
          { toastId: `${job.id}-failed`, autoClose: 8000 }
        );
        // Tự động xóa job thất bại khỏi danh sách sau khi thông báo
        // setTimeout(() => clearJob(job.id), 8000); // Bỏ dòng này để giữ lại job lỗi
      }
    });
  }, [jobs, markJobAsNotified, clearJob]);

  return null; // Component này không render gì, chỉ xử lý side effects
};

export default JobNotifier; 