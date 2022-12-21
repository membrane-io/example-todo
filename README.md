# Todoist Program

An [Membrane.io](https://membrane.io/) program to manage your tasks lists.

## Usage

1. Install the [Membrane VSCode Extension](https://marketplace.visualstudio.com/items?itemName=membrane.membrane).
2. Setup on extension your [Membrane's CLI binary (mctl)](https://membrane.io/download) path.
3. Login / Sign up with ```mctl login```.
4. Update the program on Membrane with the VSCode Command palette `(cmd+shift+p)`\
  ```> Membrame: Update current program```

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
Edit task\
$~~~~$`mctl action "todo:one(id:1).update(dueDate:'08:00', title:'Wake up')`\
Delete task\
$~~~~$`mctl action "todo:one(id:1).remove"`\
Mark as completed\
$~~~~$`mctl action "todo:one(id:1).completed"`

Add Task\
$~~~~$`mctl action "todo:add(title:'wake up', dueDate:'07:00')"`\
Delete completed tasks\
$~~~~$`mctl action "todo:deleteCompleted"`\
Delete all tasks\
$~~~~$`mctl action "todo:deleteAllTasks"`

# Schema

### Types
```javascript
<Root>
    - Fields
        one(id) -> <TASK>
        page() -> <TASKPAGE>
    - Actions
        add(title, dueDate) -> Int
        deletedCompleted() -> void
        deleteAllTasks() -> void
<TaskPage>
    - Fields
        items() -> List <TASK>
        next() -> Ref <TASKPAGE>
<Task>
    - Fields
       id -> Int
       title -> String
       dueDate -> String
       isComplete -> Boolean
    - Actions
        update(title, dueDate) -> void
        remove() -> void
        completed() -> void
```