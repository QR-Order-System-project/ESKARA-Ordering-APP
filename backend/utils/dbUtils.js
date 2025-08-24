const getTimeSlot = () => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}${mm}${dd}`;
};

const addOrderToDB = async ({ tableNumber, items }) => {
  const timeSlot = getTimeSlot();
  const now = new Date().toISOString();

  const orderRef = db.collection('orders')
    .doc(timeSlot)
    .collection('tables')
    .doc(`table-${tableNumber}`);

  const existing = await orderRef.get();
  let prev = existing.exists ? existing.data().items : [];

  await orderRef.set({
    tableNumber,
    date: timeSlot,
    createdAt: now,
    items: [...prev, ...items],
    updatedAt: now,
  });

  const queueRef = db.collection('menuQueue');
  for (const item of items) {
    const menuRef = queueRef.doc(item.menu);
    const doc = await menuRef.get();
    let queue = doc.exists ? doc.data().queue : [];
    if (!queue.includes(tableNumber)) queue.push(tableNumber);
    await menuRef.set({ queue });
  }
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

const removeTableFromMenu = async (menu, tableNumber) => {
  const menuRef = db.collection('menuQueue').doc(menu);
  const doc = await menuRef.get();
  if (doc.exists) {
    let queue = doc.data().queue || [];
    const index = queue.indexOf(tableNumber);
    if (index !== -1) {
      queue.splice(index, 1);
      await menuRef.set({ queue });
    }
  }
};

const deleteTableMenuWithoutRecord = async (tableNumber, menu) => {
  const timeSlot = getTimeSlot();
  const orderRef = db.collection('orders')
    .doc(timeSlot)
    .collection('tables')
    .doc(`table-${tableNumber}`);

  const snapshot = await orderRef.get();
  if (!snapshot.exists) return;

  const data = snapshot.data();
  const filteredItems = data.items.filter(item => item.menu !== menu);

  await orderRef.set({
    ...data,
    items: filteredItems,
    updatedAt: new Date().toISOString(),
  });

  await removeTableFromMenu(menu, tableNumber);
};

module.exports = {
  addOrderToDB,
  finalizeAndClearOrder,
  getTimeSlot,
  removeTableFromMenu,
  deleteTableMenuWithoutRecord
};
