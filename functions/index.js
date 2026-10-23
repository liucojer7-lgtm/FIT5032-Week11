const {onRequest} = require("firebase-functions/v2/https");
const admin = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");
const cors = require("cors")({origin: true});

admin.initializeApp();

exports.countBooks = onRequest({maxInstances: 2}, (req, res) => {
  cors(req, res, async () => {
    if (req.method !== "GET") {
      res.set("Allow", "GET").status(405).send("Method not allowed");
      return;
    }
    try {
      const booksCollection = getFirestore().collection("books");
      const snapshot = await booksCollection.get();
      const count = snapshot.size;
      res.status(200).json({count});
    } catch (error) {
      console.error("Error counting books:", error.message);
      res.status(500).send("Error counting books");
    }
  });
});

const {onDocumentCreated} = require("firebase-functions/v2/firestore");

exports.capitaliseBook = onDocumentCreated(
    {document: "books/{bookId}", maxInstances: 2},
    async (event) => {
      if (!event.data) return;
      const data = event.data.data();
      const updates = {};
      for (const [key, value] of Object.entries(data)) {
        if (typeof value === "string") updates[key] = value.toUpperCase();
      }
      if (Object.keys(updates).length) await event.data.ref.update(updates);
    },
);

exports.getAllBooks = onRequest({maxInstances: 2}, (req, res) => {
  cors(req, res, async () => {
    if (req.method !== "GET") {
      res.set("Allow", "GET").status(405).send("Method not allowed");
      return;
    }
    try {
      const snapshot = await getFirestore().collection("books").get();
      res.status(200).json(snapshot.docs.map((doc) => ({
        ...doc.data(), id: doc.id,
      })));
    } catch (error) {
      console.error("Error fetching books:", error.message);
      res.status(500).json({error: "Error fetching books"});
    }
  });
});
