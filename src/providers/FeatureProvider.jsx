import { FocusProvider } from "../features/focus/FocusProvider";
import { ChatProvider } from "../features/chat/ChatProvider";
import { MusicProvider } from "../features/music/MusicProvider";

import ToolBar from "../features/toolbar/ToolBar";

export default function FeatureProvider({ children }) {
  return (
    <>
      <FocusProvider>
        {children}
        <ToolBar />
        <ChatProvider />
        <MusicProvider />
      </FocusProvider>
    </>
  );
}
