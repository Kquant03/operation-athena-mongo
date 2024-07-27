import React, { createContext, useContext, useReducer, Dispatch } from 'react';

type State = {
  tasks: any[];
  isLoading: boolean;
  error: string | null;
};

type Action = 
  | { type: 'SET_TASKS'; payload: any[] }
  | { type: 'ADD_TASK'; payload: any }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'DELETE_TASK'; payload: string };

const initialState: State = {
  tasks: [],
  isLoading: false,
  error: null,
};

const AppContext = createContext<{
  state: State;
  dispatch: Dispatch<Action>;
} | undefined>(undefined);

const appReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_TASKS':
      return { ...state, tasks: action.payload };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter(task => task._id !== action.payload) };
    default:
      return state;
  }
};

export const AppProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};