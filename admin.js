// ===== Admin Dashboard JavaScript =====

// Check if user is admin
const checkAdminAccess = () => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'admin') {
        showNotification('❌ Access denied. Admin only.', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return false;
    }
    return true;
};

// Initialize admin dashboard
if (window.location.pathname.includes('admin.html')) {
    checkAdminAccess();
}

// Initialize theme from localStorage
const initTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
};

initTheme();

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        showNotification(isDark ? '🌙 Dark mode enabled' : '☀️ Light mode enabled', 'success');
    });
}

// ===== User Profile Dropdown =====
const userProfile = document.getElementById('userProfile');
const userDropdown = document.getElementById('userDropdown');

if (userProfile && userDropdown) {
    userProfile.addEventListener('click', (e) => {
        e.stopPropagation();
        userDropdown.classList.toggle('active');
    });

    document.addEventListener('click', () => {
        userDropdown.classList.remove('active');
    });
}

// ===== Sidebar Navigation =====
const sidebarLinks = document.querySelectorAll('.sidebar-link');
sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        sidebarLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        const section = link.getAttribute('href').substring(1);
        showNotification(`📂 Loading ${section}...`, 'info');
    });
});

// ===== Quick Action Buttons =====
const createPostBtn = document.getElementById('createPostBtn');
const manageUsersBtn = document.getElementById('manageUsersBtn');
const viewAnalyticsBtn = document.getElementById('viewAnalyticsBtn');
const newPostBtn = document.getElementById('newPostBtn');

if (createPostBtn) {
    createPostBtn.addEventListener('click', () => {
        openCreatePostModal();
    });
}

if (newPostBtn) {
    newPostBtn.addEventListener('click', () => {
        openCreatePostModal();
    });
}

if (manageUsersBtn) {
    manageUsersBtn.addEventListener('click', () => {
        showNotification('👥 Opening user management...', 'info');
    });
}

if (viewAnalyticsBtn) {
    viewAnalyticsBtn.addEventListener('click', () => {
        showNotification('📊 Loading analytics dashboard...', 'info');
    });
}

// ===== Create Post Modal =====
const createPostModal = document.getElementById('createPostModal');
const closePostModal = document.getElementById('closePostModal');
const cancelPost = document.getElementById('cancelPost');
const postForm = document.getElementById('postForm');

function openCreatePostModal() {
    createPostModal.classList.add('active');
}

function closeModal() {
    createPostModal.classList.remove('active');
    postForm.reset();
}

if (closePostModal) {
    closePostModal.addEventListener('click', closeModal);
}

if (cancelPost) {
    cancelPost.addEventListener('click', closeModal);
}

// Close modal when clicking outside
if (createPostModal) {
    createPostModal.addEventListener('click', (e) => {
        if (e.target === createPostModal) {
            closeModal();
        }
    });
}

// ===== Post Form Submission =====
if (postForm) {
    postForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const postData = {
            title: document.getElementById('postTitle').value,
            category: document.getElementById('postCategory').value,
            status: document.getElementById('postStatus').value,
            excerpt: document.getElementById('postExcerpt').value,
            content: document.getElementById('postContent').value,
            image: document.getElementById('postImage').value,
            author: localStorage.getItem('userName') || 'Admin User',
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            views: 0
        };

        showNotification('📝 Creating post...', 'info');

        setTimeout(() => {
            // Add post to table
            addPostToTable(postData);
            closeModal();
            showNotification('✅ Post created successfully!', 'success');

            // Update stats
            updateStats();
        }, 1000);
    });
}

// ===== Add Post to Table =====
function addPostToTable(postData) {
    const tbody = document.getElementById('postsTableBody');
    if (!tbody) return;

    const row = document.createElement('tr');
    row.innerHTML = `
        <td>
            <div class="post-title-cell">
                <img src="${postData.image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=100&q=80'}" alt="Post">
                <span>${postData.title}</span>
            </div>
        </td>
        <td>${postData.author}</td>
        <td><span class="category-badge badge-${postData.category}">${postData.category.charAt(0).toUpperCase() + postData.category.slice(1)}</span></td>
        <td>${postData.views}</td>
        <td><span class="status-badge status-${postData.status}">${postData.status.charAt(0).toUpperCase() + postData.status.slice(1)}</span></td>
        <td>${postData.date}</td>
        <td>
            <div class="action-buttons">
                <button class="btn-icon edit-btn" title="Edit" onclick="editPost(this)">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M11.333 2A1.886 1.886 0 0114 4.667l-9 9-3.667.666.667-3.666 9-9z" stroke="currentColor" stroke-width="1.5"/>
                    </svg>
                </button>
                <button class="btn-icon delete-btn" title="Delete" onclick="deletePost(this)">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M2 4h12M5.333 4V2.667a1.333 1.333 0 011.334-1.334h2.666a1.333 1.333 0 011.334 1.334V4m2 0v9.333a1.333 1.333 0 01-1.334 1.334H4.667a1.333 1.333 0 01-1.334-1.334V4h9.334z" stroke="currentColor" stroke-width="1.5"/>
                    </svg>
                </button>
            </div>
        </td>
    `;

    tbody.insertBefore(row, tbody.firstChild);
}

