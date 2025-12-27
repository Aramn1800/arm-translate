import type React from "react";
import MainWindow from "./components/main-window";
import TranslatorWindow from "./components/translator-window";

const App: React.FC = () => {
  const getContent = () => {
    switch (window.location.hash) {
      case "#translator":
        return <TranslatorWindow />;
      default:
        return <MainWindow />;
    }
  };

  return getContent();
};

export default App;
