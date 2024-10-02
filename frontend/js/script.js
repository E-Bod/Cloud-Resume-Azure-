import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getFirestore, doc, runTransaction, getDoc, connectFirestoreEmulator } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
    
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

if (location.hostname === "localhost") { // ensures that the emulator is only used locally
    console.log("Connecting to Firestore emulator");
    connectFirestoreEmulator(db,"localhost", 8080);
}

// Call the function once the DOM is fully loaded
document.addEventListener("DOMContentLoaded", async function() {
console.log("Starting updateVisitorCount");
await updateVisitorCount();
console.log("Finished updateVisitorCount");
});


async function updateVisitorCount() {
    const countRef = doc(db, 'visitorCount', 'counter');  //reference to the document
    
    try {
        //firestore transaction to update the count
        await runTransaction(db, async (transaction) => {
            const docSnap = await transaction.get(countRef); //get the document
            if (!docSnap.exists()) {
                transaction.set(countRef, { count: 1 }); //create the document if it doesn't exist
            } else {
                const newCount = docSnap.data().count + 1; //increment the count
                console.log("Updating visitor count to ", newCount);
                transaction.update(countRef, { count: newCount });
            }
        });

        const countDoc = await getDoc(countRef);
        console.log("Current visitor count: ", countDoc.data().count);
        document.getElementById('visitor-count').textContent = countDoc.data().count;
    } catch (error) {
        console.error("Error updating visitor count: ", error);
    }
}

// Update the visitor count when the page loads
// window.onload = updateVisitorCount;




