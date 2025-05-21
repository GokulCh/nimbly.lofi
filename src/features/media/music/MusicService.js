import axios from "axios";

const BASE_URL = "https://discoveryprovider.audius.co/v1";
const APP_NAME = "nimbly.lofi";

export async function fetchAudiusSongs() {
  try {
    const playlistId = "n62mn";
    const url = `${BASE_URL}/playlists/${playlistId}?app_name=${APP_NAME}`;

    // Step 1: Get playlist data
    const playlistResponse = await axios.get(url, {
      headers: { Accept: "application/json" }
    });

    const playlist = playlistResponse.data?.data?.[0];
    if (!playlist || !playlist.playlist_contents) {
      console.error("❌ Invalid playlist response");
      return [];
    }

    const trackIds = playlist.playlist_contents.map((entry) => entry.track_id);
    console.log(`📦 Found ${trackIds.length} tracks. Fetching details...`);

    // Step 2: Fetch each track's details
    const trackRequests = trackIds.map((id) =>
      axios
        .get(`${BASE_URL}/tracks/${id}?app_name=${APP_NAME}`)
        .then((res) => res.data.data)
        .catch(() => null)
    );

    const trackResults = await Promise.all(trackRequests);
    const validTracks = trackResults.filter(Boolean);

    // Step 3: Format song list with actual streamable URLs
    const songs = validTracks.map((track, index) => ({
      id: index + 1,
      title: track.title,
      artist: track.user.name,
      duration: `${Math.floor(track.duration / 60)}:${String(track.duration % 60).padStart(2, "0")}`,
      cover: track.artwork?.["150x150"] || "/placeholder.svg",
      streamUrl: track.download?.url || track.media?.[0]?.url || `${BASE_URL}/tracks/${track.id}/stream?app_name=${APP_NAME}`
    }));

    console.log("🎶 Final Song List:");
    console.log(songs);

    return songs;
  } catch (error) {
    console.error("❌ Error fetching Audius songs:", error.message);
    return [];
  }
}