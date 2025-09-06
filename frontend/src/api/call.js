import client from "./client";

export const callEmployee = async (callData) => {
  try {
    const response = await client.post("/api/employee/call", callData);
    return response.data;
  } catch (error) {
    console.error("직원 호출 API 호출 중 에러 발생:", error);
    throw error;
  }
};