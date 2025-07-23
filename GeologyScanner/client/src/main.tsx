import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import * as tf from '@tensorflow/tfjs';

// Initialize TensorFlow.js
async function init() {
  // Load TensorFlow.js
  await tf.ready();
  console.log('TensorFlow.js initialized');
  
  // Render the app after TensorFlow is ready
  createRoot(document.getElementById("root")!).render(<App />);
}

init();
