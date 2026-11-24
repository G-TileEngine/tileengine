                                   
const isObj = (v         )           => typeof v === "object" && v !== null && !Array.isArray(v);
const list = (v         )                     => (Array.isArray(v) ? v : []);
                                                                                                     
                                                                                                                                                             
/** Stage setup wins, else the project setup, else catalogue defaults. */
export function ruleOf(project         , stageId        , behaviourId        )          {
  const stage = project.stages[stageId], root = isObj(project.manifest) && isObj(project.manifest["project"]) ? project.manifest["project"] : {};
  const hit = (ids                    , source                     )                 => { for (const id of ids) { if (typeof id !== "string") continue; const setup = project.setups[id]; if (isObj(setup) && setup["behaviourId"] === behaviourId) return { source, setupId: id }; } return null; };
  return hit(isObj(stage) ? list(stage["rules"]) : [], "stage") ?? hit(list(isObj(root) ? root["rules"] : undefined), "project") ?? { source: "default", setupId: "" };
}
