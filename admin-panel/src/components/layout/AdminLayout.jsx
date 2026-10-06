import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import Topbar from './Topbar';
import Toast from '../common/Toast';
import { useAdmin } from '../../context/AdminContext';

export default function AdminLayout() {
  const { sidebarCollapsed } = useAdmin();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      {/* Fixed Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div
        style={{
          flex: 1,
          marginLeft: sidebarCollapsed ? '72px' : '260px',
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          transition: 'margin-left 220ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Sticky Topbar */}
        <Topbar />

        {/* Page Container */}
        <main
          style={{
            flex: 1,
            padding: '28px 32px',
            maxWidth: '1600px',
            width: '100%',
            boxSizing: 'border-box',
            margin: '0 auto',
          }}
        >
          <Outlet />
        </main>
      </div>

      {/* Global Toast Notifications */}
      <Toast />
    </div>
  );
}
