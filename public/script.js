document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('reservationForm');
    const reservationsList = document.getElementById('reservationsList');

    function loadReservations() {
        fetch('/api/reservations')
            .then(res => res.json())
            .then(data => {
                reservationsList.innerHTML = '';
                data.forEach(r => {
                    const li = document.createElement('li');
                    li.textContent = `${r.name} - loc ${r.seat}`;
                    reservationsList.appendChild(li);
                });
            });
    }

    form.addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const seat = document.getElementById('seat').value;
        fetch('/api/reserve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, seat })
        })
        .then(res => res.json())
        .then(() => {
            form.reset();
            loadReservations();
        });
    });

    loadReservations();
});
