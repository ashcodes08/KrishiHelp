

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer from './user/userSlice';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
//save the information locally so that we dont lose it
import themeReducer from './theme/themeSlice';
import cartReducer from './cart/cartSlice';

// Combine all reducers
const rootReducer = combineReducers({
  user: userReducer,
  theme: themeReducer,
  shop: cartReducer,
  });
  
  //configuration of persist
  const persistConfig = {
    key: 'root',
    storage,
    version: 1,
  };
  

  //making of the persisted reducer by configuring the rootReducer with the persist config
  const persistedReducer = persistReducer(persistConfig, rootReducer);
  
  export const store = configureStore({
    reducer: persistedReducer,
    //The getDefaultMiddleware function is used to get the default middleware array provided by Redux Toolkit.
    // The serializableCheck: false option is specified to disable the serializability check middleware, which ensures that all actions and state are serializable.
    // This is necessary in your case because redux-persist can sometimes cause issues with serializability checks due to the way it handles the state.
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }),
  });
  
  export const persistor = persistStore(store);
// No need for persistor anymore, so you can remove it entirely.