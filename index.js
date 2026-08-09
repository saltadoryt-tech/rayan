const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// باش السيرفر يقرا الملفات الثابتة والصافحات
app.use(express.static(path.join(__dirname)));

// === مسارات صفحات الموقع (HTML) ===
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'nakhil.html'));
});

app.get('/menu', (req, res) => {
    res.sendFile(path.join(__dirname, 'menu.html'));
});

app.get('/reservation', (req, res) => {
    res.sendFile(path.join(__dirname, 'reservation.html'));
});

app.get('/loging', (req, res) => {
    res.sendFile(path.join(__dirname, 'loging.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

app.get('/analytics', (req, res) => {
    res.sendFile(path.join(__dirname, 'analytics.html'));
});

// === الـ APIs ديال الحجوزات والإحصائيات اللي كانت عندك ===
let reservations = [];
let reviews = [ 
    { name: "أمير", rating: 5, comment: "!خدمة ممتازة وكلشي نقي", date: "2026-08-08" } 
];

app.post('/api/reservations', (req, res) => {
    const { name, phone, persons, dateTime, items, totalPrice } = req.body;
    const newOrder = {
        name: name || "زبان غير محدد",
        phone: phone || "لا يوجد",
        persons: persons || 1,
        dateTime: dateTime || new Date().toISOString(),
        items: items || "حجز طاولة عادي",
        totalPrice: Number(totalPrice) || 150,
        status: 'قيد الانتظار'
    };
    reservations.push(newOrder);
    res.status(201).json({ message: '!تمت الطلبية بنجاح', data: newOrder });
});

app.get('/api/reservations', (req, res) => {
    res.json(reservations);
});

app.put('/api/reservations/:index', (req, res) => {
    const index = req.params.index;
    const { status } = req.body;
    if (reservations[index]) {
        reservations[index].status = status;
        res.json({ message: 'تم التحديث بنجاح', data: reservations[index] });
    } else {
        res.status(404).json({ message: 'الطلب غير موجود' });
    }
});

app.get('/api/stats', (req, res) => {
    let totalRevenue = reservations
        .filter(r => r.status === 'مقبول')
        .reduce((sum, r) => sum + Number(r.totalPrice || 0), 0);

    let totalReservations = reservations.length;
    let acceptedReservations = reservations.filter(r => r.status === 'مقبول').length;

    res.json({
        totalRevenue,
        totalReservations,
        acceptedReservations,
        orders: reservations
    });
});

app.get('/api/reviews', (req, res) => {
    res.json(reviews);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
