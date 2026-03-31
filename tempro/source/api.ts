import axios, {type AxiosError} from 'axios';
import type {Task, TaskCreateData, TaskUpdateData, ApiError} from './types.js';

const API_BASE_URL =
	process.env.API_BASE_URL || 'http://localhost:8000/api/tasks';

const api = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

export async function createTask(data: TaskCreateData): Promise<Task> {
	const response = await api.post<Task>('', data);
	return response.data;
}

export async function getTask(taskId: string): Promise<Task> {
	const response = await api.get<Task>(`/${taskId}`);
	return response.data;
}

export async function getAllTasks(): Promise<Task[]> {
	const response = await api.get<Task[]>('');
	return response.data;
}

export async function updateTask(
	taskId: string,
	data: TaskUpdateData,
): Promise<Task> {
	const response = await api.put<Task>(`/${taskId}`, data);
	return response.data;
}

export async function deleteTask(taskId: string): Promise<void> {
	await api.delete(`/${taskId}`);
}

export function getErrorMessage(error: unknown): string {
	if (axios.isAxiosError(error)) {
		const axiosError = error as AxiosError<ApiError>;
		if (axiosError.response?.data?.detail) {
			return axiosError.response.data.detail;
		}

		if (axiosError.code === 'ECONNREFUSED') {
			return 'Cannot connect to backend server. Is it running?';
		}

		return axiosError.message;
	}

	if (error instanceof Error) {
		return error.message;
	}

	return 'An unknown error occurred';
}
