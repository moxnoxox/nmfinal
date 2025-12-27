import React from 'react';

const Sidebar = ({ selectedTrashCan, onClose, onReport }) => {
    if (!selectedTrashCan) return null;

    return (
        <div className="sidebar">
            <button className="close-btn" onClick={onClose}>&times;</button>
            <div className="sidebar-content">
                <h2>{selectedTrashCan.type} Trash Can</h2>
                <img src={selectedTrashCan.image} alt="Trash Can" className="trash-img" />
                <p><strong>Location:</strong> {selectedTrashCan.description}</p>
                <p><strong>Coordinates:</strong> {selectedTrashCan.lat.toFixed(4)}, {selectedTrashCan.lng.toFixed(4)}</p>
                <button className="report-btn" onClick={() => onReport(selectedTrashCan)}>Report Issue</button>
            </div>
        </div>
    );
};

export default Sidebar;