// ===== Edit Post =====
window.editPost = function (button) {
    const row = button.closest('tr');
    const title = row.querySelector('.post-title-cell span').textContent;
    showNotification(`✏️ Editing: ${title}`, 'info');

    // In a real app, you would populate the form with post data
    openCreatePostModal();
};

// ===== Delete Post =====
window.deletePost = function (button) {
    const row = button.closest('tr');
    const title = row.querySelector('.post-title-cell span').textContent;

    if (confirm(`Are you sure you want to delete "${title}"?`)) {
        row.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            row.remove();
            showNotification('🗑️ Post deleted successfully', 'success');
            updateStats();
        }, 300);
    }
};

// ===== Update Stats =====
function updateStats() {
    const tbody = document.getElementById('postsTableBody');
    if (!tbody) return;

    const totalPosts = tbody.querySelectorAll('tr').length;
    const statValue = document.querySelector('.stat-value');
    if (statValue) {
        statValue.textContent = totalPosts;
    }
}

// ===== Animate Stats on Load =====
window.addEventListener('load', () => {
    const statValues = document.querySelectorAll('.stat-value');
    statValues.forEach(stat => {
        const finalValue = stat.textContent;
        const isNumber = !isNaN(parseFloat(finalValue.replace(/[^0-9.]/g, '')));

        if (isNumber) {
            const numericValue = parseFloat(finalValue.replace(/[^0-9.]/g, ''));
            const suffix = finalValue.replace(/[0-9.,]/g, '');
            let current = 0;
            const increment = numericValue / 50;

            const timer = setInterval(() => {
                current += increment;
                if (current >= numericValue) {
                    stat.textContent = finalValue;
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(current) + suffix;
                }
            }, 20);
        }
    });
});

// ===== Table Row Hover Effect =====
const tableRows = document.querySelectorAll('.admin-table tbody tr');
tableRows.forEach(row => {
    row.addEventListener('mouseenter', () => {
        row.style.background = 'var(--bg-secondary)';
    });

    row.addEventListener('mouseleave', () => {
        row.style.background = 'transparent';
    });
});

// ===== Search Functionality =====
function searchPosts(query) {
    const rows = document.querySelectorAll('.admin-table tbody tr');
    rows.forEach(row => {
        const title = row.querySelector('.post-title-cell span').textContent.toLowerCase();
        const author = row.cells[1].textContent.toLowerCase();

        if (title.includes(query.toLowerCase()) || author.includes(query.toLowerCase())) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// ===== Export Data =====
function exportPosts() {
    const rows = document.querySelectorAll('.admin-table tbody tr');
    let csvContent = 'Title,Author,Category,Views,Status,Date\n';

    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const title = row.querySelector('.post-title-cell span').textContent;
        const author = cells[1].textContent;
        const category = cells[2].textContent;
        const views = cells[3].textContent;
        const status = cells[4].textContent;
        const date = cells[5].textContent;

        csvContent += `"${title}","${author}","${category}","${views}","${status}","${date}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'posts_export.csv';
    a.click();

    showNotification('📥 Posts exported successfully!', 'success');
}

// ===== Notification System =====
function showNotification(message, type = 'info') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '24px',
        background: type === 'success' ? '#10B981' :
            type === 'error' ? '#EF4444' : '#3B82F6',
        color: 'white',
        padding: '16px 24px',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
        zIndex: '9999',
        fontWeight: '600',
        fontSize: '14px',
        animation: 'slideInRight 0.3s ease',
        maxWidth: '320px'
    });

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add fadeOut animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(-20px);
        }
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

console.log('%c🎛️ Admin Dashboard Loaded', 'font-size: 16px; font-weight: bold; color: #3B82F6;');
console.log('%cAll admin functions are ready!', 'font-size: 14px; color: #10B981;');
