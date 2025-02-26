const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

// **🔹 API لاستقبال بيانات الموقع من SIM808**
exports.updateLocation = functions.https.onRequest(async (req, res) => {
    if (req.method !== "POST") {
        return res.status(400).json({ error: "Only POST requests allowed" });
    }

    const { latitude, longitude } = req.body;
    if (!latitude || !longitude) {
        return res.status(400).json({ error: "Missing latitude or longitude" });
    }

    await db.collection("locations").add({
        latitude,
        longitude,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(200).json({ message: "Location stored successfully" });
});

// **🔹 API لاسترجاع أحدث موقع**
exports.getLatestLocation = functions.https.onRequest(async (req, res) => {
    try {
        const snapshot = await db.collection("locations")
            .orderBy("timestamp", "desc")
            .limit(1)
            .get();

        if (snapshot.empty) {
            return res.status(404).json({ error: "No location data found" });
        }

        const latestLocation = snapshot.docs[0].data();
        return res.status(200).json(latestLocation);
    } catch (error) {
        return res.status(500).json({ error: "Error fetching location" });
    }
});
