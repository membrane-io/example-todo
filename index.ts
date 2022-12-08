// `nodes` contain any nodes you add from the graph (dependencies)
// `root` is a reference to this program's root node
// `state` is an object that persist across program updates. Store data here.
import { nodes, root, state } from "membrane";

state.tasks = [];

export async function getAllTask({ args }) {
  return state.tasks;
}

export async function getTask({ args }) {
  return state.tasks.find((task) => task.id === args.id);
}

export async function addTask({ args }) {
  state.tasks.push({
    id: args.id,
    title: args.title,
    dueDate: args.dueDate,
  });
}

export async function editTask({ args }) {
  const result = state.tasks.find((task) => task.id === args.id);
  result.title = args.title ?? result.title;
  result.dueDate = args.dueDate ?? result.dueDate;
}

export async function deleteTask({ args }) {
  const index = state.tasks.findIndex((task) => task.id === args.id);
  delete state.tasks[index];
}

export async function endpoint({ args: { path, query, headers, body } }) {
  return await nodes.html.formFor({ action: "root.addTask" }).$invoke();
}

// interface Task {
//   id: number,
//   title: string,
//   dueDate: string,
// }
