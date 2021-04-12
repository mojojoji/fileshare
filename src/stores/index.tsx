import { makeAutoObservable } from 'mobx';
import React from 'react';
import Connect from '../libs/Connect';

export default class RootStore {
  counter: number = 1;
  connect: Connect;

  constructor() {
    this.connect = makeAutoObservable(new Connect());
    makeAutoObservable(this);
  }

  increment() {
    this.counter = this.counter + 1;
  }

  resetCounter() {
    this.counter = 0;
  }
}

export const StoreContext = React.createContext<RootStore | null>(null);

export function useStore() {
  const store = React.useContext(StoreContext);
  if (!store) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return store;
}
