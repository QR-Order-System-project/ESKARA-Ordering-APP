import client from "./client";

// 손님: 결제 상세 조회
export const getPaymentDetail = async (tableNumber) => {
  const response = await client.get(`/api/payments/detail/${tableNumber}`);
  return response.data;
};

// 손님: 결제 활성화 여부 확인
export const getPaymentAble = async () => {
  const response = await client.get("/api/payment/global-payment/get");
  return response.data.paymentAble;
};
