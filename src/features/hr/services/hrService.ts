import { collection, query, getDocs, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Employee, Attendance, LeaveRequest, Payroll } from '../models/hr';
import { db } from '../../../core/firebase/firebaseConfig';

class HrService {
  private localEmployees: Employee[] = [
    {
      id: 'emp_1',
      employeeId: 'EMP001',
      firstName: 'Ramesh',
      lastName: 'Kumar',
      email: 'ramesh.chef@talkos.app',
      phone: '+91 98765 43210',
      designation: 'Head Chef',
      department: 'KITCHEN',
      basicSalary: 35000,
      status: 'ACTIVE',
      dateOfJoining: new Date().toISOString()
    },
    {
      id: 'emp_2',
      employeeId: 'EMP002',
      firstName: 'Sunita',
      lastName: 'Sharma',
      email: 'sunita.cashier@talkos.app',
      phone: '+91 98765 43211',
      designation: 'Cashier',
      department: 'FRONT_OF_HOUSE',
      basicSalary: 25000,
      status: 'ACTIVE',
      dateOfJoining: new Date().toISOString()
    }
  ];

  async getEmployees(): Promise<Employee[]> {
    if (!db) return this.localEmployees;
    try {
      const q = query(collection(db, 'hr_employees'));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Employee));
      }
      return this.localEmployees;
    } catch (err) {
      console.warn("Using local employees fallback:", err);
      return this.localEmployees;
    }
  }

  async getAttendance(): Promise<Attendance[]> {
    if (!db) return [];
    try {
      const q = query(collection(db, 'hr_attendance'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Attendance));
    } catch (err) {
      return [];
    }
  }

  async getLeaveRequests(): Promise<LeaveRequest[]> {
    if (!db) return [];
    try {
      const q = query(collection(db, 'hr_leaves'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LeaveRequest));
    } catch (err) {
      return [];
    }
  }

  async getPayroll(): Promise<Payroll[]> {
    if (!db) return [];
    try {
      const q = query(collection(db, 'hr_payroll'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Payroll));
    } catch (err) {
      return [];
    }
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
