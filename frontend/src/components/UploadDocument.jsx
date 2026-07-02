import React, { useState } from 'react';
import { uploadNewDocument } from '../api/documents';

const UploadDocument = ({ onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [recipientEmail, setRecipientEmail] = useState('');
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type !== 'application/pdf') {
            setError('Validation Error: Only digital document assets in PDF format are supported.');
            setFile(null);
            return;
        }
        setError('');
        setFile(selectedFile);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

        if (!file) {
            setError('Please drop or select a target PDF document binary layout.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('recipient', recipientEmail); // Links contract metrics to a specific user context

        setUploading(true);
        try {
            await uploadNewDocument(formData);
            setSuccessMsg('Asset validation cleared. Contract parsed successfully into Ledger Core.');
            setFile(null);
            setRecipientEmail('');

            // Trigger automatic dashboard refresh hook if provided by parent context
            if (onUploadSuccess) onUploadSuccess();
        } catch (err) {
            setError(err.response?.data || 'An infrastructure streaming error broke file transmission.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div style={styles.uploadCard}>
            <h3 style={styles.cardTitle}>Provision Fresh Agreement Matrix</h3>
            <p style={styles.cardSubtitle}>Stage new electronic document flows directly into active verification pools.</p>

            {error && <div style={styles.errorBanner}>{error}</div>}
            {successMsg && <div style={styles.successBanner}>{successMsg}</div>}

            <form onSubmit={handleFormSubmit} style={styles.formLayout}>
                {/* File Drop/Selection Input Canvas Zone */}
                <div style={styles.dropZoneContainer}>
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        id="file-upload-input"
                        style={styles.hiddenInput}
                    />
                    <label htmlFor="file-upload-input" style={styles.dropZoneLabel}>
                        <span style={styles.uploadIcon}>📁</span>
                        {file ? (
                            <strong style={{ color: '#0f172a' }}>Selected: {file.name}</strong>
                        ) : (
                            <span>Drag file here or <strong style={{ color: '#2563eb' }}>browse filesystem</strong></span>
                        )}
                        <span style={styles.subLabelText}>Supported format standards: PDF up to 25MB</span>
                    </label>
                </div>

                {/* Recipient Constraint Designation Entry */}
                <div style={styles.inputGroup}>
                    <label style={styles.fieldLabel}>Designated Recipient (User Email):</label>
                    <input
                        type="email"
                        value={recipientEmail}
                        onChange={(e) => setRecipientEmail(e.target.value)}
                        placeholder="e.g., collaborator@firm.com"
                        required
                        style={styles.textInput}
                    />
                </div>

                <button
                    type="submit"
                    disabled={uploading}
                    style={{ ...styles.submitBtn, opacity: uploading ? 0.6 : 1 }}>
                    {uploading ? 'Streaming Matrix Packets...' : '🚀 Dispatch to Ledger Security'}
                </button>
            </form>
        </div>
    );
};

const styles = {
    uploadCard: { background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: '24px' },
    cardTitle: { margin: '0 0 4px 0', fontSize: '16px', fontWeight: '700', color: '#0f172a' },
    cardSubtitle: { margin: '0 0 20px 0', fontSize: '12px', color: '#64748b' },
    formLayout: { display: 'flex', flexDirection: 'column', gap: '16px' },
    hiddenInput: { display: 'none' },
    dropZoneContainer: { border: '2px dashed #cbd5e1', borderRadius: '8px', background: '#f8fafc', padding: '32px 16px', textAlign: 'center', transition: 'all 0.2s', cursor: 'pointer' },
    dropZoneLabel: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#475569' },
    uploadIcon: { fontSize: '28px' },
    subLabelText: { fontSize: '11px', color: '#94a3b8' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
    fieldLabel: { fontSize: '12px', fontWeight: '600', color: '#334155' },
    textInput: { padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', color: '#0f172a', outline: 'none', boxSizing: 'border-box' },
    submitBtn: { width: '100%', padding: '12px', background: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: '600', fontSize: '13px', cursor: 'pointer', transition: 'background 0.2s' },
    errorBanner: { padding: '10px 14px', background: '#fef2f2', border: '1px solid #fca5a5', color: '#b91c1c', borderRadius: '6px', fontSize: '12px', fontWeight: '500' },
    successBanner: { padding: '10px 14px', background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', borderRadius: '6px', fontSize: '12px', fontWeight: '500' }
};

export default UploadDocument;