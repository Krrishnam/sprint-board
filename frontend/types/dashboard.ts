export interface ActiveSprint{
    id : string;
    name : string;
}

export interface DashboardData{
    total_tasks : number;
    todo_tasks : number;
    in_progress_tasks : number;
    in_review_tasks : number;
    completed_tasks : number;
    activesprint : ActiveSprint | null;
}