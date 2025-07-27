import { createActor } from "xstate";
import { createParentStateMachine } from "./ParentStateMachine.js";

describe("example", () => {
  it("will throw a warning", () => {
    const machine = createParentStateMachine();
    const actor = createActor(machine);
    actor.start();
    actor.send({ type: "ADD_CHILD" });
  });
});
