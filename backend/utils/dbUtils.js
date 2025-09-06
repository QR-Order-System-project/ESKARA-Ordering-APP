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
  for (const item of items) {
    const menuName = item.menu;
    const menuCount = item.count;
    
    newOrderItems[menuName] = (newOrderItems[menuName] || 0) + menuCount;
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
    const docRef = db.collection('queues').doc('menuQueue');
    await db.runTransaction(async (tx) => {
      const snap = await tx.get(docRef);
      const current = snap.exists ? snap.data() : {};
      const target = { ...current };


    for (const {menu, count} of items) {
      const queue = Array.isArray(target[menu]) ? target[menu].slice() : [];
      for (let i = 0; i < count; i++) queue.push(tableNumber);
      target[menu] = queue;
    }
    // merge:true 로 필요한 필드만 갱신
    tx.set(docRef, target, { merge: true });
  });

};

// menuQueue 에서 삭제  
const deleteOrdersFromMenuQueueDB = async ({ tableNumber, menu }) => {
  const docRef = db.collection('queues').doc('menuQueue');

  await db.runTransaction(async (tx) => {
      const snap = await tx.get(docRef);
      const current = snap.exists ? snap.data() : {};
      const target = { ...current };

      const queue = target[menu].slice();

      const idx = queue.lastIndexOf(tableNumber);

      if (idx !== -1) {
       queue.splice(idx, 1); // 해당 위치 요소 1개 삭제
      }
    // merge:true 로 필요한 필드만 갱신
    target[menu] = queue;
    
    tx.set(docRef, target, { merge: true });
  });
};



// orders 에서 count 변경
// items 이랑 updateAt 만 변경
const discountCountFromOrders = async({tableNumber, menu}) => {
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
  newOrderItems[menu] = newOrderItems[menu]-1;
  
  if (newOrderItems[menu] === 0) {
    delete newOrderItems[menu];
  }

  // 수정한 정보를 DB 에 반영
  await orderRef.set({
    tableNumber: tableNumber,
    items: newOrderItems,
    updatedAt: now
  }, { merge: true }); // merge : 명시한 정보만 업데이트, 나머지는 기존값 유지
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



const addOrderToArchive = async ({ timeSlot, tableNumber, data, totalAmount }) => {
  const archiveRef = db
    .collection("archives")
    .doc(timeSlot)
    .collection("tables")
    .doc(`table-${tableNumber}-${Date.now()}`);

  await archiveRef.set({
    ...data,
    totalAmount
  });
};

const deleteOrderFromOrders = async ({ timeSlot, tableNumber }) => {
  const orderRef = db
    .collection("orders")
    .doc(timeSlot)
    .collection("tables")
    .doc(`table-${tableNumber}`);

  await orderRef.delete();
};

const getArchivedOrders = async (timeSlot = getTimeSlot()) => {
  try {
    const archive = db
      .collection("archives")
      .doc(timeSlot)
      .collection("tables");

    const snapshot = await archive.get();

    const archivedOrders = [];

    snapshot.forEach(doc => {
      const data = doc.data();

      archivedOrders.push({
        tableNumber: data.tableNumber,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        items: data.items || {},
        totalAmount: data.totalAmount ?? 0,
        archiveId: doc.id
      });
    });

    return archivedOrders;
  } catch (err) {
    console.error("아카이브 주문 조회 실패:", err);
    throw err;
  }
};

module.exports = {
  addOrderToOrdersDB,
  addMenuToMenuQueueDB,
  deleteOrdersFromMenuQueueDB,
  discountCountFromOrders,
  finalizeAndClearOrder,
  getTimeSlot,
  addOrderToArchive,
  deleteOrderFromOrders,
  getArchivedOrders
};
