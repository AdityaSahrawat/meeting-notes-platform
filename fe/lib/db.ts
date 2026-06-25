export async function saveVideoFile(meetingId: number, file: File): Promise<void> {
    return new Promise((resolve, reject) => {
        if (typeof window === "undefined") {
            resolve();
            return;
        }
        const request = window.indexedDB.open("meetings-db", 1);
        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains("videos")) {
                db.createObjectStore("videos");
            }
        };
        request.onsuccess = () => {
            const db = request.result;
            const tx = db.transaction("videos", "readwrite");
            const store = tx.objectStore("videos");
            const putRequest = store.put(file, meetingId);
            putRequest.onsuccess = () => resolve();
            putRequest.onerror = () => reject(putRequest.error);
        };
        request.onerror = () => reject(request.error);
    });
}

export async function getVideoFile(meetingId: number): Promise<File | null> {
    return new Promise((resolve, reject) => {
        if (typeof window === "undefined") {
            resolve(null);
            return;
        }
        const request = window.indexedDB.open("meetings-db", 1);
        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains("videos")) {
                db.createObjectStore("videos");
            }
        };
        request.onsuccess = () => {
            const db = request.result;
            const tx = db.transaction("videos", "readonly");
            const store = tx.objectStore("videos");
            const getRequest = store.get(meetingId);
            getRequest.onsuccess = () => resolve(getRequest.result || null);
            getRequest.onerror = () => reject(getRequest.error);
        };
        request.onerror = () => reject(request.error);
    });
}
