import client from "./client"

export const createOrder = async (orderData) => {
  try {
    const response = await client.post("/api/orders/create", orderData);
    return response.data;
  } catch (error) {
    console.error("주문 생성 API 호출 중 에러 발생:", error);
    throw error;
  }
};
