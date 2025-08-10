import { createClient } from "redis";

const redisUrl = process.env.REDIS_URL;

let redisClient: ReturnType<typeof createClient> | null = null;
let redisPublisherClient: ReturnType<typeof createClient> | null = null;

if (redisUrl) {
  redisClient = createClient({ url: redisUrl }).on("error", (err) => console.log("Redis Client Error", err));
  redisPublisherClient = createClient({ url: redisUrl }).on("error", (err) =>
    console.log("Publisher Redis Client Error", err),
  );
  // Connect clients
  redisClient.connect().catch(console.error);
  redisPublisherClient.connect().catch(console.error);
}

export const redis = redisClient as any;
export const redisPublisher = redisPublisherClient as any;


