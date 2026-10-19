import React, { useEffect, useState } from 'react';
import { useTableStore } from '../store/tableStore';
import { Plus, Users, Calendar, ListTodo, Armchair, X, QrCode } from 'lucide-react';
import { Table, TableStatus } from '../models/table';
import { ReservationList } from '../components/ReservationList';
import { WaitlistList } from '../components/WaitlistList';
import { TableQrModal } from '../components/TableQrModal';

type SidebarView = 'NONE' | 'RESERVATIONS' | 'WAITLIST';

export function TableManagementPage() {
  const { floors, tables, loadData, updateTableStatus, updateTablePosition } = useTableStore();
  const [activeFloorId, setActiveFloorId] = useState<string>('');
  const [sidebarView, setSidebarView] = useState<SidebarView>('NONE');
  const [selectedQrTable, setSelectedQrTable] = useState<Table | null>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState<boolean>(false);
  
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    loadData(today);
  }, [loadData]);
  
  useEffect(() => {
    if (floors.length > 0 && !activeFloorId) {
      setActiveFloorId(floors[0].id);
    }
  }, [floors, activeFloorId]);

  const activeTables = tables.filter(t => t.floorId === activeFloorId);
  
  const [draggedTableId, setDraggedTableId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedTableId(id);
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedTableId) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, e.clientX - rect.left - 30);
    const y = Math.max(0, e.clientY - rect.top - 30);
    
    await updateTablePosition(draggedTableId, x, y);
    setDraggedTableId(null);
  };

  const getStatusColor = (status: TableStatus) => {
    switch(status) {
      case 'AVAILABLE': return 'bg-green-100 border-green-500 text-green-800 dark:bg-green-900/30 dark:border-green-400 dark:text-green-400';
      case 'RESERVED': return 'bg-amber-100 border-amber-500 text-amber-800 dark:bg-amber-900/30 dark:border-amber-400 dark:text-amber-400';
      case 'OCCUPIED': return 'bg-red-100 border-red-500 text-red-800 dark:bg-red-900/30 dark:border-red-400 dark:text-red-400';
      case 'CLEANING': return 'bg-blue-100 border-blue-500 text-blue-800 dark:bg-blue-900/30 dark:border-blue-400 dark:text-blue-400';
      default: return 'bg-slate-100 border-slate-500 text-slate-800 dark:bg-slate-800 dark:border-slate-500 dark:text-slate-300';
    }
  };

  return (
    <div className="p-6 h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Table Management</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage floors, tables, and reservations</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => {
              setSelectedQrTable(activeTables[0] || null);
              setIsQrModalOpen(true);
            }}
            className="px-4 py-2 rounded-md flex items-center transition-colors shadow-sm text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <QrCode className="w-4 h-4 mr-2" /> QR Table Stands
          </button>
          <button 
            onClick={() => setSidebarView(sidebarView === 'WAITLIST' ? 'NONE' : 'WAITLIST')}
            className={`px-4 py-2 rounded-md flex items-center transition-colors shadow-sm text-sm font-medium ${
              sidebarView === 'WAITLIST' 
                ? 'bg-amber-600 text-white' 
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            <ListTodo className="w-4 h-4 mr-2" /> Waitlist
          </button>
          <button 
            onClick={() => setSidebarView(sidebarView === 'RESERVATIONS' ? 'NONE' : 'RESERVATIONS')}
            className={`px-4 py-2 rounded-md flex items-center transition-colors shadow-sm text-sm font-medium ${
              sidebarView === 'RESERVATIONS'
                ? 'bg-indigo-600 text-white'
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Calendar className="w-4 h-4 mr-2" /> Reservations
          </button>
        </div>
      </div>
      
      <div className="flex flex-1 gap-4 min-h-0">
        {/* Main Floor Plan Area */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* Floor selector */}
          <div className="flex space-x-2 mb-4 shrink-0 overflow-x-auto pb-1">
            {floors.map(floor => (
              <button
                key={floor.id}
                onClick={() => setActiveFloorId(floor.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors shrink-0 ${
                  activeFloorId === floor.id 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm'
                }`}
              >
                {floor.name}
              </button>
            ))}
            <button className="px-4 py-2 rounded-md text-sm font-medium text-slate-500 dark:text-slate-400 border border-dashed border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center transition-colors shrink-0">
              <Plus className="w-4 h-4 mr-1" /> Add Floor
            </button>
          </div>

          {/* Floor Map Area */}
          <div className="flex-1 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden relative shadow-inner">
            <div 
              className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px]"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {activeTables.map(table => (
                <div
                  key={table.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, table.id)}
                  className={`group absolute cursor-move border-2 shadow-sm flex flex-col items-center justify-center transition-colors user-select-none hover:shadow-md ${getStatusColor(table.status)}`}
                  style={{
                    left: table.positionX,
                    top: table.positionY,
                    width: table.width,
                    height: table.height,
                    borderRadius: table.shape === 'ROUND' ? '50%' : '0.5rem'
                  }}
                  onClick={() => {
                    const statuses: TableStatus[] = ['AVAILABLE', 'RESERVED', 'OCCUPIED', 'CLEANING'];
                    const nextStatus = statuses[(statuses.indexOf(table.status) + 1) % statuses.length];
                    updateTableStatus(table.id, nextStatus);
                  }}
                >
                  <span className="font-bold text-lg">{table.tableNumber}</span>
                  <div className="flex items-center text-xs opacity-80 mt-1 font-medium">
                    <Users className="w-3 h-3 mr-1" /> {table.capacity}
                  </div>
                  {/* Quick QR button on hover */}
                  <button
                    type="button"
                    title="View & Print Table QR Code"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedQrTable(table);
                      setIsQrModalOpen(true);
                    }}
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-1 bg-white/90 dark:bg-slate-900/90 text-indigo-600 rounded-md shadow-xs hover:scale-110 transition-all"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            
            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-lg p-3 shadow-lg pointer-events-none">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Status Legend</div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div> Available</div>
                <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div> Reserved</div>
                <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div> Occupied</div>
                <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div> Cleaning</div>
              </div>
            </div>
            
            {/* Controls */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <button className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 rounded-lg shadow-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors tooltip" title="Add Table">
                <Armchair className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Panel */}
        {sidebarView !== 'NONE' && (
          <div className="w-96 shrink-0 flex flex-col transition-all duration-300 ease-in-out">
            <div className="flex justify-end mb-2">
              <button 
                onClick={() => setSidebarView('NONE')}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 min-h-0">
              {sidebarView === 'RESERVATIONS' && <ReservationList />}
              {sidebarView === 'WAITLIST' && <WaitlistList />}
            </div>
          </div>
        )}
      </div>

      {/* Table QR Stand Generator Modal */}
      <TableQrModal 
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        table={selectedQrTable}
        floor={floors.find(f => f.id === activeFloorId)}
        allTables={activeTables}
      />
    </div>
  );
}
