import {
  ActorRefFrom,
  AnyActorRef,
  createActor,
  createMachine,
  enqueueActions,
  setup,
} from "xstate";
import { createChildStateMachine } from "./ChildStateMachine.js";

export type ParentStateMachineContext = {
  child: ActorRefFrom<typeof createChildStateMachine> | null;
};

export type ParentStateMachineEvent =
  | {
      type: "ADD_CHILD";
    }
  | { type: "CALL_CHILD" };

export type ParentStateMachineState = {
  value: "active";
};

export function createParentStateMachine() {
  return setup({
    types: {} as {
      context: ParentStateMachineContext;
      events: ParentStateMachineEvent;
      state: ParentStateMachineState;
      actions: {
        type: "callChild";
        params: {
          child: ActorRefFrom<typeof createChildStateMachine>;
        };
      };
    },
    actions: {
      callChild: (
        _,
        params: { child: ActorRefFrom<typeof createChildStateMachine> }
      ) => {
        params.child.send({ type: "SET_VALUE" });
      },
    },
  }).createMachine({
    context: {
      child: null,
    },
    initial: "active",
    states: {
      active: {
        on: {
          ADD_CHILD: {
            actions: enqueueActions(({ context, enqueue, self }) => {
              const child = createChildStateMachine();

              enqueue.assign(({ spawn }) => ({
                child: spawn(child),
              }));

              self.send({ type: "CALL_CHILD" });
            }),
          },
          CALL_CHILD: {
            actions: enqueueActions(({ context, enqueue }) => {
              enqueue({
                type: "callChild",
                params: {
                  child: context.child!,
                },
              });
            }),
          },
        },
      },
    },
  });
}
