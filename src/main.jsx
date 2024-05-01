import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import {registerLicense} from '@syncfusion/ej2-base'

registerLicense(
  "ORg4AjUWIQA/Gnt2UFhhQlJBfV5AQmBIYVp/TGpJfl96cVxMZVVBJAtUQF1hTX5XdUVjUHxacnNcRmld"
);
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
