const express = require("express");
const fileupload = require("express-fileupload");
const cors = require("cors");

const app = express();

app.use(
  fileupload({
    createParentPath: true,
  }),
);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  res.json({ message: 'Welcome to file server' });
});

app.post("/upload-file", async (req, res) => {
  try {
    if (!req.files) {
      res.send({
        status: "failed",
        message: "No file uploaded",
      });
    } else {

      for (const key of Object.keys(req.files)) {
        const files = req.files[key];

        for (const file of files) {
          const fileExtension = file.mimetype.split('/')[1];
          file.mv("./uploads/" + `${file.name}_${Date.now()}.${fileExtension}`);
        }
      }


      res.send({
        status: "success",
        message: "File is uploaded",
      });
    }
  } catch (err) {
    console.log('err:', err);
    res.status(500).send(err);
  }
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));