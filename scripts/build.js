import { mkdir, cp, readdir, copyFile, access } from "fs/promises";
import { constants } from "fs";
import { join, dirname } from "path";

async function pathExists(path) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function ensureDir(path) {
  await mkdir(path, { recursive: true });
}

async function copyDirectory(source, destination) {
  await ensureDir(dirname(destination));
  await cp(source, destination, { recursive: true });
  console.log("Copied " + source + " -> " + destination);
}

async function copyDirectoryContents(source, destination) {
  const entries = await readdir(source, { withFileTypes: true });
  await ensureDir(destination);
  for (const entry of entries) {
    const from = join(source, entry.name);
    const to = join(destination, entry.name);
    if (entry.isDirectory()) {
      await cp(from, to, { recursive: true });
    } else {
      await copyFile(from, to);
    }
  }
  console.log("Copied contents of " + source + " -> " + destination);
}

async function build() {
  try {
    await ensureDir("build");

    if (await pathExists("src/pages")) {
      await copyDirectoryContents("src/pages", "build");
    } else {
      console.warn("src/pages not found, skipping page copy");
    }

    if (await pathExists("src/assets")) {
      await copyDirectory("src/assets", "build/assets");
    } else {
      console.warn("src/assets not found, skipping asset copy");
    }

    console.log("Build completed successfully.");
  } catch (error) {
    console.error("Build failed:", error);
    process.exitCode = 1;
  }
}

build();