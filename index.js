const express = require('express');
const app = express();
const path = require('path');

// Middleware باش نقراو البيانات اللي جاية من الـ Forms
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// باش السيرفر يقرا كاع الملفات الثابتة (HTML, CSS, JS) الموجودة في نفس المجلد
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

// مسار استقبال الحجوزات (من reservation.html)
app.post('/api/reservations', (req, res) => {
    const newReservation = req.body;
    console.log("Nouvelle réservation reçue :", newReservation);
    // هنا تقدر تسجلها في Base de données أو تابلو فـ الذاكرة
    res.json({ success: true, message: "Réservation enregistrée avec succès !" });
});

// تشغيل السيرفر على المنفذ المخصص من Railway أو 3000 محلياً
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
