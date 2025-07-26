import React from "react";
import MainWindow from './components/MainWindow'
import TranslatorWindow from './components/TranslatorWindow'

const App: React.FC = () => {
  const getContent = () => {
    switch (window.location.hash) {
      case '#translator':
        return <TranslatorWindow />
      case '#main':
      default:
        return <MainWindow />;
    }
  };

  return getContent();
}

export default App
