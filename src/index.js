import app from "./app";
import { redisClient } from "./helpers";

const Port = process.env.PORT || 5000;

redisClient.on("connect", () => {
  console.log("Redis client connected");
});

app.listen(Port, () => {
  console.log(`Server is listening on port ${Port}`);
});
