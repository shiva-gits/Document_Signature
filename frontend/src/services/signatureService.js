const BASE_URL = 'http://localhost:8080/api';

// 1. Export the function directly to completely bypass object property syntax limits
export const saveCoordinates = async (docId, signerId, x, y, page, token) => {
    const payload = {
        docId: Number(docId),
        signerId: Number(signerId),
        x: Number(x.toFixed(2)),
        y: Number(y.toFixed(2)),
        page: Number(page)
    };

    try {
        const response = await fetch(`${BASE_URL}/signatures/request`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Server returned execution fault code: ${response.status}`);
        }

        return await response.text();
    } catch (error) {
        console.error("API Pipeline Error: ", error);
        throw error;
    }
};