# Todoist Program

An [Membrane.io](https://membrane.io/) program to manage your tasks lists.

## Usage

 - Install directly from VSCode: vscode://membrane.membrane/directory/example-todo (requires Membrane Extension).
 - Alternatively, clone this repo in your Membrane workspace.

## Queries
Get one of tasks
```
mctl query "todo:one(id:8)" "{ id title dueDate }"

Result:

{
  "id": 8,
  "title": "wake up",
  "dueDate": "07:00"
}
```

Get all tasks
```
mctl query "todo:page.items" "{ id title dueDate }"

Result:

[
  {
    "id": 8,
    "title": "wake up",
    "dueDate": "07:00"
  }
]
```

## Actions

Add Task

$~~~~$`mctl action "todo:add(title:'wake up', dueDate:'07:00')"`

Edit task

$~~~~$`mctl action "todo:one(id:1).update(dueDate:'08:00', title:'Wake up')`

Mark as completed

$~~~~$`mctl action "todo:one(id:1).completed"`

Delete a task

$~~~~$`mctl action "todo:one(id:1).remove"`

Delete completed tasks

$~~~~$`mctl action "todo:deleteCompleted"`

Delete all tasks

$~~~~$`mctl action "todo:deleteAllTasks"`
