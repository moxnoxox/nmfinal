
import React, { useState } from 'react';

const NewTrashCanModal = ({ isOpen, onClose, location, onSubmit }) => {
    const [type, setType] = useState('General');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    if (!isOpen) return null;

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            type,
            description,
            lat: location.lat,
            lng: location.lng,
            image: preview || 'https://via.placeholder.com/150'
        });
        // Reset form
        setType('General');
        setDescription('');
        setImage(null);
        setPreview(null);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Add New Trash Can</h2>
                <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
                    Location: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                </p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="type">Type:</label>
                        <select
                            id="type"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        >
                            <option value="General">General</option>
                            <option value="Recycle">Recycle</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description:</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="e.g., In front of the convenience store"
                            rows="3"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="image">Photo:</label>
                        <input
                            type="file"
                            id="image"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        {preview && (
                            <div style={{ marginTop: '10px' }}>
                                <img src={preview} alt="Preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '4px' }} />
                            </div>
                        )}
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
                        <button type="submit" className="submit-btn" style={{ backgroundColor: '#28a745' }}>Add</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewTrashCanModal;
