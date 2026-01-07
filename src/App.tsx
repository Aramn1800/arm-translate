import MainWindow from "./components/main-window";
import TranslatorWindow from "./components/translator-window";

const App = () => {
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
