// src/services/electoralApi.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export interface VoteData {
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  celular: string;
  departamento: string;
  provincia: string;
  distrito: string;
  candidate_id: string;
}

class ElectoralApiService {
  
  // Registrar voto
  async submitVote(voteData: VoteData) {
    const response = await axios.post(`${API_URL}/votes`, voteData);
    return response.data;
  }

  // Verificar si ya votó
  async checkIfVoted(dni: string, email: string) {
    const response = await axios.get(`${API_URL}/votes/check`, {
      params: { dni, email }
    });
    return response.data.has_voted;
  }

  // Obtener resultados
  async getResults() {
    const response = await axios.get(`${API_URL}/results`);
    return response.data;
  }

  // Obtener candidatos
  async getCandidates() {
    const response = await axios.get(`${API_URL}/candidates`);
    return response.data;
  }
  async analyzeDataQuality() {
    const res = await axios.get(`${API_URL}/analyze`);
    return res.data;
  }

  async cleanNullData() {
    const res = await axios.post(`${API_URL}/clean-null`);
    return res.data;
  }

  async removeDuplicates() {
    const res = await axios.post(`${API_URL}/remove-duplicates`);
    return res.data;
  }

  async normalizeData() {
    const res = await axios.post(`${API_URL}/normalize`);
    return res.data;
  }
  async getAllVotes() {
    const response = await axios.get(`${API_URL}/votes`);
    return response.data;
  }

}

export const electoralApi = new ElectoralApiService();