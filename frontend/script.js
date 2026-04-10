const API_URL = 'http://localhost:3000';

const messageInput = document.getElementById('messageInput');
const submitBtn = document.getElementById('submitBtn');
const fetchBtn = document.getElementById('fetchBtn');
const resultsContainer = document.getElementById('resultsContainer');
const toast = document.getElementById('toast');

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

async function fetchData() {
    resultsContainer.innerHTML = '<div class="empty-state">Connecting to bridge...</div>';
    
    try {
        const response = await fetch(`${API_URL}/data`);
        const data = await response.json();

        if (data.length === 0) {
            resultsContainer.innerHTML = '<div class="empty-state">Bridge is empty. Start by pushing some data.</div>';
            return;
        }

        resultsContainer.innerHTML = data.map((item, index) => `
            <div class="data-item" style="animation-delay: ${index * 0.1}s">
                <div class="data-id">ENTRY #${item.id}</div>
                <div class="data-content">${escapeHTML(item.content)}</div>
            </div>
        `).join('');

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
