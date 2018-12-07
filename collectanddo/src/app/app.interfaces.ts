export interface Group {
    id: number;
    title: string;
    content: string;
    color: string;
}

export interface Todogroup {
    group: Group;
}

export interface Todo {
    id: number;
    title: string;
    content: string;
    url: string;
    done: boolean;
    todo_groups: Array<Todogroup>;
}

