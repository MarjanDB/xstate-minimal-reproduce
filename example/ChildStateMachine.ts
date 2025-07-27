import { assign, enqueueActions, setup } from "xstate";

export type ChildStateMachineContext = {
  someValue: number;
};

export type ChildStateMachineEvent = {
  type: "SET_VALUE";
};

export type ChildStateMachineState = {
  value: "active";
};

export function createChildStateMachine() {
  return setup({
    types: {} as {
      context: ChildStateMachineContext;
      events: ChildStateMachineEvent;
      state: ChildStateMachineState;
    },
  }).createMachine({
    context: {
      someValue: 0,
    },
    initial: "active",
    states: {
      active: {
        on: {
          SET_VALUE: {
            actions: enqueueActions(({ enqueue }) => {
              enqueue.assign({
                someValue: Math.random(),
              });
            }),
          },
        },
      },
    },
  });
}
