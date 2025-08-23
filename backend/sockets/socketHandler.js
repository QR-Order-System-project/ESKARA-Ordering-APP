function socketHandler(io) {
  io.on('connection', (socket) => {
    console.log('연결됨:', socket.id);

    socket.on('callStaff', async (data) => {
      await db.collection('staffCalls').add({
        ...data,
        createdAt: new Date().toISOString(),
      });
      io.emit('staffCalled', data);
    });

    socket.on('completeMenu', async ({ menu, table }) => {
      const menuRef = db.collection('menuQueue').doc(menu);
      const doc = await menuRef.get();
      if (doc.exists) {
        let queue = doc.data().queue || [];
        const index = queue.indexOf(table);
        if (index !== -1) {
          queue.splice(index, 1);
          await menuRef.set({ queue });
          io.emit('menuUpdated', { menu, queue });
        }
      }
    });

    socket.on('completeCall', async (table) => {
      const snapshot = await db.collection('staffCalls')
        .where('table', '==', table).get();
      snapshot.forEach((doc) => doc.ref.delete());
      io.emit('callCleared', table);
    });
  });
}
module.exports = socketHandler;
