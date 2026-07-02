import React, { useState, useRef, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Use the consolidated enterprise service path we established
import { updateDocumentStatus } from '../api/documents';

// Configure the Mozilla PDF workers CDN link for optimized background page calculations
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const SignatureWorkspace = ({ docId, token, signerId }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [savedPlaceholders, setSavedPlaceholders] = useState([]);

    const containerRef = useRef(null);
    const canvasRef = useRef(null);
    const pdfDocRef = useRef(null);

    // Dynamic recovery layer if parents do not provide an explicit identifier prop
    const activeSignerId = signerId || localStorage.getItem('userEmail') || 'Active Profile';

    // 1. Fetch and render the physical PDF document binary stream
    const loadAndRenderPDF = async () => {
        if (!token || !docId) return;
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/api/documents/preview/${docId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error("Could not pull binary file preview stream.");

            const blob = await response.blob();
            const arrayBuffer = await blob.arrayBuffer();

            // Load document into the PDFJS reader structure
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;
            pdfDocRef.current = pdf;
            setTotalPages(pdf.numPages);

            await renderPage(currentPage);
        } catch (err) {
            console.error("PDF Rendering pipeline failed: ", err);
        } finally {
            setLoading(false);
        }
    };

    // 2. Render the specific selected page layout onto the HTML canvas element
    const renderPage = async (pageNum) => {
        if (!pdfDocRef.current || !canvasRef.current) return;

        try {
            const page = await pdfDocRef.current.getPage(pageNum);
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            // Enforce the standardized A4 point framework (595pt width)
            const desiredWidth = 595;
            const unscaledViewport = page.getViewport({ scale: 1 });
            const scale = desiredWidth / unscaledViewport.width;
            const viewport = page.getViewport({ scale: scale });

            canvas.width = viewport.width;
            canvas.height = viewport.height;

            const renderContext = {
                canvasContext: context,
                viewport: viewport
            };

            await page.render(renderContext).promise;
        } catch (err) {
            console.error("Page canvas conversion error: ", err);
        }
    };

    // 3. Sync registered database coordinates
    const fetchActivePlaceholders = async () => {
        if (!docId || !token) return;
        try {
            const response = await fetch(`http://localhost:8080/api/signatures/document/${docId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setSavedPlaceholders(data);
            }
        } catch (err) {
            console.error("Failed to sync structural placeholders array: ", err);
        }
    };

    // Trigger loading sequences sequentially upon parameter context updates
    useEffect(() => {
        loadAndRenderPDF();
        fetchActivePlaceholders();
    }, [docId, token]);

    useEffect(() => {
        if (pdfDocRef.current) {
            renderPage(currentPage);
        }
    }, [currentPage]);

    const handleDragOver = (e) => e.preventDefault();

    const handleDrop = async (e) => {
        e.preventDefault();
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const relativeX = e.clientX - rect.left;
        const relativeY = e.clientY - rect.top;

        const boxWidthOffset = 75;
        const boxHeightOffset = 25;

        const finalX = relativeX - boxWidthOffset;
        const finalY = relativeY - boxHeightOffset;

        // Enforce canvas perimeter bounds safety checks
        if (finalX < 0 || finalY < 0 || finalX > (595 - 150) || finalY > (842 - 50)) {
            alert("Boundary Alert: Signature field target box cannot fall outside document page boundaries.");
            return;
        }

        setLoading(true);
        try {
            // Mocking coordinate placements locally or appending directly back to signature placeholders
            const customPlaceholderMock = {
                id: Date.now(),
                x: Math.round(finalX),
                y: Math.round(finalY),
                page: currentPage,
                status: 'PENDING'
            };
            setSavedPlaceholders(prev => [...prev, customPlaceholderMock]);
        } catch (err) {
            alert(`Pipeline error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.workspaceContainer}>

            {/* 🛠️ Sidebar Elements Panel */}
            <div style={styles.toolSidebar}>
                <div style={styles.sidebarHeader}>
                    <h3 style={styles.sidebarTitle}>Workspace Tools</h3>
                    <p style={styles.sidebarSubtitle}>Drag elements onto the document workspace sheet.</p>
                </div>

                <div
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData("text/plain", "signature")}
                    style={styles.premiumDraggableField}
                >
                    <span style={styles.fieldIcon}>✒️</span>
                    <div style={styles.fieldTextContainer}>
                        <span style={styles.fieldTypeLabel}>Signature Field</span>
                        <span style={styles.fieldMetaText}>Drop Zone (150x50pt)</span>
                    </div>
                </div>

                <div style={styles.auditCard}>
                    <h4 style={styles.auditTitle}>Live Audit Metrics</h4>
                    <div style={styles.auditRow}><span>Active Target Doc:</span><strong>#{docId}</strong></div>
                    <div style={styles.auditRow}><span>Assigned Account:</span><strong style={{ fontSize: '10px' }}>{activeSignerId}</strong></div>
                    <div style={styles.auditRow}><span>Total Pages:</span><strong>{totalPages}</strong></div>
                </div>
            </div>

            {/* 📄 Real-Time Central Viewport Document Frame */}
            <div style={styles.canvasViewportContainer}>
                <div style={styles.actionControlHeader}>
                    <div style={styles.paginationCluster}>
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            style={{ ...styles.controlBtn, opacity: currentPage === 1 ? 0.5 : 1 }}
                        >
                            ← Previous
                        </button>
                        <div style={styles.pageIndicatorChip}>
                            Page <strong style={{ color: '#2563eb', marginLeft: '4px' }}>{currentPage} / {totalPages}</strong>
                        </div>
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            style={{ ...styles.controlBtn, opacity: currentPage === totalPages ? 0.5 : 1 }}
                        >
                            Next →
                        </button>
                    </div>
                    {loading && <div style={styles.liveSyncBadge}>⚡ Matrix Syncing...</div>}
                </div>

                {/* 📐 Strict A4 Bound Document Container Box Layer Area */}
                <div
                    ref={containerRef}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    style={styles.a4DocumentCanvas}
                >
                    {/* Dynamic Map Loop Overlaying Saved Matrix Elements */}
                    {savedPlaceholders
                        .filter(sig => Number(sig.page) === currentPage)
                        .map((sig, idx) => (
                            <div
                                key={sig.id || idx}
                                style={{
                                    ...styles.droppedLivePlaceholder,
                                    left: `${sig.x}px`,
                                    top: `${sig.y}px`
                                }}
                            >
                                <div style={styles.placeholderLabel}>✒️ Signature Requested</div>
                                <div style={styles.placeholderCoordinates}>X: {sig.x}pt | Y: {sig.y}pt</div>
                                <div style={{
                                    ...styles.placeholderBadge,
                                    backgroundColor: sig.status === 'SIGNED' ? '#16a34a' : sig.status === 'REJECTED' ? '#dc3545' : '#ca8a04'
                                }}>
                                    {sig.status}
                                </div>
                            </div>
                        ))
                    }

                    {/* Core HTML5 Canvas Layer where pdfjs draws the physical PDF image lines */}
                    <canvas ref={canvasRef} style={styles.nativePdfRendererCanvas}></canvas>
                </div>
            </div>
        </div>
    );
};

const styles = {
    workspaceContainer: { display: 'flex', gap: '24px', width: '100%', height: '100%', alignItems: 'flex-start' },
    toolSidebar: { width: '280px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '20px' },
    sidebarHeader: { borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' },
    sidebarTitle: { margin: 0, fontSize: '16px', fontWeight: '600', color: '#0f172a' },
    sidebarSubtitle: { margin: '4px 0 0 0', fontSize: '12px', color: '#64748b', lineHeight: '1.4' },
    premiumDraggableField: { display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', background: '#fef9c3', border: '1px dashed #eab308', borderRadius: '8px', cursor: 'grab', transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: '0 2px 4px rgba(234,179,8,0.1)' },
    fieldIcon: { fontSize: '20px' },
    fieldTextContainer: { display: 'flex', flexDirection: 'column' },
    fieldTypeLabel: { fontSize: '13px', fontWeight: '600', color: '#713f12' },
    fieldMetaText: { fontSize: '11px', color: '#a16207', marginTop: '2px' },
    auditCard: { background: '#f8fafc', borderRadius: '8px', padding: '12px', border: '1px solid #edf2f7' },
    auditTitle: { margin: '0 0 8px 0', fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' },
    auditRow: { display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b', margin: '4px 0' },
    canvasViewportContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: 1, gap: '16px' },
    actionControlHeader: { display: 'flex', width: '595px', justifyContent: 'space-between', alignItems: 'center' },
    paginationCluster: { display: 'flex', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '30px', padding: '4px 8px', alignItems: 'center', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' },
    controlBtn: { background: 'none', border: 'none', color: '#2563eb', fontSize: '13px', fontWeight: '600', padding: '6px 12px', cursor: 'pointer', borderRadius: '20px', transition: 'background 0.2s' },
    pageIndicatorChip: { fontSize: '13px', color: '#475569', padding: '0 8px', borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0' },
    liveSyncBadge: { background: '#dbeafe', color: '#1e40af', fontSize: '12px', fontWeight: '600', padding: '6px 12px', borderRadius: '20px' },
    a4DocumentCanvas: { position: 'relative', width: '595px', height: '842px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', boxShadow: '0 10px 30px rgba(0,0,0,0.06)', overflow: 'hidden' },
    droppedLivePlaceholder: { position: 'absolute', width: '150px', height: '50px', background: 'rgba(254, 249, 195, 0.95)', border: '2px solid #eab308', borderRadius: '6px', padding: '4px 8px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', zIndex: 10, boxShadow: '0 4px 6px rgba(0,0,0,0.05)' },
    placeholderLabel: { fontSize: '10px', fontWeight: '700', color: '#713f12' },
    placeholderCoordinates: { fontSize: '9px', color: '#a16207', fontFamily: 'monospace' },
    placeholderBadge: { alignSelf: 'flex-end', fontSize: '8px', color: '#ffffff', padding: '2px 6px', borderRadius: '3px', fontWeight: 'bold', textTransform: 'uppercase' },
    nativePdfRendererCanvas: { width: '100%', height: '100%', display: 'block', zIndex: 1 }
};

export default SignatureWorkspace;