# Todoist Program

An [Membrane.io](https://membrane.io/) program to manage your tasks lists.

## Usage

1. Install the [Membrane VSCode Extension](https://marketplace.visualstudio.com/items?itemName=membrane.membrane).
2. Setup on extension your [Membrane's CLI binary (mctl)](https://membrane.io/download) path.
3. Login / Sign up with ```mctl login```.
4. Update the program on Membrane with the VSCode Command palette `(cmd+shift+p)`
  ```> Membrame: Update current program```

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
## Actions
   
id
        title
        dueDate
        isCompleted
        update(title, dueDate)
        remove()
        completed()