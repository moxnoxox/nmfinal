import React, { useState } from 'react';

const ReportModal = ({ isOpen, onClose, trashCanId }) => {
    const [issueType, setIssueType] = useState('full');
    const [description, setDescription] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate API call
        console.log(`Report submitted for trash can ${trashCanId}:`, { issueType, description });
        alert('Thank you! Your report has been submitted.');
        onClose();
        // Reset form
        setIssueType('usage');
        setDescription('');
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Report Issue</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="issueType">Issue Type:</label>
                        <select
                            id="issueType"
                            value={issueType}
                            onChange={(e) => setIssueType(e.target.value)}
                        >
                            <option value="usage">Can't Use</option>
                            <option value="damaged">Damaged/Broken</option>
                            <option value="missing">Missing</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description (Optional):</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="3"
                        />
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
                        <button type="submit" className="submit-btn">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReportModal;
