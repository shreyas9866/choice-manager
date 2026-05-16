import React, { createContext, useState } from 'react';

export const TrainingContext = createContext();

export const TrainingProvider = ({ children }) => {
  const [sessionTitle, setSessionTitle] = useState('');
  const [learningRate, setLearningRate] = useState(0.5);
  const [choices, setChoices] = useState([]);
  const [currentContext, setCurrentContext] = useState('Default');
  const [chartData, setChartData] = useState([]);
  
  // NEW: We moved the UI state here so it survives page changes!
  const [sliderValues, setSliderValues] = useState({});
  const [suggestion, setSuggestion] = useState(null);

  const clearSession = () => {
    setSessionTitle('');
    setLearningRate(0.5);
    setChoices([]);
    setCurrentContext('Default');
    setChartData([]);
    setSliderValues({});
    setSuggestion(null);
  };

  return (
    <TrainingContext.Provider value={{
      sessionTitle, setSessionTitle,
      learningRate, setLearningRate,
      choices, setChoices,
      currentContext, setCurrentContext,
      chartData, setChartData,
      sliderValues, setSliderValues, // Exported
      suggestion, setSuggestion,     // Exported
      clearSession
    }}>
      {children}
    </TrainingContext.Provider>
  );
};