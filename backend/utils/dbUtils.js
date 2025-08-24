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

module.exports = { addOrderToDB, finalizeAndClearOrder, getTimeSlot };
