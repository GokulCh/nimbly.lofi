import { start, setActivity, clearActivity, destroy } from "tauri-plugin-drpc";
import { Activity, Assets, Timestamps } from "tauri-plugin-drpc/activity";

const APP_ID = "1375545079988486366";
let isInitialized = false;
let appStartTime = null;

export async function initRPC() {
  try {
    if (!window.__TAURI__) {
      console.log("❌ Tauri is not available");
      return;
    }
    if (isInitialized) return;
    await start(APP_ID);
    isInitialized = true;
    appStartTime = Date.now();
    console.log("✅ Discord RPC started");
  } catch (err) {
    console.error("❌ Failed to start Discord RPC:", err);
  }
}

export async function setDynamicPresence(song) {
  if (!window.__TAURI__ || !isInitialized || !song) return;

  const assets = new Assets()
    .setLargeImage(song.cover || "logo")
    .setLargeText(`${song.title} — ${song.artist}`);

  const timestamps = new Timestamps(appStartTime);

  const activity = new Activity()
    .setDetails(`Listening to ${song.title}`)
    .setState(`by ${song.artist}`)
    .setAssets(assets)
    .setTimestamps(timestamps);

  try {
    await setActivity(activity);
    console.log(`🎶 Discord presence set for: ${song.title}`);
  } catch (err) {
    console.error("❌ Failed to set Discord presence:", err);
  }
}

export async function clearRPC() {
  if (!window.__TAURI__) return;

  try {
    await clearActivity();
    await destroy();
    isInitialized = false;
    console.log("🛑 Discord RPC cleared and stopped");
  } catch (err) {
    console.error("❌ Failed to clear Discord RPC:", err);
  }
}
