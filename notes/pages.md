# PAGES

## COLLECT

### COLLECT
Add a new todo
```
mutation insert_todo {
  insert_todo(
    objects: [
      {
        title: "insert-todo", 
        content: "test insert", 
        url: "http://testinsert.com"
      }
    ]
  ) {
    returning {
      id
      title
    }
  }
}
```
Add todo with group
```
mutation insert_todo {
  insert_todo(
    objects: [
      {
        title: "insert-todo", 
        content: "test insert", 
        url: "http://testinsert.com",
        todo_groups: {
          data: [
            {
              group: {
                data: {
                  title: "insert-group2", 
                  content: "test insert group2"
                }
              }
            },
            {
              group: {
                data: {
                  title: "insert-group3", 
                  content: "test insert group3"
                }
              }
            }
          ]
        }
      }
    ]
  ) {
    returning {
      id
      title
      todo_groups {
        group {
          id
          title
          content
          color
        }
      }
    }
  }
}

```

### COLLECTED
All todos
```
query {
  todo (
    order_by: [{created: desc}, {updated: desc}]
    ) {
    id
    title
    content
    url
    done
    todo_groups (
      order_by: [{group: {created: desc}}, {group: {updated: desc}}]
      ) {
      group {
        id
        title
        color
      }
    }
  }
}
```

### COLLECTIONS
List with all groups with todos
```
query {
  group (
    where: {group_todos: {}},
    order_by: [{created: desc}, {updated: desc}]
    ) {
    id
    title
    color
    group_todos (
      order_by: [{group: {created: desc}}, {group: {updated: desc}}]
      ) {
      todo {
        id
        title
        content
        url
        done
      }
    }
  }
}
```
Not in a group/collection
```
query {
  todo (
    where: {_not: {todo_groups: {}}},
    order_by: [{created: desc}, {updated: desc}]
    ) {
    id
    title
    content
    url
    done
  }
}
```
Create a group
```
mutation insert_group {
  insert_group(
    objects: [
      {
        title: "insert-group", 
        content: "test insert group", 
        color: "primary"
      }
    ]
  ) {
    returning {
      id
      title
    }
  }
}
```
## DO

### DO

#### Calendar view
Calendar with all the planned events

Recover all events of the month:
```
query {
  event (
    where: {_and: [{start: {_gte: "2018-11-01"}}, {start: {_lte: "2018-11-30"}}]},
    order_by: {start: asc}
    ) {
    id
    title
    content
    start
    end
    group {
      id
      title
      color
    }
  }
}

```

#### List view
List with all events

_(same than calendar but different view)_

#### Event view
Event detail

Recover group and to do todos of a given event:
```
query {
  event(
    where: {id : {_eq: 1}}
    ) {
    id
    title
    content
    start
    end
    group {
      id
      title
      color
      group_todos(
        where: {todo: {done: {_eq: true}}},
        order_by: [{todo: {created: desc}}, {todo: {updated: desc}}]
        ) {
        todo {
          id
          title
          content
          url
          done
        }
      }
    }
  }
}

```
#### Add event
Create a new event
```
mutation insert_event {
  insert_event (
    objects: [
      {
        title: "insert-event", 
        content: "test insert group", 
        start: "2018-12-05T20:00",
        end: "2018-12-05T21:00",
        group_id: 3
      }
    ]
  ) {
    returning {
      id
      title
      start
      end
      group {
        id
        title
        content
      }
    }
  }
}

```

### DONE
List of past events with done todos
```
query {
  event (
    where: {start: {_lte: "now"}},
    order_by: {end: desc}
    ) {
    id
    title
    content
    start
    end
    done_todos {
      id
      title
      content
      url
      done
    }
  }

```

# ACTIONS
## UPDATE TODO
```
mutation update_todo {
  update_todo (
    where: {id: {_eq: 1}},
    _set: {
      title: "updated title",
      content: "udated content",
      updated: "now()"
    }
  ) {
    affected_rows
    returning {
      id
      title
      content
    }
  }
}
```
## RELATE TODO & GROUP
```
mutation add_todo_group {
  insert_rel_todo_group (
    objects: [
      {
        group_id: 2,
        todo_id: 8
      }
    ]
  ) {
    returning {
      todo {
        id
        title
        content
      }
      group {
        id
        title
        content
      }
    }
  }
}
```
## CREATE GROUP AND ADD TODO(s)
```
mutation insert_group {
  insert_group(
    objects: [
      {
        title: "insert-group-add-todo", 
        content: "test insert group", 
        group_todos: {
          data: [
            {
              todo_id: 1
            },
            {
              todo_id: 2
            }
          ]
        }
      }
    ]
  ) {
    returning {
      id
      title
      group_todos {
        todo {
          id
          title
          content
        }
      }
    }
  }
}

```
## REMOVE RELATION TODO & GROUP
```
mutation delete_rel_todo_group {
  delete_rel_todo_group (
    where: {
      _and: [
        {todo_id: {_eq: 1}},
        {group_id: {_eq: 7}}
      ]
    }
  ) {
    affected_rows
  }
}
```