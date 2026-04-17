// import express from "express";
// import fs from "fs";
// import path from "path";

// const router = express.Router();

// router.get("/logs/:filename", (req, res) => {
//   const fileName = req.params.filename;
//   const filePath = path.join(__dirname, "../../logs", fileName);

//   if (!fs.existsSync(filePath)) {
//     return res.status(404).json({ message: "Log file not found" });
//   }

//   const readStream = fs.createReadStream(filePath);

//   res.setHeader("Content-Type", "text/plain");

//   readStream.pipe(res);
// });

// export default router;
