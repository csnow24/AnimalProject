// server.js
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.url);
  next();
});

// Middleware
app.use(cors());          // allows cross-origin requests (useful in dev)
app.use(express.json());  // parse JSON body if we need it later
app.use(express.static(path.join(__dirname, "public"))); // optional: serve frontend files

// Connect to (or create) SQLite database file
const db = new sqlite3.Database("./animals.db", (err) => {
  if (err) {
    console.error("Could not open DB", err.message);
    process.exit(1);
  }
  console.log("Connected to animals.db");
});

// Create table and insert sample data (run once; uses "INSERT OR IGNORE")
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS animals (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT
  )`);

  const insert = db.prepare(
    "INSERT OR IGNORE INTO animals (id, name, description) VALUES (?, ?, ?)"
  );

  insert.run(1, "Lion", "Big cat with a mane, lives in groups called prides.");
  insert.run(2, "Tiger", "Largest cat, orange with black stripes, strong hunter.");
  insert.run(3,"Panther", "Black-coated leopard or jaguar, stealthy and sleek.");
  insert.run(4, "Cat", "Small domesticated feline, playful and affectionate.");
  insert.run(5, "Cheetah", "Fastest land animal, spotted coat, hunts by speed.");
  insert.run(6, "Hyena", "Scavenger and hunter, known for its laugh-like calls.");
  insert.run(7, "Coyote", "Adaptable wild dog, found across North and Central America.");
  insert.run(8, "Fox", "Small, smart, bushy-tailed hunter.");
  insert.run(9, "Panda", "Black and white bear, loves bamboo, native to China.");
  insert.run(10, "Turtle", "Reptile with a hard shell, slow-moving and long-lived.");
  insert.finalize();
});

app.get("/test", (req, res) => {
  res.send("Server is alive!");
});

// Route: return all animals as JSON
app.get("/animals", (req, res) => {
  db.all("SELECT * FROM animals", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Route: return a single animal by numeric id (matches http://localhost:3000/1)
app.get("/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  db.get("SELECT * FROM animals WHERE id = ?", [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: "Animal not found" });
    }
    res.json(row);
  });
});

// Helpful: redirect root to /animals (optional)
app.get("/", (req, res) => {
  res.redirect("/animals");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
