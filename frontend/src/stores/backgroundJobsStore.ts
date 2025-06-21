import { create } from 'zustand';
import { searchE1Api } from '../services/api';
import type { SearchE1RequestDto, SearchE1ResponseDto } from '../features/van-chuyen/types/vanChuyen.types';
import { speak } from '../utils/tts';

// Định nghĩa một Job
export interface PollingJob {
  id: string; // ID duy nhất từ params tìm kiếm, ví dụ: '8180-3'
  status: 'polling' | 'success' | 'failed' | 'success_empty';
  params: SearchE1RequestDto; // Sử dụng type đã định nghĩa
  data?: SearchE1ResponseDto;   // Sử dụng type đã định nghĩa
  message?: string; // Thông báo lỗi khi thất bại
  notified?: boolean; // Cờ để đánh dấu đã thông báo hay chưa
  read?: boolean; // Cờ để đánh dấu người dùng đã đọc
}

// Store để quản lý các jobs
interface BackgroundJobsState {
  jobs: Map<string, PollingJob>;
  jobToView: PollingJob | null; // State để lưu job cần xem lại
  startJob: (params: SearchE1RequestDto) => void;
  clearJob: (jobId: string) => void;
  setJobToView: (job: PollingJob) => void; // Hàm để kích hoạt xem lại
  clearViewedJob: () => void; // Hàm để reset state sau khi đã xem
  markJobAsNotified: (jobId: string) => void; // Hàm để đánh dấu đã thông báo
  markJobAsRead: (jobId: string) => void; // Đánh dấu một job đã đọc
  clearCompletedJobs: () => void; // Hàm mới để xóa các job đã hoàn thành
}

const pollForData = (params: SearchE1RequestDto, retriesLeft: number, onComplete: (result: SearchE1ResponseDto | null, error?: string) => void) => {
  if (retriesLeft === 0) {
    // Thay vì báo lỗi chung, trả về một mã đặc biệt để biết là đã timeout
    onComplete(null, "TIMEOUT_NO_DATA");
    return;
  }

  setTimeout(async () => {
    try {
      const response = await searchE1Api({ ...params, isPolling: true }); 
      
      if (response.status === 'SUCCESS' && response.data && response.data.length > 0) {
        onComplete(response);
      } else { // Đối với PENDING, FAILED, hoặc SUCCESS nhưng data rỗng, chúng ta tiếp tục polling.
        pollForData(params, retriesLeft - 1, onComplete);
      }
    } catch (error: any) {
        // Nếu có lỗi mạng hoặc lỗi server, coi đây là một thất bại thực sự.
        onComplete(null, error.message || 'Lỗi hệ thống trong quá trình polling.');
    }
  }, 5000);
};


export const useBackgroundJobsStore = create<BackgroundJobsState>((set) => ({
  jobs: new Map<string, PollingJob>(),
  jobToView: null,

  startJob: (params) => {
    // Tạo ID duy nhất bằng cách mã hóa các tham số tìm kiếm chính
    const uniqueParams = {
      fromDate: params.fromDate?.toISOString(),
      toDate: params.toDate?.toISOString(),
      mabcDong: params.mabcDong,
      mabcNhan: params.mabcNhan,
      chthu: params.chthu,
      tuiso: params.tuiso,
      khoiluong: params.khoiluong,
    };
    const jobId = JSON.stringify(uniqueParams);
    
    // Thông báo bắt đầu
    speak('Bắt đầu đồng bộ dữ liệu E1.');

    set((state) => {
      const newJobs = new Map(state.jobs);
      newJobs.set(jobId, { id: jobId, status: 'polling', params, notified: false, read: false });
      return { jobs: newJobs };
    });

    // Tăng số lần thử lên 12 (tổng 60 giây) và áp dụng logic polling mới
    pollForData(params, 12, (result, error) => {
      set((state) => {
        const newJobs = new Map(state.jobs);
        const currentJob = newJobs.get(jobId);
        if(currentJob){
            if (result) {
                newJobs.set(jobId, { ...currentJob, status: 'success', data: result });
                speak('Đồng bộ E1 hoàn tất.');
            } else if (error === 'TIMEOUT_NO_DATA') {
                newJobs.set(jobId, { ...currentJob, status: 'success_empty', message: 'Đồng bộ hoàn tất, không có dữ liệu.' });
                speak('Đồng bộ E1 hoàn tất, không có dữ liệu mới.');
            } else {
                newJobs.set(jobId, { ...currentJob, status: 'failed', message: error });
                speak('Đồng bộ E1 thất bại.');
            }
        }
        return { jobs: newJobs };
      });
    });
  },

  clearJob: (jobId: string) => set((state) => {
    const newJobs = new Map(state.jobs);
    newJobs.delete(jobId);
    return { jobs: newJobs };
  }),

  setJobToView: (job) => set({ jobToView: job }),

  clearViewedJob: () => set({ jobToView: null }),

  markJobAsNotified: (jobId) => set((state) => {
    const newJobs = new Map(state.jobs);
    const job = newJobs.get(jobId);
    if (job) {
      newJobs.set(jobId, { ...job, notified: true });
    }
    return { jobs: newJobs };
  }),

  markJobAsRead: (jobId) => set((state) => {
    const newJobs = new Map(state.jobs);
    const job = newJobs.get(jobId);
    if (job) {
      newJobs.set(jobId, { ...job, read: true });
    }
    return { jobs: newJobs };
  }),

  clearCompletedJobs: () => set((state) => {
    const newJobs = new Map<string, PollingJob>();
    state.jobs.forEach((job, id) => {
      // Chỉ giữ lại các job đang chạy hoặc thất bại
      if (job.status !== 'success' && job.status !== 'success_empty') {
        newJobs.set(id, job);
      }
    });
    // Nếu job đang xem bị xóa, cũng clear nó khỏi view
    const jobToViewWasCleared = state.jobToView && (state.jobToView.status === 'success' || state.jobToView.status === 'success_empty');
    if (jobToViewWasCleared) {
      return { jobs: newJobs, jobToView: null };
    }
    return { jobs: newJobs };
  }),
})); 