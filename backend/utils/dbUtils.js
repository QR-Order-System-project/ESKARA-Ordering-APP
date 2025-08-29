const getTimeSlot = () => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}${mm}${dd}`;
};

// orders 에 추가 
const addOrderToOrdersDB = async ({ tableNumber, items }) => {
  const timeSlot = getTimeSlot();
  const now = new Date().toISOString();

  // 주문 참조 
  const orderRef = db.collection('orders')
    .doc(timeSlot)
    .collection('tables')
    .doc(`table-${tableNumber}`);

  // 기존 주문을 가져와서 count 반영 
  const snapshot = await orderRef.get();
  let newOrderItems = snapshot.exists ? snapshot.data().items : {};
  for (const [menu, count] of Object.entries(items)) {
      newOrderItems[menu] = (newOrderItems[menu] || 0) + count;
  }

  // 수정한 정보를 DB 에 반영
  await orderRef.set({
    tableNumber: tableNumber,
    items: newOrderItems,
    updatedAt: now
  }, { merge: true }); // merge : 명시한 정보만 업데이트, 나머지는 기존값 유지

};


//  menuQueue 에 추가 
const addMenuToMenuQueueDB = async ({ tableNumber, items }) => {
  // 메뉴 큐 참조 
  const menuQueueRef = db.collection('menuQueue');
  let newMenuQueue = menuQueueRef.exists ? menuQueueRef : [];
  for (const [menu, count] of Object.entries(items)) {
    let targetMenu = menuQueueRef.exists ? menuQueueRef.doc('menu') : [];
    for (let i = 0; i < count; i++) {
      targetMenu.push(tableNumber);
    }
  }
  // 수정한 정보를 DB 에 반영 (의견 필요)
  await menuQueueRef.set({

  });
    

};

// menuQueue 에서 삭제  
const deleteOrdersFromMenuQueueDB = async ({ menu, count }) => {
  
};





// orders 에서 count 변경
const discountCountFromOrders = async({menu, count}) => {

};


const finalizeAndClearOrder = async (tableNumber) => {
  const timeSlot = getTimeSlot();
  const orderRef = db.collection('orders')
    .doc(timeSlot)
    .collection('tables')
    .doc(`table-${tableNumber}`);

  const snapshot = await orderRef.get();
  if (!snapshot.exists) return;

  const data = snapshot.data();

  await db.collection('archives')
    .doc(timeSlot)
    .collection('tables')
    .doc(`table-${tableNumber}-${Date.now()}`)
    .set(data);

  await orderRef.delete();
};



module.exports = {
  addOrderToDB,
  finalizeAndClearOrder,
  getTimeSlot,
  removeTableFromMenu,
  deleteTableMenuWithoutRecord
};
