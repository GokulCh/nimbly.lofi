import DefaultBackground from "../core/background/DefaultBackground";
import ClockDisplay from "../features/clock/ClockDisplay";
import ExitFocusPopup from "../features/focus/ExitFocusPopup";
import Toolbar from "../features/toolbar/Toolbar";
import "./styles/App.css";

function App() {
  return (
    <>
      <Toolbar />
      <ExitFocusPopup />
      <ClockDisplay />
      <DefaultBackground />
    </>
  );
}

export default App;
