const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// 设置存储引擎和文件存储路径
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/data/");
  },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    const basename =
      path.basename(file.originalname, extname) || file.fieldname;
    // cb(null, file.fieldname + "-" + Date.now() + extname);
    cb(null, basename + "-" + Date.now() + extname);
  },
});

// 创建 multer 实例
const upload = multer({ storage: storage });

// 普通文件上传
router.post("/", upload.single("file"), (request, response) => {
  if (!request.file) {
    return response.status(400).json({ message: "No file uploaded" });
  }
  // 文件上传成功，返回文件信息
  response.json({
    message: "File uploaded successfully",
    filename: request.file.filename,
    path: request.file.path,
  });
});

// base64 文件上传
router.post("/base64", (req, res) => {
  const { filename, data } = req.body;

  // 将 base64 字符串解码为二进制数据
  const fileData = Buffer.from(data, "base64");

  // 生成一个临时文件名
  const tempFileName = filename + "-" + Date.now();

  // 保存路径
  const savePath = "./public/data/" + tempFileName;

  // 将文件保存到本地磁盘上
  fs.writeFile(savePath, fileData, { encoding: "base64" }, (err) => {
    if (err) {
      return res.status(500).json({ message: "Failed to save file" });
    }

    // 文件上传成功，返回文件信息
    res.json({
      message: "File uploaded successfully",
      filename: tempFileName,
      path: "./public/data/" + tempFileName,
    });
  });
});

module.exports = router;
