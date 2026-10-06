import { Buffer } from 'buffer';
global.Buffer = global.Buffer || Buffer;

import { registerRootComponent } from 'expo';
import App from './App';

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    input, textarea, select {
      outline: none !important;
      outline-width: 0 !important;
      box-shadow: none !important;
    }
  `;
  document.head.appendChild(style);
}

registerRootComponent(App);
