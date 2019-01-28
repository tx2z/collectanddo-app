namespace graphModel {
    export interface Group {
        id: number;
        title: string;
        content: string;
        color: string;
        created?: string;
        group_todos?: Array<GroupTodo>;
    }
    export interface Todogroup {
        group: Group;
    }
    export interface GroupTodo {
        todo: Todo;
    }
    export interface Todo {
        id: number;
        title: string;
        content: string;
        url: string;
        done: boolean;
        created?: string;
        todo_groups?: Array<Todogroup>;
    }
    export interface Event {
        id: number;
        title: string;
        content: string;
        start: string;
        end: string;
        todo_groups?: Array<Todogroup>;
    }
}
