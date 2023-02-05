const express = require("express");
const { ObjectId } = require("mongodb");
const { getDb, connectToDb } = require("./DB");

// init app & middleware
const app = express();
app.use(express.json());

// db connection & server running
let DB;

connectToDb((err) => {
  if (!err) {
    app.listen("3000", () => {
      console.log("app listening on port 3000");
    });
    DB = getDb();
  }
});

// routes
app.get("/", (req, res) => {
  res.json({ msg: "welcome to APIs" });
});

app.get("/books", (req, res) => {
  let books = [];

  const page = req.query.page || 0;
  const booksPerPage = 3;

  DB.collection("books")
    .find()
    .skip(page * booksPerPage)
    .limit(booksPerPage)
    .forEach((book) => books.push(book))
    .then(() => {
      res.status(200).json(books);
    })
    .catch(() => {
      res.status(500).json({ err: "Can not get the books" });
    });
});

app.get("/books/:id", (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(500).json({ error: "Not valid doc id" });
  }

  DB.collection("books")
    .findOne({ _id: ObjectId(req.params.id) })
    .then((doc) => {
      res.status(200).json(doc);
    })
    .catch((err) => {
      res.status(500).json({ error: "Can not get the book" });
    });
});

app.post("/books", (req, res) => {
  const book = req.body;

  DB.collection("books")
    .insertOne(book)
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(500).json({ error: "Can not insert the book" });
    });
});

app.delete("/books/:id", (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(500).json({ error: "Not valid doc id" });
  }

  DB.collection("books")
    .deleteOne({ _id: ObjectId(req.params.id) })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json({ error: "Can not delete the book" });
    });
});

app.patch("/books/:id", (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(500).json({ error: "Not valid doc id" });
  }

  const updates = req.body;

  DB.collection("books")
    .updateOne({ _id: ObjectId(req.params.id) }, { $set: updates })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json({ error: "Can not update the book" });
    });
});
