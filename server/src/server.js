import "dotenv/config";
import app from "./app.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`front end server is running on ${process.env.CLIENT_URL}`);
    console.log(`Server is running on http://localhost:${PORT}`);
});