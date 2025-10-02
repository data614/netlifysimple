import { rm } from "fs/promises";

try {
  await rm("build", { recursive: true, force: true });
  console.log("Removed build directory");
} catch (error) {
  console.error("Failed to remove build directory:", error);
  process.exitCode = 1;
}