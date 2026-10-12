import { collection, query, getDocs, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Employee, Attendance, LeaveRequest, Payroll } from '../models/hr';
import { db } from '../../../core/firebase/firebaseConfig';

class HrService {
  async getEmployees(): Promise<Employee[]> {
    if (!db) throw new Error("Firestore is not initialized");
    const q = query(collection(db, 'hr_employees'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Employee));
  }

  async getAttendance(): Promise<Attendance[]> {
    if (!db) throw new Error("Firestore is not initialized");
    const q = query(collection(db, 'hr_attendance'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Attendance));
  }

  async getLeaveRequests(): Promise<LeaveRequest[]> {
    if (!db) throw new Error("Firestore is not initialized");
    const q = query(collection(db, 'hr_leaves'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LeaveRequest));
  }

  async getPayroll(): Promise<Payroll[]> {
    if (!db) throw new Error("Firestore is not initialized");
    const q = query(collection(db, 'hr_payroll'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Payroll));
  }

  async addEmployee(employeeData: Omit<Employee, 'id'>): Promise<Employee> {
    if (!db) throw new Error("Firestore is not initialized");
    const newEmployee: Employee = {
      ...employeeData,
      id: `emp_${Date.now()}`
    };
    await setDoc(doc(db, 'hr_employees', newEmployee.id), newEmployee);
    return newEmployee;
  }

  async updateEmployee(id: string, data: Partial<Employee>): Promise<void> {
    if (!db) throw new Error("Firestore is not initialized");
    await updateDoc(doc(db, 'hr_employees', id), data);
  }

  async deleteEmployee(id: string): Promise<void> {
    if (!db) throw new Error("Firestore is not initialized");
    await deleteDoc(doc(db, 'hr_employees', id));
  }
}

export const hrService = new HrService();
