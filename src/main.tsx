import { StrictMode } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { App } from '@components/app/app';

import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DndProvider backend={HTML5Backend}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </DndProvider>
  </StrictMode>
);
