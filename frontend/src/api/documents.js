import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/documents';

// 1. Fetch documents specifically uploaded by/assigned to the logged-in user
export const fetchMyDocuments = async () => {
    const response = await axios.get(`${API_BASE_URL}/my-documents`);
    return response.data;
};

// 2. Fetch lightweight metadata details
export const fetchDocumentDetails = async (id) => {
    const response = await axios.get(`${API_BASE_URL}/details/${id}`);
    return response.data;
};

// 3. Update Signature Status Flow (Day 11 Target Route)
export const updateDocumentStatus = async (id, status, rejectionReason = '') => {
    const payload = {
        status,
        rejectionReason: status === 'REJECTED' ? rejectionReason : null
    };
    const response = await axios.patch(`${API_BASE_URL}/${id}/status`, payload);
    return response.data;
};

// 4. Return the source URL directly for iframe PDF previews
export const getPreviewUrl = (id) => {
    const token = localStorage.getItem('token');
    // We pass the token as a query param if your backend security allows it, 
    // or stream it through a standard source stream link.
    return `${API_BASE_URL}/preview/${id}`;
};

// 5. Upload fresh agreement binaries to the Spring backend metadata engine
export const uploadNewDocument = async (formData) => {
    const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data' // Required header rule for multi-part files
        }
    });
    return response.data;
};