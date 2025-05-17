import FeatureProvider from "./providers/FeatureProvider";
import GridBackground from "./components/backgrounds/GridBackground";
import "./App.css";

function App() {
  return (
    <>
      <GridBackground />
      <FeatureProvider></FeatureProvider>
    </>
  );
}

export default App;
