import axios from "axios";

const BASE_URL = "https://discoveryprovider.audius.co/v1";
const APP_NAME = "nimbly.lofi";
const MAX_CONCURRENT = 20; // Sweet spot for performance vs speed

// Fisher-Yates shuffle
const shuffleArray = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

// Efficient concurrency pool
async function processConcurrently(tasks, limit) {
  const results = [];
  const executing = [];

  for (const [index, task] of tasks.entries()) {
    const promise = task().then(result => ({ index, result }));
    results.push(promise);

    if (results.length >= limit) {
      executing.push(Promise.race(results));
      if (executing.length >= limit) {
        await Promise.race(executing);
        executing.splice(executing.findIndex(p => p.settled), 1);
      }
    }
  }

  return Promise.all(results);
}

export async function fetchAudiusSongs(onBatchLoad = () => { }) {
  try {
    const playlistIds = ["nl1bL", "n62mn", "ebd1O"];

    // Fetch playlists concurrently
    const playlistResponses = await Promise.all(
      playlistIds.map(async (id) => {
        try {
          const res = await axios.get(`${BASE_URL}/playlists/${id}?app_name=${APP_NAME}`);
          return res.data?.data?.[0];
        } catch {
          return null;
        }
      })
    );

    const validPlaylists = playlistResponses.filter(p => p?.playlist_contents);

    // Extract and dedupe track IDs
    const trackIds = [...new Set(
      validPlaylists.flatMap(playlist =>
        playlist.playlist_contents.map(entry => entry.track_id)
      )
    )];

    console.log(`📦 Found ${trackIds.length} unique track IDs.`);
    shuffleArray(trackIds);

    const songs = [];
    const seenSongIds = new Set();
    let batchBuffer = [];
    let isFirstBatch = true;

    // Process tracks with controlled concurrency
    let activeRequests = 0;
    let completedRequests = 0;
    const totalRequests = trackIds.length;

    const processTrack = async (trackId) => {
      activeRequests++;
      try {
        const res = await axios.get(`${BASE_URL}/tracks/${trackId}?app_name=${APP_NAME}`, {
          timeout: 5000 // 5 second timeout for performance
        });

        const track = res.data.data;
        if (seenSongIds.has(track.id)) return null;

        seenSongIds.add(track.id);
        return {
          id: track.id,
          title: track.title,
          artist: track.user.name,
          duration: `${Math.floor(track.duration / 60)}:${String(track.duration % 60).padStart(2, "0")}`,
          cover: track.artwork?.["150x150"] || "/placeholder.svg",
          streamUrl: track.download?.url || track.media?.[0]?.url ||
            `${BASE_URL}/tracks/${track.id}/stream?app_name=${APP_NAME}`
        };
      } catch {
        return null;
      } finally {
        activeRequests--;
        completedRequests++;
      }
    };

    // Process with smart batching
    const processBatch = async (batchTrackIds) => {
      const promises = batchTrackIds.map(processTrack);
      const results = await Promise.all(promises);

      const validSongs = results.filter(song => song !== null);
      songs.push(...validSongs);

      return validSongs;
    };

    // First batch: Process first 8 tracks to quickly get 5 songs
    const firstBatchTracks = trackIds.slice(0, 8);
    const firstBatchSongs = await processBatch(firstBatchTracks);

    if (firstBatchSongs.length > 0) {
      const firstFive = firstBatchSongs.slice(0, 5);
      onBatchLoad(firstFive);
      console.log(`🚀 First ${firstFive.length} songs loaded`);

      // Add any extras to buffer for next batch
      if (firstBatchSongs.length > 5) {
        batchBuffer.push(...firstBatchSongs.slice(5));
      }
    }

    // Process remaining tracks in optimal chunks
    let startIndex = 8;
    const chunkSize = MAX_CONCURRENT;

    while (startIndex < trackIds.length) {
      const chunk = trackIds.slice(startIndex, startIndex + chunkSize);
      const chunkSongs = await processBatch(chunk);

      batchBuffer.push(...chunkSongs);

      // Send batches of 15
      while (batchBuffer.length >= 15) {
        const batch = batchBuffer.splice(0, 15);
        onBatchLoad(batch);
        console.log(`📦 Batch of ${batch.length} songs loaded`);
      }

      startIndex += chunkSize;
    }

    // Send remaining songs
    if (batchBuffer.length > 0) {
      onBatchLoad(batchBuffer);
      console.log(`📦 Final batch of ${batchBuffer.length} songs loaded`);
    }

    console.log(`🎶 All songs loaded. Total: ${songs.length} songs.`);
    return songs;

  } catch (error) {
    console.error("❌ Error fetching Audius songs:", error.message);
    return [];
  }
}