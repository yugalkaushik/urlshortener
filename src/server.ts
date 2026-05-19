import app from "./app";
import { connectDB } from "./config/db";
import { ENV } from "./config/env";

async function bootstrap() {
  await connectDB();
  app.listen(ENV.PORT, () => {
    console.log(`Server running at ${ENV.BASE_URL}`);
  });
}

bootstrap();