export interface Task {
	task_id: string;
	task_title: string;
	end_date: string;
	end_time: string;
	task_description: string;
}

export interface TaskCreateData {
	task_title: string;
	end_date: string;
	end_time: string;
	task_description?: string;
}

export interface TaskUpdateData {
	task_title?: string;
	end_date?: string;
	end_time?: string;
	task_description?: string;
}

export interface ApiError {
	detail: string;
}
