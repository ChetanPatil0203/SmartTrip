import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Bus,
  Train,
  Plane,
  Building2,
  Car,
  Plus,
  Edit,
  Trash2,
  Eye,
  Filter,
  CheckCircle2,
  AlertCircle,
  Download,
  Layers,
  ArrowRight,
} from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import DataTable from '../components/common/DataTable';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';
import ConfirmationDialog from '../components/common/ConfirmationDialog';
import { useAdmin } from '../context/AdminContext';
import { colors } from '../styles/tokens';

export default function TravelManagementPage() {
  const { mode: urlMode } = useParams();
  const navigate = useNavigate();
  const { travelData, setTravelData, showToast, logAudit } = useAdmin();

  // Active travel category (bus | train | flight | hotel | cab | auto)
  const activeMode = urlMode || 'bus';

  // Sub-tabs for each category
  const subModulesMap = {
    bus: [
      { id: 'operators', label: 'Operators' },
      { id: 'buses', label: 'Buses' },
      { id: 'routes', label: 'Routes' },
      { id: 'schedules', label: 'Schedules' },
      { id: 'stops', label: 'Stops' },
      { id: 'seats', label: 'Seats' },
    ],
    train: [
      { id: 'operators', label: 'Operators' },
      { id: 'trains', label: 'Trains' },
      { id: 'stations', label: 'Stations' },
      { id: 'routes', label: 'Routes' },
      { id: 'schedules', label: 'Schedules' },
      { id: 'classes', label: 'Classes' },
      { id: 'seats', label: 'Seats' },
    ],
    flight: [
      { id: 'airlines', label: 'Airlines' },
      { id: 'airports', label: 'Airports' },
      { id: 'flights', label: 'Flights' },
      { id: 'schedules', label: 'Schedules' },
      { id: 'seats', label: 'Seats' },
      { id: 'addons', label: 'Add-ons' },
    ],
    hotel: [
      { id: 'hotels', label: 'Hotels' },
      { id: 'rooms', label: 'Rooms' },
      { id: 'amenities', label: 'Amenities' },
      { id: 'availability', label: 'Availability' },
    ],
    cab: [
      { id: 'providers', label: 'Providers' },
      { id: 'types', label: 'Cab Types' },
      { id: 'cabs', label: 'Cabs' },
      { id: 'drivers', label: 'Drivers' },
      { id: 'locations', label: 'Locations' },
      { id: 'availability', label: 'Availability' },
    ],
    auto: [
      { id: 'providers', label: 'Providers' },
      { id: 'types', label: 'Auto Types' },
      { id: 'autos', label: 'Autos' },
      { id: 'drivers', label: 'Drivers' },
      { id: 'serviceAreas', label: 'Service Areas' },
      { id: 'availability', label: 'Availability' },
    ],
  };

  const currentSubModules = subModulesMap[activeMode] || subModulesMap.bus;
  const [activeSub, setActiveSub] = useState(currentSubModules[0].id);

  // Sync sub tab when category changes
  useEffect(() => {
    if (subModulesMap[activeMode]) {
      setActiveSub(subModulesMap[activeMode][0].id);
    }
  }, [activeMode]);

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit' | 'view'
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  // Delete Confirmation
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, item: null });

  // Get active dataset
  const activeDataset = travelData[activeMode]?.[activeSub] || [];

  // Generate dynamic columns based on item keys
  const getColumns = () => {
    if (!activeDataset.length) return [];
    const sample = activeDataset[0];
    const keys = Object.keys(sample);

    const generated = keys.map((key) => {
      // Header formatting
      const header = key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str) => str.toUpperCase());

      return {
        header,
        accessor: key,
        render: (row) => {
          const val = row[key];
          if (key === 'status') {
            return <StatusBadge status={val} size="sm" />;
          }
          if (typeof val === 'boolean') {
            return (
              <span style={{ color: val ? '#059669' : '#DC2626', fontWeight: '600' }}>
                {val ? 'Yes' : 'No'}
              </span>
            );
          }
          if (typeof val === 'number' && (key.toLowerCase().includes('fare') || key.toLowerCase().includes('price'))) {
            return <strong style={{ color: '#0F172A' }}>₹{val.toLocaleString()}</strong>;
          }
          return <span>{String(val ?? '—')}</span>;
        },
      };
    });

    // Add Actions column
    generated.push({
      header: 'Actions',
      accessor: '_actions',
      sortable: false,
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            type="button"
            onClick={() => handleOpenModal('view', row)}
            className="st-btn st-btn-secondary st-btn-sm"
            style={{ padding: '4px 7px' }}
            title="View Details"
          >
            <Eye size={13} />
          </button>
          <button
            type="button"
            onClick={() => handleOpenModal('edit', row)}
            className="st-btn st-btn-secondary st-btn-sm"
            style={{ padding: '4px 7px' }}
            title="Edit Record"
          >
            <Edit size={13} />
          </button>
          <button
            type="button"
            onClick={() => setDeleteDialog({ isOpen: true, item: row })}
            className="st-btn st-btn-danger st-btn-sm"
            style={{ padding: '4px 7px' }}
            title="Delete Record"
          >
            <Trash2 size={13} />
          </button>
        </div>
      ),
    });

    return generated;
  };

  const handleOpenModal = (type, item = null) => {
    setModalMode(type);
    setEditingItem(item);
    if (item) {
      setFormData({ ...item });
    } else {
      const template = {};
      if (activeDataset.length > 0) {
        Object.keys(activeDataset[0]).forEach((k) => {
          template[k] = k === 'id' ? `${activeMode.toUpperCase().slice(0, 3)}-${Date.now().toString().slice(-3)}` : '';
        });
      }
      setFormData(template);
    }
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (modalMode === 'add') {
      const updatedList = [formData, ...activeDataset];
      setTravelData((prev) => ({
        ...prev,
        [activeMode]: {
          ...prev[activeMode],
          [activeSub]: updatedList,
        },
      }));
      showToast(`Record added to ${activeMode.toUpperCase()} ${activeSub}`, 'success');
      logAudit('CREATE_TRAVEL_RECORD', `Travel (${activeMode})`, `${activeSub}: ${formData.id || 'New'}`);
    } else if (modalMode === 'edit') {
      const updatedList = activeDataset.map((item) =>
        item.id === editingItem.id ? { ...formData } : item
      );
      setTravelData((prev) => ({
        ...prev,
        [activeMode]: {
          ...prev[activeMode],
          [activeSub]: updatedList,
        },
      }));
      showToast(`Record ${editingItem.id} updated successfully`, 'success');
      logAudit('UPDATE_TRAVEL_RECORD', `Travel (${activeMode})`, `${activeSub}: ${editingItem.id}`);
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (!deleteDialog.item) return;
    const updatedList = activeDataset.filter((item) => item.id !== deleteDialog.item.id);
    setTravelData((prev) => ({
      ...prev,
      [activeMode]: {
        ...prev[activeMode],
        [activeSub]: updatedList,
      },
    }));
    showToast(`Record ${deleteDialog.item.id} deleted from ${activeSub}`, 'info');
    logAudit('DELETE_TRAVEL_RECORD', `Travel (${activeMode})`, `${activeSub}: ${deleteDialog.item.id}`);
    setDeleteDialog({ isOpen: false, item: null });
  };

  const travelModes = [
    {
      id: 'bus',
      label: 'Bus',
      icon: Bus,
      color: '#D13239',
      bgLight: '#FFF0F0',
      description: '45+ operators • 1,200 schedules',
    },
    {
      id: 'train',
      label: 'Train',
      icon: Train,
      color: '#2563EB',
      bgLight: '#EFF6FF',
      description: 'Central & Western Railway lines',
    },
    {
      id: 'flight',
      label: 'Flight',
      icon: Plane,
      color: '#0284C7',
      bgLight: '#F0F9FF',
      description: 'BOM, DEL, BLR, GOI airports',
    },
    {
      id: 'hotel',
      label: 'Hotels',
      icon: Building2,
      color: '#059669',
      bgLight: '#ECFDF5',
      description: 'Resorts & boutique properties',
    },
    {
      id: 'cab',
      label: 'Cabs',
      icon: Car,
      color: '#475569',
      bgLight: '#F8FAFC',
      description: 'Prime sedans, SUVs & EVs',
    },
    {
      id: 'auto',
      label: 'Auto',
      icon: Car, // Using clean car/vehicle icon
      color: '#D97706',
      bgLight: '#FFFBEB',
      description: 'Metro unions & EV autos',
    },
  ];

  return (
    <div>
      <PageHeader
        title="Travel Management Console"
        subtitle="Configure operators, vehicles, routes, schedules, stops, seat inventory, and fares"
        breadcrumbs={[{ label: 'Travel Management' }, { label: activeMode.toUpperCase() }]}
        actions={
          <button
            type="button"
            onClick={() => handleOpenModal('add')}
            className="st-btn st-btn-primary"
          >
            <Plus size={16} />
            <span>Add New {activeSub.slice(0, -1) || 'Record'}</span>
          </button>
        }
      />

      {/* Primary Transport Mode Selector Cards (Displayed prominently in the center of the page) */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Select Transport Network
          </span>
          <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
            Currently managing: <strong style={{ color: '#D13239', textTransform: 'uppercase' }}>{activeMode}</strong>
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '14px',
          }}
        >
          {travelModes.map((tm) => {
            const Icon = tm.icon;
            const isActive = activeMode === tm.id;

            return (
              <div
                key={tm.id}
                onClick={() => navigate(`/travel/${tm.id}`)}
                className="st-card st-card-hover"
                style={{
                  padding: '16px 18px',
                  cursor: 'pointer',
                  borderRadius: '14px',
                  border: isActive ? `2px solid ${tm.color}` : '1px solid #E2E8F0',
                  backgroundColor: isActive ? tm.bgLight : '#FFFFFF',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 180ms ease',
                  boxShadow: isActive ? '0 6px 16px rgba(0,0,0,0.06)' : undefined,
                }}
              >
                {/* Active Highlight Top Strip */}
                {isActive && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      backgroundColor: tm.color,
                    }}
                  />
                )}

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      backgroundColor: isActive ? tm.color : '#F1F5F9',
                      color: isActive ? '#FFFFFF' : tm.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 150ms ease',
                    }}
                  >
                    <Icon size={20} strokeWidth={2.4} />
                  </div>

                  {isActive && (
                    <span
                      style={{
                        fontSize: '0.6875rem',
                        fontWeight: '800',
                        color: tm.color,
                        backgroundColor: '#FFFFFF',
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        border: `1px solid ${tm.color}40`,
                      }}
                    >
                      ACTIVE
                    </span>
                  )}
                </div>

                <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0F172A', lineHeight: 1.2 }}>
                  {tm.label}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px', lineHeight: 1.3 }}>
                  {tm.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sub-module Pills (Operators, Buses, Routes, Schedules, Stops, Seats, etc.) */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {activeMode.toUpperCase()} Modules & Data Tables
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px',
            backgroundColor: '#FFFFFF',
            borderRadius: '10px',
            border: '1px solid #E2E8F0',
            overflowX: 'auto',
          }}
        >
          {currentSubModules.map((sub) => {
            const isSelected = activeSub === sub.id;
            return (
              <button
                key={sub.id}
                type="button"
                onClick={() => setActiveSub(sub.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '7px',
                  border: 'none',
                  backgroundColor: isSelected ? '#0F172A' : 'transparent',
                  color: isSelected ? '#FFFFFF' : '#64748B',
                  fontWeight: isSelected ? '800' : '600',
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                  transition: 'all 140ms ease',
                  whiteSpace: 'nowrap',
                }}
              >
                {sub.label}
                <span
                  style={{
                    marginLeft: '8px',
                    fontSize: '0.6875rem',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : '#F1F5F9',
                    color: isSelected ? '#FFFFFF' : '#64748B',
                    fontWeight: '700',
                  }}
                >
                  {travelData[activeMode]?.[sub.id]?.length || 0}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Reusable DataTable for Active Sub-module */}
      <DataTable
        columns={getColumns()}
        data={activeDataset}
        searchPlaceholder={`Search ${activeMode} ${activeSub}...`}
        exportFileName={`smarttrip_${activeMode}_${activeSub}`}
        pageSize={8}
      />

      {/* Add / Edit / View Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          modalMode === 'add'
            ? `Add New ${activeSub.slice(0, -1) || 'Record'}`
            : modalMode === 'edit'
            ? `Edit ${formData.id || 'Record'}`
            : `View ${formData.id || 'Record'} Details`
        }
        subtitle={`${activeMode.toUpperCase()} > ${activeSub.toUpperCase()}`}
        maxWidth="520px"
        footer={
          modalMode !== 'view' ? (
            <>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="st-btn st-btn-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="st-btn st-btn-primary"
              >
                {modalMode === 'add' ? 'Create Record' : 'Save Changes'}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="st-btn st-btn-secondary"
            >
              Close
            </button>
          )
        }
      >
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {Object.keys(formData).map((key) => {
            const isReadOnly = modalMode === 'view' || (key === 'id' && modalMode === 'edit');
            return (
              <div key={key}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    color: '#475569',
                    marginBottom: '4px',
                    textTransform: 'uppercase',
                  }}
                >
                  {key}
                </label>
                <input
                  type="text"
                  disabled={isReadOnly}
                  value={formData[key] ?? ''}
                  onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                  className="st-input"
                  style={{
                    backgroundColor: isReadOnly ? '#F8FAFC' : '#FFFFFF',
                    cursor: isReadOnly ? 'not-allowed' : 'text',
                  }}
                  required={key === 'id'}
                />
              </div>
            );
          })}
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, item: null })}
        onConfirm={handleDelete}
        title={`Delete ${deleteDialog.item?.id || 'Record'}?`}
        message={`Are you sure you want to permanently remove this record from ${activeMode.toUpperCase()} ${activeSub}? All linked schedules and seats may be affected.`}
        confirmText="Delete Permanently"
        isDanger={true}
      />
    </div>
  );
}
