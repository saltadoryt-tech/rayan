const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

let reservations = [];
let reviews = [
    { name: "أمير", rating: 5, comment: "خدمة ممتازة وكلشي نقي!", date: "2026-08-08" }
];

// تسجيل حجز أو طلبية جديدة (مع الثمن وتفاصيل الطلب)
app.post('/api/reservations', (req, res) => {
    const { name, phone, persons, dateTime, items, totalPrice } = req.body;
    const newOrder = {
        name: name || "زبان غير محدد",
        phone: phone || "لا يوجد",
        persons: persons || 1,
        dateTime: dateTime || new Date().toISOString(),
        items: items || "حجز طاولة عادي", // شنو دار في الكوموند
        totalPrice: Number(totalPrice) || 150, // شحال خلص
        status: 'قيد الانتظار'
    };
    
    reservations.push(newOrder);
    console.log('طلبية جديدة:', newOrder);
    res.status(201).json({ message: 'تمت الطلبية بنجاح!', data: newOrder });
});

// جلب جميع الطلبات والحجوزات
app.get('/api/reservations', (req, res) => {
    res.json(reservations);
});

// تحديث حالة الحجز أو الطلب (قبول / إلغاء)
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

// جلب الإحصائيات والأرباح
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
        orders: reservations // إرسال كافة الطلبات لتظهر في الجدول الجديد
    });
});

// جلب الآراء
app.get('/api/reviews', (req, res) => {
    res.json(reviews);
});

app.listen(PORT, () => {
    console.log(`السيرفر شغال بنجاح على الرابط: http://localhost:${PORT}`);
});
