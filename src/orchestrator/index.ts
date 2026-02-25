import { createPlan } from "./planAgent";
import { extractContext } from "./contextAgent";
import { validateContext } from "./validateContext";
import { executePlan } from "./executePlan";
import { mergeContext } from "./mergeContext";

export async function orchestrate({
  intent,
  approved,
  accessToken,
  previousState,
  userInput,
}: {
  intent: string;
  approved: boolean;
  accessToken: string;
  previousState?: any;
  userInput?: any;
}) {
  if (!accessToken) {
    throw new Error("Missing access token API");
  }

  // 1️⃣ Rehydrate or initialize state
  const state = previousState || {};

  // 2️⃣ Extract context only once
  if (!state.context) {
    state.context = await extractContext(intent);
    // const context = {
    //   contactName: "Hari",
    //   event: {
    //     title: "Meeting with praveen",
    //     description: "Meeting scheduled with praveen",
    //     startDateTime: "2026-02-26T12:00:00+05:30",
    //     endDateTime: null,
    //   },
    //   email: {
    //     subject: "Meeting Tomorrow",
    //     body: "he should be available before 10 in the office",
    //   },
    // };
    // state.context = context;
  }

  // 3️⃣ Merge user fixes into context
  state.context = mergeContext(state.context, userInput);
  console.log("the merged context: ", state.context)

  // 4️⃣ Create plan only once
  if (!state.plan) {
    state.plan = await createPlan(intent);
  }

  let plan = state.plan;
  const context = state.context;

  // 5️⃣ Execute SAFE steps only (idempotent)
  if (plan.includes("find_contact") && !state.context.contact) {
    await executePlan({
      plan: ["find_contact"],
      accessToken,
      context,
      state,
    });
    plan = plan.filter((item: any)=> item != "find_contact")
  }
  console.log("the state after contact retrival is: ", JSON.stringify(state, null, 2))

  // 6️⃣ Validate
  const issues = validateContext({
    plan,
    context,
    state,
  });

  if (issues.length > 0) {
    return {
      status: "needs_input",
      issues,
      state,
    };
  }

  // 7️⃣ Approval gate
  if (!approved) {
    return {
      status: "needs_approval",
      preview: {
        plan,
        context,
        state,
      },
      state,
    };
  }

  // 8️⃣ Execute full plan
  await executePlan({
    plan,
    accessToken,
    context,
    state,
  });

  return {
    status: "completed",
    result: state,
  };
}
