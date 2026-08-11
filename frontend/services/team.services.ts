import api from "@/lib/axios";
import {
  Team,
  CreateTeamRequest,
  UpdateTeamRequest,
} from "@/types/team";

export const getTeams = async (): Promise<Team[]> => {
  const response = await api.get("/teams");
  return response.data;
};

export const getTeam = async (id: string): Promise<Team> => {
  const response = await api.get(`/teams/${id}`);
  return response.data;
};

export const createTeam = async (
  data: CreateTeamRequest
) => {
  const response = await api.post("/teams", data);
  return response.data;
};

export const updateTeam = async (
  id: string,
  data: UpdateTeamRequest
) => {
  const response = await api.put(`/teams/${id}`, data);
  return response.data;
};

export const deleteTeam = async (id: string) => {
  const response = await api.delete(`/teams/${id}`);
  return response.data;
};