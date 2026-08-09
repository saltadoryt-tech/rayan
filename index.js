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
    const newReservation = {
        id: Date.now().toString(), // إنشاء معرف فريد لكل حجز
        status: 'En attente',     // الحالة الافتراضية عند الحجز
        ...req.body
    };
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

// مسار تحديث حالة الحجز (تأكيد، انتظار، أو إلغاء)
app.patch('/api/admin/reservations/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const reservation = reservationsList.find(r => r.id === id);
    if (!reservation) {
        return res.status(404).json({ success: false, message: 'Réservation non trouvée' });
    }

    reservation.status = status; // تحديث الحالة
    console.log(`Réservation ${id} mise à jour au statut : ${status}`);
    res.json({ success: true, data: reservation });
});

// تشغيل السيرفر محلياً أو على Railway على المنفذ المخصص
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
