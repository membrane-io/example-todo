// `nodes` contain any nodes you add from the graph (dependencies)
// `root` is a reference to this program's root node
// `state` is an object that persist across program updates. Store data here.
import { nodes, root, state } from "membrane";

state.tasks = state.tasks ?? [];
state.nextId = 1;

export const Root = {
  one: ({ args: { id } }) => state.tasks.find((task) => task.id === id),
  page: () => ({
    items: state.tasks,
    next: null, // TODO!
  }),
};

export async function add({ args }) {
  const id = state.nextId++;
  state.tasks.push({
    id,
    title: args.title,
    dueDate: args.dueDate,
  });
  return id;
}

export async function removeAll() {
  state.tasks = [];
  return "Done";
}

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
};

export async function endpoint({ args: { path, method, body, query } }) {
  const queryParams = new URLSearchParams(query);
  const bodyParams = new URLSearchParams(body);
  const endpointUrl = await nodes.endpoint.$get();

  // Form of create task
  if (path === "/add") {
    if (method === "POST") {
      add({
        args: {
          title: bodyParams.get("title"),
          dueDate: bodyParams.get("dueDate"),
        },
      });
    }
    // ?gref=root.add
    return nodes.html
      .form({
        action: "root.add",
        path: "add",
        method: "POST",
        title: "Add",
      })
      .$get();
  }

  // Form of create task
  if (path === "/edit") {
    // update post
    if (method === "POST") {
      root
        .one({ id: parseInt(bodyParams.get("id") as string) })
        .update({
          title: bodyParams.get("title") as string,
          dueDate: bodyParams.get("dueDate") as string,
        })
        .$invoke();
    }
    // ?gref=root.add
    return nodes.html
      .form({
        action: "todo:one(id:1).update(dueDate:2022-02-02,title:demo)",
        path: "edit",
        method: "POST",
        title: "Update",
      })
      .$get();
  }

  // Receive POST data for new Task
  // Get one task with tasks?id=1
  if (path === "/task") {
    const id = queryParams.get("id");
    return nodes.html
      .render({ field: "todo:tasks.one(id:5)", url: endpointUrl })
      .$get();
  }
}
