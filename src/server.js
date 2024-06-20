const express = require("express");
const fileupload = require("express-fileupload");
const cors = require("cors");
const path = require('path');

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
      if (Array.isArray(req.files.files)) {
        for (const i in req.files.files) {
          const file = req.files.files[i];
          const fileExtension = file.mimetype.split('/')[1];
          file.mv(path.join(__dirname, 'uploads', `${file.name}_${i}_${Date.now()}.${fileExtension}`));
        }
      } else {
        const file = req.files.files;
        const fileExtension = file.mimetype.split('/')[1];
        file.mv(path.join(__dirname, 'uploads', `${file.name}_0_${Date.now()}.${fileExtension}`));
      }


      res.send({
        status: "success",
        message: "File is uploaded",
        body: { ...req.body }
      });
    }
  } catch (err) {
    console.log('err:', err);
    res.status(500).send(err);
  }
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));