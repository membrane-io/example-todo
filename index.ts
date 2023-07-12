// `nodes` contain any nodes you add from the graph (dependencies)
// `root` is a reference to this program's root node
// `state` is an object that persist across program updates. Store data here.
import { nodes, root, state } from "membrane";

state.tasks = state.tasks ?? [];
state.nextId = state.nextId ?? 1;

export const Root = {
  one: ({ args: { id } }) => state.tasks.find((task) => task.id === id),
  page: () => ({
    items: state.tasks,
    next: null, // TODO!
  }),
  tests: () => ({}),
};

export const Tests = {
  testCreateTask: async () => {
    const id = await root.add({ title: "Test Task", dueDate: "2000-01-01" });
    if (typeof id === "number") {
      return true;
    }
    return false;
  },
  testDeleteAllTask: async () => {
    // await root.deleteAllTasks();
    // return state.tasks.length === 0;
    return false;
  },
  testDeleteCompleted: async () => {
    await root.deleteCompleted();
    return state.tasks.every((task) => !task.isCompleted);
  },
  testUpdateTask: async () => {
    const id = await root.add({ title: "Test Task", dueDate: "2000-01-01" });
    await root.one({ id }).update({ title: "Updated Task" });
    return state.tasks.find((task) => task.id === id).title === "Updated Task";
  },
  testCompleteTask: async () => {
    const id = await root.add({ title: "Test Task", dueDate: "2000-01-01" });
    await root.one({ id }).completed();
    return state.tasks.find((task) => task.id === id).isCompleted;
  },
  testDeleteTask: async () => {
    const id = await root.add({ title: "Test Task", dueDate: "2000-01-01" });
    await root.one({ id }).remove();
    return state.tasks.find((task) => task.id === id) === undefined;
  }
};

export const Task = {
  // The value of this field determines "the identity" of this node.
  //
  // Every type gets this field automatically so you don't have to declare it in memconfig.json
  //
  // The resolver below must return a gref that uniquely identifies the node.
  //
  // In many cases Membrane figures out this value automatically but it currently cannot do it
  // for list items because it doesn't know what property to use as the id. For example a collection of users could be
  // identified by their "username" property, in this case the tasks are identified by their ID, but it could be equally
  // valid to identify items by their index, or even a combination of multiple properties.
  //
  // We need to figure out a way to make this automatic for lists as well. Perhaps some metadata in memconfig.json?
  //
  // For now this field is required for any type that can be returned in a list.
  gref({ obj }) {
    return root.one({ id: obj.id });
  },
  update({ self, args }) {
    const { id } = self.$argsAt(root.one);
    const result = state.tasks.find((task) => task.id === id);
    result.title = args.title ?? result.title;
    result.dueDate = args.dueDate ?? result.dueDate;
  },
  remove({ self }) {
    const { id } = self.$argsAt(root.one);
    const index = state.tasks.findIndex((task) => task.id === id);
    state.tasks.splice(index, 1);
  },
  completed({ self, args }) {
    const { id } = self.$argsAt(root.one);
    const result = state.tasks.find((task) => task.id === id);
    result.isCompleted = !result.isCompleted;
    return result.isCompleted;
  },
};

export async function add({ args }) {
  const id = state.nextId++;
  state.tasks.push({
    id,
    title: args.title,
    dueDate: args.dueDate,
    isCompleted: false,
  });
  return id;
}

export async function deleteCompleted() {
  state.tasks = state.tasks.filter((task) => {
    return !task.isCompleted;
  });
}

export async function deleteAllTasks() {
  state.tasks = [];
}
