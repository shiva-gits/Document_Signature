import React, { useEffect, useState } from 'react';
import { fetchMyDocuments, updateDocumentStatus } from '../api/documents';
import SignatureWorkspace from './signatureWorkspace';
import UploadDocument from './UploadDocument';

const MainDashboard = () => {
    // Manage layout state variables dynamically
    const [documents, setDocuments] = useState([]);
    const [selectedDocId, setSelectedDocId] = useState(null);
    const [activeTab, setActiveTab] = useState('inbox'); // Default views: 'inbox', 'workspace', or 'upload'
    const [rejectionReason, setRejectionReason] = useState('');
    const [showRejectionForm, setShowRejectionForm] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    // Pull token data automatically from localStorage
    const token = localStorage.getItem('token');
    const userEmail = localStorage.getItem('userEmail') || 'User Profile';

    useEffect(() => {
        loadWorkspaceLedger();
    }, []);

    const loadWorkspaceLedger = async () => {
        try {
            const data = await fetchMyDocuments();
            setDocuments(data);
            setLoading(false);
        } catch (err) {
            setError('Failed to extract active document ledger strings.');
            setLoading(false);
        }
    };

    const handleWorkflowStatusUpdate = async (statusTarget) => {
        setError('');
        if (statusTarget === 'REJECTED' && !rejectionReason.trim()) {
            setError('Validation Error: A clear textual reason context is required for contract declinations.');
            return;
        }

        try {
            await updateDocumentStatus(selectedDocId, statusTarget, rejectionReason);
            alert(`Document context successfully finalized as: ${statusTarget}`);

            // Clean interface states and refresh backend rows
            setShowRejectionForm(false);
            setRejectionReason('');
            setActiveTab('inbox');
            setSelectedDocId(null);
            loadWorkspaceLedger();
        } catch (err) {
            setError(err.response?.data || 'An infrastructure exception restricted the status transition.');
        }
    };

    const openDocumentWorkspace = (id) => {
        setSelectedDocId(id);
        setActiveTab('workspace'); // Auto switch viewport down onto the execution canvas
    };

    return (
        <div style={styles.dashboardContainer}>
            {/* 🧭 Main Executive Left Navigation Bar */}
            <aside style={styles.sidebarNav}>
                <div style={styles.brandWrapper}>
                    <div style={styles.brandLogo}>🖋️</div>
                    <div style={styles.brandTextContainer}>
                        <span style={styles.brandName}>SignLedger</span>
                        <span style={styles.brandSystemTag}>Enterprise Matrix v1.1</span>
                    </div>
                </div>

                <nav style={styles.navigationMenu}>
                    <div
                        onClick={() => setActiveTab('inbox')}
                        style={{ ...styles.navItem, ...(activeTab === 'inbox' ? styles.navItemActive : {}) }}>
                        <span style={styles.navIcon}>📁</span> Document Inbox
                    </div>
                    <div
                        onClick={() => selectedDocId && setActiveTab('workspace')}
                        style={{
                            ...styles.navItem,
                            ...((activeTab === 'workspace') ? styles.navItemActive : {}),
                            ...(!selectedDocId ? { opacity: 0.4, cursor: 'not-allowed' } : {})
                        }}>
                        <span style={styles.navIcon}>📋</span> Workspace Console
                    </div>
                    <div
                        onClick={() => setActiveTab('upload')}
                        style={{ ...styles.navItem, ...(activeTab === 'upload' ? styles.navItemActive : {}) }}>
                        <span style={styles.navIcon}>⚙️</span> System Setup
                    </div>
                    <div style={styles.navItem}><span style={styles.navIcon}>👥</span> Team Access</div>
                </nav>

                <div style={styles.profileFooter}>
                    <div style={styles.avatarCircle}>{userEmail.charAt(0).toUpperCase()}</div>
                    <div style={styles.profileMeta}>
                        <span style={styles.profileName} title={userEmail}>
                            {userEmail.length > 18 ? `${userEmail.substring(0, 15)}...` : userEmail}
                        </span>
                        <span style={styles.profileStatusBadge}>Session Token Verified</span>
                    </div>
                </div>
            </aside>

            {/* 💻 Primary Workspace Viewport Container Frame */}
            <div style={styles.mainContentFrame}>
                <header style={styles.topHeader}>
                    <div style={styles.headerTitleGroup}>
                        <h2 style={styles.headerTitle}>
                            {activeTab === 'inbox' && 'Document Inbox Ledger'}
                            {activeTab === 'workspace' && 'Agreement Matrix Setup Workspace'}
                            {activeTab === 'upload' && 'System Provisioning Engine'}
                        </h2>
                        <p style={styles.headerSubtitle}>
                            {activeTab === 'inbox' && 'Manage and process incoming secure document workflow items.'}
                            {activeTab === 'workspace' && `Deploy status action configurations onto Document ID Reference: ${selectedDocId}`}
                            {activeTab === 'upload' && 'Upload raw PDF templates and assign identity access records.'}
                        </p>
                    </div>
                    <div style={styles.headerActionCluster}>
                        <div style={styles.statusIndicatorPulse}></div>
                        <span style={styles.statusTextLabel}>Secure Gateway Online</span>
                    </div>
                </header>

                {/* Main Content Area */}
                <div style={styles.workspaceViewportWrapper}>
                    {error && <div style={styles.errorBanner}>{error}</div>}

                    {loading ? (
                        <div>Loading active database ledger files...</div>
                    ) : activeTab === 'inbox' ? (

                        /* VIEW A: RENDER DOCUMENT TABLE LISTING */
                        <div style={styles.tableCard}>
                            <table style={styles.table}>
                                <thead>
                                    <tr style={styles.tableHeaderRow}>
                                        <th style={styles.tableHeaderCell}>ID</th>
                                        <th style={styles.tableHeaderCell}>File Name</th>
                                        <th style={styles.tableHeaderCell}>Workflow Status</th>
                                        <th style={styles.tableHeaderCell}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {documents.map((doc) => (
                                        <tr key={doc.id} style={styles.tableBodyRow}>
                                            <td style={styles.tableCell}>{doc.id}</td>
                                            <td style={styles.tableCell}>{doc.fileName}</td>
                                            <td style={styles.tableCell}>
                                                <span style={{
                                                    ...styles.badge,
                                                    ...styles[doc.status] || styles.PENDING
                                                }}>
                                                    {doc.status || 'PENDING'}
                                                </span>
                                            </td>
                                            <td style={styles.tableCell}>
                                                <button
                                                    onClick={() => openDocumentWorkspace(doc.id)}
                                                    style={styles.actionBtn}>
                                                    Open Workspace
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {documents.length === 0 && (
                                        <tr>
                                            <td colSpan="4" style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                                                No signature document metrics assigned to your profile.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    ) : activeTab === 'upload' ? (

                        /* VIEW C: SYSTEM SETUP - UPLOAD FRESH CONTRACT TEMPLATES */
                        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
                            <UploadDocument onUploadSuccess={() => {
                                loadWorkspaceLedger();
                                setActiveTab('inbox'); // Return to list view after complete upload lifecycle
                            }} />
                        </div>
                    ) : (

                        /* VIEW B: INTEGRATE EXECUTABLE CANVAS WORKSPACE & CONTROLS */
                        <div style={styles.workspaceGrid}>
                            <div style={styles.canvasContainer}>
                                <SignatureWorkspace docId={selectedDocId} token={token} signerId={userEmail} />
                            </div>

                            <div style={styles.controlSidebar}>
                                <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', color: '#0f172a' }}>Execution Controls</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <button
                                        onClick={() => handleWorkflowStatusUpdate('SIGNED')}
                                        style={styles.signBtn}>
                                        🖋️ Execute Signature (Sign)
                                    </button>
                                    <button
                                        onClick={() => setShowRejectionForm(!showRejectionForm)}
                                        style={styles.rejectBtn}>
                                        ❌ Decline Document (Reject)
                                    </button>
                                </div>

                                {showRejectionForm && (
                                    <div style={styles.rejectionBox}>
                                        <label style={styles.fieldLabel}>Reason for Rejection Constraints:</label>
                                        <textarea
                                            value={rejectionReason}
                                            onChange={(e) => setRejectionReason(e.target.value)}
                                            placeholder="Provide exact revision requests text details..."
                                            rows="4"
                                            style={styles.textarea}
                                        />
                                        <button
                                            onClick={() => handleWorkflowStatusUpdate('REJECTED')}
                                            style={styles.submitRejectBtn}>
                                            Submit Declination Trace
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const styles = {
    dashboardContainer: { display: 'flex', width: '100vw', height: '100vh', background: '#f8fafc', overflow: 'hidden', fontFamily: '"Inter", "Segoe UI", sans-serif' },
    sidebarNav: { width: '260px', background: '#0f172a', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '24px 16px', color: '#ffffff', flexShrink: 0 },
    brandWrapper: { display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '24px', borderBottom: '1px solid #1e293b' },
    brandLogo: { fontSize: '24px', background: '#2563eb', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' },
    brandTextContainer: { display: 'flex', flexDirection: 'column' },
    brandName: { fontSize: '16px', fontWeight: '700', letterSpacing: '0.5px' },
    brandSystemTag: { fontSize: '10px', color: '#64748b', marginTop: '2px' },
    navigationMenu: { display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '24px', flexGrow: 1 },
    navItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '500', color: '#94a3b8', cursor: 'pointer', transition: 'all 0.2s' },
    navItemActive: { background: '#1e293b', color: '#ffffff', fontWeight: '600' },
    navIcon: { fontSize: '16px' },
    profileFooter: { display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '16px', borderTop: '1px solid #1e293b' },
    avatarCircle: { width: '36px', height: '36px', background: '#3b82f6', color: '#ffffff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px', flexShrink: 0 },
    profileMeta: { display: 'flex', flexDirection: 'column', overflow: 'hidden' },
    profileName: { fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
    profileStatusBadge: { fontSize: '10px', color: '#10b981', marginTop: '2px', fontWeight: '500' },
    mainContentFrame: { flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
    topHeader: { height: '70px', background: '#ffffff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', boxShadow: '0 1px 2px rgba(0,0,0,0.01)', flexShrink: 0 },
    headerTitleGroup: { display: 'flex', flexDirection: 'column' },
    headerTitle: { margin: 0, fontSize: '18px', fontWeight: '700', color: '#0f172a' },
    headerSubtitle: { margin: '2px 0 0 0', fontSize: '11px', color: '#64748b' },
    headerActionCluster: { display: 'flex', alignItems: 'center', gap: '8px', background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '6px 14px', borderRadius: '20px' },
    statusIndicatorPulse: { width: '8px', height: '8px', background: '#10b981', borderRadius: '50%' },
    statusTextLabel: { fontSize: '12px', fontWeight: '600', color: '#16a34a' },
    workspaceViewportWrapper: { flexGrow: 1, padding: '32px', overflowY: 'auto', background: '#f8fafc' },

    errorBanner: { padding: '12px 16px', background: '#fef2f2', border: '1px solid #fca5a5', color: '#b91c1c', borderRadius: '6px', marginBottom: '20px', fontSize: '13px', fontWeight: '500' },
    tableCard: { background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
    table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' },
    tableHeaderRow: { background: '#f8fafc', borderBottom: '1px solid #e2e8f0' },
    tableHeaderCell: { padding: '14px 20px', fontWeight: '600', color: '#475569' },
    tableBodyRow: { borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s' },
    tableCell: { padding: '14px 20px', color: '#0f172a' },
    actionBtn: { padding: '6px 12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '500', cursor: 'pointer' },
    badge: { padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600' },

    PENDING: { background: '#fef3c7', color: '#d97706' },
    SIGNED: { background: '#dcfce7', color: '#15803d' },
    REJECTED: { background: '#fee2e2', color: '#b91c1c' },

    workspaceGrid: { display: 'flex', gap: '24px', height: '100%', alignItems: 'stretch' },
    canvasContainer: { flexGrow: 1, background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', minHeight: '500px' },
    controlSidebar: { width: '300px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', flexShrink: 0 },
    signBtn: { width: '100%', padding: '12px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' },
    rejectBtn: { width: '100%', padding: '12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' },
    rejectionBox: { marginTop: '20px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' },
    fieldLabel: { display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '6px' },
    textarea: { width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' },
    submitRejectBtn: { width: '100%', marginTop: '10px', padding: '10px', background: '#b91c1c', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }
};

export default MainDashboard;