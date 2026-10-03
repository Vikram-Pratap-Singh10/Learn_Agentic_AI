import app from "./app.js";
import { env } from "./config/env.js";
import { connectDatabase } from "./config/database.js";

async function bootstrap() {
  await connectDatabase();

  app.listen(env.port, () => {
    console.log(
      `Server running on http://localhost:${env.port}`
    );
  });
}

bootstrap().catch((error) => {
  console.error("Server startup failed:", error);
  process.exit(1);
});