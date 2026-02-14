document.addEventListener('DOMContentLoaded', () => {
    const scheduleContainer = document.getElementById('schedule');
    const searchInput = document.getElementById('categorySearch');
    let allTalks = [];

    // Fetch talks from the API
    fetch('/api/talks')
        .then(response => response.json())
        .then(data => {
            allTalks = data;
            renderSchedule(allTalks);
        })
        .catch(error => {
            console.error('Error fetching talks:', error);
            scheduleContainer.innerHTML = '<p class="text-danger text-center">Error loading schedule. Please try again later.</p>';
        });

    // Search functionality
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredTalks = allTalks.filter(talk => 
            talk.categories.some(cat => cat.toLowerCase().includes(searchTerm))
        );
        renderSchedule(filteredTalks);
    });

    function renderSchedule(talks) {
        scheduleContainer.innerHTML = '';

        if (talks.length === 0) {
            scheduleContainer.innerHTML = '<div class="col-12 text-center py-5"><h3>No talks found matching that category.</h3></div>';
            return;
        }

        talks.forEach((talk, index) => {
            // Insert Lunch Break after the 3rd talk
            if (index === 3 && searchInput.value === '') {
                const lunchDiv = document.createElement('div');
                lunchDiv.className = 'col-12';
                lunchDiv.innerHTML = `
                    <div class="lunch-break shadow-sm">
                        <span class="fs-4">🍱 Lunch Break</span><br>
                        1:20 PM - 2:20 PM
                    </div>
                `;
                scheduleContainer.appendChild(lunchDiv);
            }

            const card = document.createElement('div');
            card.className = 'col-md-6 col-lg-4';
            card.innerHTML = `
                <div class="card h-100 talk-card shadow-sm">
                    <div class="card-body">
                        <div class="time-slot mb-2">${talk.time}</div>
                        <h5 class="card-title fw-bold">${talk.title}</h5>
                        <p class="speaker-name mb-3">By: ${talk.speakers.join(' & ')}</p>
                        <p class="card-text text-muted">${talk.description}</p>
                    </div>
                    <div class="card-footer bg-transparent border-0 pb-3">
                        ${talk.categories.map(cat => `<span class="badge rounded-pill bg-info text-dark category-badge">${cat}</span>`).join('')}
                    </div>
                </div>
            `;
            scheduleContainer.appendChild(card);
        });
    }
});
