import { create } from 'zustand';
import { Employee, Attendance, LeaveRequest, Payroll } from '../models/hr';
import { hrService } from '../services/hrService';

interface HrState {
  employees: Employee[];
  attendance: Attendance[];
  leaveRequests: LeaveRequest[];
  payroll: Payroll[];
  loading: boolean;
  error: string | null;

  loadAll: () => Promise<void>;
}

export const useHrStore = create<HrState>((set) => ({
  employees: [],
  attendance: [],
  leaveRequests: [],
  payroll: [],
  loading: false,
  error: null,

  loadAll: async () => {
    set({ loading: true, error: null });
    try {
      const [employees, attendance, leaveRequests, payroll] = await Promise.all([
        hrService.getEmployees(),
        hrService.getAttendance(),
        hrService.getLeaveRequests(),
        hrService.getPayroll()
      ]);
      set({ 
        employees, 
        attendance, 
        leaveRequests, 
        payroll,
        loading: false 
      });
    } catch (e: any) {
      set({ error: e.message, loading: false });
    }
  },
}));
