import React from "react";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";

import router from "./routes";
import store, { persister } from "./store/store";
import { PersistGate } from "redux-persist/integration/react";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persister}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  );
};

export default App;
