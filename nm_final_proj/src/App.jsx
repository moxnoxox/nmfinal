import React, { useState } from 'react';
import MapComponent from './components/MapComponent';
import Sidebar from './components/Sidebar';
import ReportModal from './components/ReportModal';
import NewTrashCanModal from './components/NewTrashCanModal';
import { trashCanData as initialData } from './data/trashCanData';
import './App.css';


function App() {
  const [trashCans, setTrashCans] = useState(initialData);
  const [selectedTrashCan, setSelectedTrashCan] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportingTrashCan, setReportingTrashCan] = useState(null);

  // New Trash Can State
  const [isNewTrashCanModalOpen, setIsNewTrashCanModalOpen] = useState(false);
  const [newTrashCanLocation, setNewTrashCanLocation] = useState(null);
  const [isAddingMode, setIsAddingMode] = useState(false);

  const handleSelectTrashCan = (trashCan) => {
    setSelectedTrashCan(trashCan);
  };

  const handleCloseSidebar = () => {
    setSelectedTrashCan(null);
  };

  const handleOpenReportModal = (trashCan) => {
    setReportingTrashCan(trashCan);
    setIsReportModalOpen(true);
  };

  const handleCloseReportModal = () => {
    setIsReportModalOpen(false);
    setReportingTrashCan(null);
  };

  // Step 1: Start Adding Mode
  const handleStartAddTrashCan = (location) => {
    setNewTrashCanLocation(location);
    setIsAddingMode(true);
    setSelectedTrashCan(null); // Deselect any existing
  };

  // Step 2: Confirm Location
  const handleConfirmLocation = () => {
    setIsAddingMode(false);
    setIsNewTrashCanModalOpen(true);
  };

  const handleCancelAdd = () => {
    setIsAddingMode(false);
    setNewTrashCanLocation(null);
  };

  const handleAddingLocationChange = (latLng) => {
    setNewTrashCanLocation(latLng);
  };

  const handleCloseNewTrashCanModal = () => {
    setIsNewTrashCanModalOpen(false);
    setNewTrashCanLocation(null);
  };

  const handleAddNewTrashCan = (data) => {
    const newTrashCan = {
      id: trashCans.length + 1,
      ...data,
      // image handled in data
    };

    setTrashCans([...trashCans, newTrashCan]);
    alert('New trash can added successfully!');
    handleCloseNewTrashCanModal();
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Street Trash Can Map</h1>
      </header>
      <div className="main-content">
        <MapComponent
          trashCans={trashCans}
          onSelectTrashCan={handleSelectTrashCan}
          selectedTrashCan={selectedTrashCan}
          onAddTrashCan={handleStartAddTrashCan}
          isAddingMode={isAddingMode}
          addingLocation={newTrashCanLocation}
          onAddingLocationChange={handleAddingLocationChange}
        />
        <Sidebar
          selectedTrashCan={selectedTrashCan}
          onClose={handleCloseSidebar}
          onReport={handleOpenReportModal}
        />

        {isAddingMode && (
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            backgroundColor: 'white',
            padding: '10px 20px',
            borderRadius: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            display: 'flex',
            gap: '10px',
            alignItems: 'center'
          }}>
            <span style={{ color: 'black', fontWeight: 'bold', minWidth: '200px', textAlign: 'center' }}>Move the pin to adjust its position</span>
            <button
              onClick={handleConfirmLocation}
              style={{
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                padding: '5px 15px',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Confirm
            </button>
            <button
              onClick={handleCancelAdd}
              style={{
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                padding: '5px 15px',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        )}

        {reportingTrashCan && (
          <ReportModal
            isOpen={isReportModalOpen}
            onClose={handleCloseReportModal}
            trashCanId={reportingTrashCan.id}
          />
        )}
        {newTrashCanLocation && isNewTrashCanModalOpen && (
          <NewTrashCanModal
            isOpen={isNewTrashCanModalOpen}
            onClose={handleCloseNewTrashCanModal}
            location={newTrashCanLocation}
            onSubmit={handleAddNewTrashCan}
          />
        )}
      </div>
    </div>
  );
}

export default App;