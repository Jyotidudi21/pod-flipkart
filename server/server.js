const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const Delivery = require("./models/Delivery");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/popFlipkart", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(" MongoDB Connected"))
  .catch((err) => console.error(" MongoDB Error:", err));

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// API route to upload proof of delivery
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { awbNumber } = req.body;
    const filePath = req.file ? req.file.path : null;
    if (!awbNumber || !filePath)
      return res.status(400).json({ message: "AWB and file required" });

    const delivery = new Delivery({ awbNumber, filePath });
    await delivery.save();

    res.json({ message: "Uploaded successfully!", delivery });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Fetch all uploads
app.get("/deliveries", async (req, res) => {
  const data = await Delivery.find().sort({ uploadTime: -1 });
  res.json(data);
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(` Server running on http://localhost:${PORT}`));
