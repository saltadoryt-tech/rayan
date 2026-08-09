const express = require('express');
const app = express();
const path = require('path');

// قوائم مؤقتة لتخزين الحجوزات والآراء في الذاكرة
const reservationsList = [];
const reviewsList = [];

// Middleware لقرائة البيانات لي جاية من Forms
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware باش السيرفر يقرا كاع الملفات الثابتة (HTML, CSS, JS) الموجودة في نفس المجلد
app.use(express.static(path.join(__dirname)));

// مسار الصفحة الرئيسية
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'nakhil.html'));
});

// مسار صفحة تسجيل الدخول (Login)
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'loging.html'));
});

// مسار لوحة التحكم (Admin Dashboard)
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// مسار استقبال الحجوزات من reservation.html
app.post('/api/reservations', (req, res) => {
    const newReservation = req.body;
    reservationsList.push(newReservation); // حفظ الحجز في القائمة
    console.log("Nouvelle réservation reçue :", newReservation);
    res.json({ success: true, message: "Réservation enregistrée avec succès !" });
});

// مسارات إضافية لجلب البيانات للوحة تحكم الأدمن
app.get('/api/admin/reservations', (req, res) => {
    res.json(reservationsList);
});

app.get('/api/admin/reviews', (req, res) => {
    res.json(reviewsList);
});

// تشغيل السيرفر محلياً أو على Railway على المنفذ المخصص
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
