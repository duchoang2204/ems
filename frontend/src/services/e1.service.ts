import { searchE1, getE1Details, exportE1ToExcel } from '../api/e1Api';
import type { E1SearchParams } from '../types';

export class E1Service {
  static async search(params: E1SearchParams) {
    try {
      const response = await searchE1(params);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async getDetails(mae1: string) {
    try {
      const response = await getE1Details(mae1);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async exportToExcel(params: E1SearchParams) {
    try {
      const response = await exportE1ToExcel(params);
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      
      // Get the filename from the response headers or use a default
      const contentDisposition = response.headers['content-disposition'];
      const fileName = contentDisposition
        ? contentDisposition.split('filename=')[1].replace(/"/g, '')
        : `e1_export_${new Date().toISOString().split('T')[0]}.xlsx`;
      
      // Create and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      window.URL.revokeObjectURL(url);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private static handleError(error: any) {
    console.error('E1Service Error:', error);
    if (error.response) {
      // Server error response
      return new Error(error.response.data.message || 'Có lỗi xảy ra từ server');
    } else if (error.request) {
      // No response from server
      return new Error('Không thể kết nối đến server');
    }
    // Other errors
    return new Error('Có lỗi xảy ra, vui lòng thử lại');
  }
} 