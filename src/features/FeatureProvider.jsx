import { BackgroundProvider as FeatureBackgroundProvider } from "./background/BackgroundProvider";
import { ChatProvider } from "./chat/ChatProvider";
import { ClockProvider } from "./clock/ClockProvider";
import { FocusProvider } from "./focus/FocusProvider";
import { RythemProvider } from "./games/rythem/RythemProvider";
import { EffectsProvider } from "./media/effects/EffectsProvider";
import { MusicProvider } from "./media/music/MusicProvider";
import { PlaylistProvider } from "./media/playlist/PlaylistProvider";
import { ToolbarProvider } from "./toolbar/ToolbarProvider";
import { VisualsProvider } from "./visuals/VisualsProvider";

export default function FeatureProvider({ children }) {
  return (
    <MusicProvider>
      <PlaylistProvider>
        <FocusProvider>
          <ClockProvider>
            <ChatProvider>
              <ToolbarProvider>
                <VisualsProvider>
                  <EffectsProvider>
                    <FeatureBackgroundProvider>
                      <RythemProvider>{children}</RythemProvider>
                    </FeatureBackgroundProvider>
                  </EffectsProvider>
                </VisualsProvider>
              </ToolbarProvider>
            </ChatProvider>
          </ClockProvider>
        </FocusProvider>
      </PlaylistProvider>
    </MusicProvider>
  );
}
