const hostname = window.location.hostname;
const API_URL = `http://${hostname}:3000`;

const messageInput = document.getElementById('messageInput');
const submitBtn = document.getElementById('submitBtn');
const fetchBtn = document.getElementById('fetchBtn');
const searchInput = document.getElementById('searchInput');
const resultsContainer = document.getElementById('resultsContainer');
const toast = document.getElementById('toast');
let fetchedData = [];

// Submit Data
submitBtn.addEventListener('click', async () => {
    const content = messageInput.value.trim();
    if (!content) {
        showToast('Please enter some text', '#ef4444');
        return;
    }

    setLoading(submitBtn, true);

    try {
        const response = await fetch(`${API_URL}/data`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content })
        });

        if (response.ok) {
            messageInput.value = '';
            showToast('Data pushed to MySQL successfully!', '#10b981');
            // Auto fetch after submit
            fetchData();
        } else {
            showToast('Error saving data', '#ef4444');
        }
    } catch (error) {
        console.error('Fetch error:', error);
        showToast('Backend connection failed', '#f59e0b');
    } finally {
        setLoading(submitBtn, false);
    }
});

// Fetch Data
fetchBtn.addEventListener('click', fetchData);
searchInput.addEventListener('input', () => renderData(searchInput.value));

async function fetchData() {
    resultsContainer.innerHTML = '<div class="empty-state">Connecting to bridge...</div>';
    
    try {
        const response = await fetch(`${API_URL}/data`);
        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }
        const data = await response.json();
        fetchedData = data;
        renderData(searchInput.value);
    } catch (error) {
        console.error('Fetch error:', error);
        resultsContainer.innerHTML = `
            <div class="empty-state" style="color: #ef4444">
                <strong>Error:</strong> Could not connect to the backend server.<br>
                Make sure the backend is running on ${API_URL}
            </div>
        `;
    }
}

function renderData(searchTerm = '') {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const filteredData = fetchedData.filter(item =>
        item.content.toLowerCase().includes(normalizedSearch)
    );

    if (fetchedData.length === 0) {
        resultsContainer.innerHTML = '<div class="empty-state">Bridge is empty. Start by pushing some data.</div>';
        return;
    }

    if (filteredData.length === 0) {
        resultsContainer.innerHTML = '<div class="empty-state">No messages match your search.</div>';
        return;
    }

    resultsContainer.innerHTML = filteredData.map((item, index) => `
            <div class="data-item" style="animation-delay: ${index * 0.1}s">
                <div class="data-id">ENTRY #${item.id}</div>
                <div class="data-content">${escapeHTML(item.content)}</div>
            </div>
        `).join('');
}

// Utilities
function showToast(message, bgColor) {
    toast.textContent = message;
    toast.style.background = bgColor;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

function setLoading(btn, isLoading) {
    if (isLoading) {
        btn.classList.add('loading');
        btn.disabled = true;
    } else {
        btn.classList.remove('loading');
        btn.disabled = false;
    }
}

function escapeHTML(str) {
    const p = document.createElement('p');
    p.textContent = str;
    return p.innerHTML;
}
