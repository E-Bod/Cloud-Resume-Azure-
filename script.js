// Initialize Firestore
const db = firebase.firestore();

async function updateVisitorCount() {
    const countRef = db.collection('visitorCount').doc('counter');
    
    try {
        await db.runTransaction(async (transaction) => {
            const doc = await transaction.get(countRef);
            if (!doc.exists) {
                transaction.set(countRef, { count: 1 });
            } else {
                const newCount = doc.data().count + 1;
                transaction.update(countRef, { count: newCount });
            }
        });
        const countDoc = await countRef.get();
        document.getElementById('visitor-count').textContent = countDoc.data().count;
    } catch (error) {
        console.error("Error updating visitor count: ", error);
    }
}

if (location.hostname === "localhost") { // ensures that the emulator is only used locally
    db.useEmulator("localhost", 8080);
}

// Call the function once the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function() {
    updateVisitorCount();
});
// Update the visitor count when the page loads
//window.onload = updateVisitorCount;

