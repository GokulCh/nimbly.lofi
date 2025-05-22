import axios from "axios";

const BASE_URL = "https://discoveryprovider.audius.co/v1";
const APP_NAME = "nimbly.lofi";
const MAX_CONCURRENT_TRACKS = 15;

// Fisher-Yates shuffle
const shuffleArray = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

// Concurrency-limited pool processor
async function runWithConcurrency(tasks, limit) {
  const results = [];
  let index = 0;

  async function worker() {
    while (index < tasks.length) {
      const i = index++;
      results[i] = await tasks[i]();
    }
  }

  const workers = Array.from({ length: limit }, () => worker());
  await Promise.all(workers);
  return results;
}

export async function fetchAudiusSongs(onBatchLoad = () => { }) {
  try {
    const playlistIds = ["nl1bL", "n62mn", "ebd1O"];

    const playlistResponses = await Promise.all(
      playlistIds.map((id) =>
        axios
          .get(`${BASE_URL}/playlists/${id}?app_name=${APP_NAME}`)
          .then((res) => res.data?.data?.[0])
          .catch(() => null)
      )
    );

    const validPlaylists = playlistResponses.filter((p) => p && p.playlist_contents);

    const seenTrackIds = new Set();
    const trackIds = [];

    validPlaylists.forEach((playlist) => {
      playlist.playlist_contents.forEach((entry) => {
        if (!seenTrackIds.has(entry.track_id)) {
          seenTrackIds.add(entry.track_id);
          trackIds.push(entry.track_id);
        }
      });
    });


    console.log(`📦 Found ${trackIds.length} unique track IDs.`);

    shuffleArray(trackIds);

    const songs = [];
    const batchSize = 10;
    let batchBuffer = [];
    const seenSongIds = new Set();

    const fetchTasks = trackIds.map((id) => async () => {
      try {
        const res = await axios.get(`${BASE_URL}/tracks/${id}?app_name=${APP_NAME}`);
        const track = res.data.data;

        if (seenSongIds.has(track.id)) return;
        seenSongIds.add(track.id);

        const song = {
          id: track.id,
          title: track.title,
          artist: track.user.name,
          duration: `${Math.floor(track.duration / 60)}:${String(track.duration % 60).padStart(2, "0")}`,
          cover: track.artwork?.["150x150"] || "/placeholder.svg",
          streamUrl:
            track.download?.url ||
            track.media?.[0]?.url ||
            `${BASE_URL}/tracks/${track.id}/stream?app_name=${APP_NAME}`
        };

        songs.push(song);
        batchBuffer.push(song);

        if (batchBuffer.length >= batchSize) {
          onBatchLoad(batchBuffer);
          batchBuffer = [];
        }
      } catch {
        // silently ignore
      }
    });

    await runWithConcurrency(fetchTasks, MAX_CONCURRENT_TRACKS);

    if (batchBuffer.length > 0) {
      onBatchLoad(batchBuffer);
    }

    console.log("🎶 All songs loaded.");
    return songs;
  } catch (error) {
    console.error("❌ Error fetching Audius songs:", error.message);
    return [];
  }
}
