// Server → dùng để chạy backend
import 'reflect-metadata'; // BẮT BUỘC PHẢI CÓ DÒNG NÀY Ở ĐÂU TIÊN
import app from "./app";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
