const router = require("express").Router();
const multer = require("multer");
const path = require("path");

// 设置存储引擎和文件存储路径
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/data/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// 创建 multer 实例
const upload = multer({ storage: storage });

// POST 请求
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

module.exports = router;
