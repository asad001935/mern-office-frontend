import { http } from "./http";

export const askAssistant = async (question) => {
  const res = await http.post("/api/assistant/ask", { question });
  return res.data?.data;
};
