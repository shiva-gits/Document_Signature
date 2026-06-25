import React from 'react';
import SignatureWorkspace from './signatureWorkspace';

const MainDashboard = ({ docId, token, signerId }) => {
    return (
        <div style={styles.dashboardContainer}>
            {/* 🧭 Main Executive Left Navigation Bar */}
            <aside style={styles.sidebarNav}>
                <div style={styles.brandWrapper}>
                    <div style={styles.brandLogo}>🖋️</div>
                    <div style={styles.brandTextContainer}>
                        <span style={styles.brandName}>SignLedger</span>
                        <span style={styles.brandSystemTag}>Enterprise Matrix v1.0</span>
                    </div>
                </div>

                <nav style={styles.navigationMenu}>
                    <div style={{ ...styles.navItem, ...styles.navItemActive }}>
                        <span style={styles.navIcon}>📋</span> Workspace Console
                    </div>
                    <div style={styles.navItem}><span style={styles.navIcon}>📁</span> Document Inbox</div>
                    <div style={styles.navItem}><span style={styles.navIcon}>👥</span> Team Access</div>
                    <div style={styles.navItem}><span style={styles.navIcon}>⚙️</span> System Setup</div>
                </nav>

                <div style={styles.profileFooter}>
                    <div style={styles.avatarCircle}>V</div>
                    <div style={styles.profileMeta}>
                        <span style={styles.profileName}>Validator Profile</span>
                        <span style={styles.profileStatusBadge}>Active Token Session</span>
                    </div>
                </div>
            </aside>

            {/* 💻 Primary Workspace Viewport Container Frame */}
            <div style={styles.mainContentFrame}>
                <header style={styles.topHeader}>
                    <div style={styles.headerTitleGroup}>
                        <h2 style={styles.headerTitle}>Agreement Matrix Setup Workspace</h2>
                        <p style={styles.headerSubtitle}>Deploy precise absolute structural coordinate constraints directly onto digital documents.</p>
                    </div>
                    <div style={styles.headerActionCluster}>
                        <div style={styles.statusIndicatorPulse}></div>
                        <span style={styles.statusTextLabel}>Secure Gateway Online</span>
                    </div>
                </header>

                {/* Workspace core canvas engine zone */}
                <div style={styles.workspaceViewportWrapper}>
                    <SignatureWorkspace
                        docId={docId}
                        token={token}
                        signerId={signerId}
                    />
                </div>
            </div>
        </div>
    );
};

const styles = {
    dashboardContainer: { display: 'flex', width: '100vw', height: '100vh', background: '#f8fafc', overflow: 'hidden', fontFamily: '"Inter", "Segoe UI", sans-serif' },
    sidebarNav: { width: '260px', background: '#0f172a', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '24px 16px', color: '#ffffff' },
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
    avatarCircle: { width: '36px', height: '36px', background: '#3b82f6', color: '#ffffff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px' },
    profileMeta: { display: 'flex', flexDirection: 'column' },
    profileName: { fontSize: '13px', fontWeight: '600' },
    profileStatusBadge: { fontSize: '10px', color: '#10b981', marginTop: '2px', fontWeight: '500' },
    mainContentFrame: { flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
    topHeader: { height: '70px', background: '#ffffff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', boxShadow: '0 1px 2px rgba(0,0,0,0.01)' },
    headerTitleGroup: { display: 'flex', flexDirection: 'column' },
    headerTitle: { margin: 0, fontSize: '18px', fontWeight: '700', color: '#0f172a' },
    headerSubtitle: { margin: '2px 0 0 0', fontSize: '11px', color: '#64748b' },
    headerActionCluster: { display: 'flex', alignItems: 'center', gap: '8px', background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '6px 14px', borderRadius: '20px' },
    statusIndicatorPulse: { width: '8px', height: '8px', background: '#10b981', borderRadius: '50%' },
    statusTextLabel: { fontSize: '12px', fontWeight: '600', color: '#16a34a' },
    workspaceViewportWrapper: { flexGrow: 1, padding: '32px', overflowY: 'auto' }
};

export default MainDashboard;