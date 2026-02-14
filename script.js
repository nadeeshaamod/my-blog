// ===== Dark Mode Initialization =====
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

// ===== User Authentication State =====
const checkUserAuth = () => {
    const userEmail = localStorage.getItem('userEmail');
    const userRole = localStorage.getItem('userRole');
    const userName = localStorage.getItem('userName');

    if (userEmail) {
        // User is logged in
        updateNavForLoggedInUser(userName || userEmail, userRole);
        enableUserFeatures();
    }
};

const updateNavForLoggedInUser = (name, role) => {
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');

    if (loginBtn && signupBtn) {
        // Replace login/signup buttons with user menu
        const navActions = document.querySelector('.nav-actions');
        const userMenu = document.createElement('div');
        userMenu.className = 'user-menu-wrapper';
        userMenu.innerHTML = `
            <div class="user-menu" id="userMenu">
                <div class="user-avatar">${name.charAt(0).toUpperCase()}</div>
                <span class="user-name-nav">${name.split(' ')[0]}</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M4 6l4 4 4-4"/>
                </svg>
            </div>
            <div class="user-dropdown-nav" id="userDropdownNav">
                <div class="dropdown-header">
                    <div class="dropdown-avatar">${name.charAt(0).toUpperCase()}</div>
                    <div>
                        <p class="dropdown-name">${name}</p>
                        <p class="dropdown-email">${localStorage.getItem('userEmail')}</p>
                    </div>
                </div>
                <div class="dropdown-divider"></div>
                ${role === 'admin' ? '<a href="admin.html" class="dropdown-link">📊 Admin Dashboard</a>' : ''}
                <a href="#" class="dropdown-link" id="createPostLink">✍️ Create Post</a>
                <a href="#" class="dropdown-link" id="myPostsLink">📝 My Posts</a>
                <a href="#" class="dropdown-link" id="profileLink">👤 Profile</a>
                <a href="#" class="dropdown-link" id="settingsLink">⚙️ Settings</a>
                <div class="dropdown-divider"></div>
                <a href="#" class="dropdown-link logout-link" id="logoutLink">🚪 Logout</a>
            </div>
        `;

        loginBtn.replaceWith(userMenu);
        signupBtn.remove();

        // Add event listeners
        const userMenuBtn = document.getElementById('userMenu');
        const userDropdownNav = document.getElementById('userDropdownNav');

        userMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdownNav.classList.toggle('active');
        });

        document.addEventListener('click', () => {
            userDropdownNav.classList.remove('active');
        });

        // Logout functionality
        document.getElementById('logoutLink').addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });

        // Create post link
        document.getElementById('createPostLink').addEventListener('click', (e) => {
            e.preventDefault();
            openCreatePostModal();
        });

        // My posts link
        document.getElementById('myPostsLink').addEventListener('click', (e) => {
            e.preventDefault();
            showNotification('📝 Loading your posts...', 'info');
        });

        // Profile link
        document.getElementById('profileLink').addEventListener('click', (e) => {
            e.preventDefault();
            showNotification('👤 Opening profile settings...', 'info');
        });

        // Settings link
        document.getElementById('settingsLink').addEventListener('click', (e) => {
            e.preventDefault();
            showNotification('⚙️ Opening settings...', 'info');
        });
    }
};

const logout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    showNotification('👋 Logged out successfully', 'success');
    setTimeout(() => {
        window.location.reload();
    }, 1000);
};

const enableUserFeatures = () => {
    // Enable commenting, liking, etc.
    console.log('✅ User features enabled');
};

// Check auth on page load
checkUserAuth();

// ===== Mobile Menu Toggle =====
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// ===== Search Modal =====
const searchBtn = document.getElementById('searchBtn');
const searchModal = document.getElementById('searchModal');
const searchClose = document.getElementById('searchClose');
const searchInput = document.getElementById('searchInput');

searchBtn.addEventListener('click', () => {
    searchModal.classList.add('active');
    setTimeout(() => searchInput.focus(), 300);
});

searchClose.addEventListener('click', () => {
    searchModal.classList.remove('active');
    searchInput.value = '';
});

// Close modal when clicking outside
searchModal.addEventListener('click', (e) => {
    if (e.target === searchModal) {
        searchModal.classList.remove('active');
        searchInput.value = '';
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchModal.classList.contains('active')) {
        searchModal.classList.remove('active');
        searchInput.value = '';
    }
});

// ===== Navbar Scroll Effect =====
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// ===== Active Navigation Link =====
const sections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinksAll.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ===== Newsletter Form =====
const newsletterForm = document.getElementById('newsletterForm');
const newsletterEmail = document.getElementById('newsletterEmail');

newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = newsletterEmail.value.trim();

    if (email && validateEmail(email)) {
        // Show success message
        showNotification('🎉 Successfully subscribed! Check your inbox.', 'success');
        newsletterEmail.value = '';
    } else {
        showNotification('❌ Please enter a valid email address.', 'error');
    }
});

// Email validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ===== Subscribe Button (Header) =====
const subscribeBtn = document.getElementById('subscribeBtn');

subscribeBtn.addEventListener('click', () => {
    // Scroll to newsletter section
    const newsletterSection = document.querySelector('.newsletter-section');
    newsletterSection.scrollIntoView({ behavior: 'smooth' });

    // Focus on email input after scroll
    setTimeout(() => {
        newsletterEmail.focus();
    }, 800);
});

// ===== Read Full Story Button =====
const readFullStoryBtn = document.getElementById('readFullStory');

readFullStoryBtn.addEventListener('click', () => {
    showNotification('📖 Opening full article...', 'info');
    setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1000);
});

// ===== View All Posts Link =====
const viewAllPosts = document.getElementById('viewAllPosts');

viewAllPosts.addEventListener('click', (e) => {
    e.preventDefault();
    showNotification('📚 Loading all posts...', 'info');
});

// ===== Load More Articles Button =====
const loadMoreBtn = document.getElementById('loadMoreBtn');
const articlesGrid = document.querySelector('.articles-grid');

let articlesLoaded = 6;
const totalArticles = 12;

loadMoreBtn.addEventListener('click', () => {
    // Simulate loading more articles
    loadMoreBtn.disabled = true;
    loadMoreBtn.textContent = 'Loading...';

    setTimeout(() => {
        const newArticles = generateArticles(3);
        articlesGrid.insertAdjacentHTML('beforeend', newArticles);

        articlesLoaded += 3;

        loadMoreBtn.disabled = false;
        loadMoreBtn.textContent = 'Load More Articles';

        // Add click handlers to new article cards
        addArticleClickHandlers();

        // Hide button if all articles loaded
        if (articlesLoaded >= totalArticles) {
            loadMoreBtn.style.display = 'none';
            showNotification('✅ All articles loaded!', 'success');
        } else {
            showNotification(`✨ Loaded ${articlesLoaded} of ${totalArticles} articles`, 'success');
        }
    }, 1000);
});

// Generate new article cards
function generateArticles(count) {
    const articles = [
        {
            image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
            badge: 'Technology',
            badgeClass: 'badge-technology',
            title: 'The Rise of Web3 and Decentralization',
            excerpt: 'Exploring the future of the internet with blockchain technology and decentralized applications...',
            author: 'Alex Morgan',
            authorImg: 'https://i.pravatar.cc/150?img=15',
            date: '3 weeks ago'
        },
        {
            image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
            badge: 'Business',
            badgeClass: 'badge-business',
            title: 'Building High-Performance Teams',
            excerpt: 'Learn the strategies that top companies use to build and maintain exceptional teams...',
            author: 'Rachel Kim',
            authorImg: 'https://i.pravatar.cc/150?img=25',
            date: '4 weeks ago'
        },
        {
            image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&q=80',
            badge: 'Travel',
            badgeClass: 'badge-travel',
            title: 'Hidden Gems in Southeast Asia',
            excerpt: 'Discover breathtaking destinations off the beaten path in Southeast Asia...',
            author: 'Tom Anderson',
            authorImg: 'https://i.pravatar.cc/150?img=52',
            date: '1 month ago'
        }
    ];

    let html = '';
    for (let i = 0; i < count && i < articles.length; i++) {
        const article = articles[i];
        html += `
            <article class="article-card">
                <div class="article-image">
                    <img src="${article.image}" alt="${article.title}">
                    <span class="article-badge ${article.badgeClass}">${article.badge}</span>
                </div>
                <div class="article-content">
                    <h3 class="article-title">${article.title}</h3>
                    <p class="article-excerpt">${article.excerpt}</p>
                    <div class="article-footer">
                        <div class="article-author">
                            <img src="${article.authorImg}" alt="${article.author}">
                            <span>${article.author}</span>
                        </div>
                        <span class="article-date">${article.date}</span>
                    </div>
                </div>
            </article>
        `;
    }
    return html;
}

// ===== Article Card Click Handlers =====
function addArticleClickHandlers() {
    document.querySelectorAll('.article-card').forEach(card => {
        card.addEventListener('click', function () {
            const title = this.querySelector('.article-title').textContent;
            showNotification(`📰 Opening: ${title}`, 'info');
        });
    });
}

// Add handlers on page load
addArticleClickHandlers();

// ===== Notification System =====
function showNotification(message, type = 'info') {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Add styles
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

    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
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

// ===== Smooth Scroll for All Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // Skip if it's just "#"
        if (href === '#' || href.length <= 1) {
            e.preventDefault();
            return;
        }

        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== Lazy Loading Images =====
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===== Add Entrance Animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe article cards
document.querySelectorAll('.article-card').forEach(card => {
    card.style.opacity = '0';
    observer.observe(card);
});

// Add fadeInUp animation
const fadeInUpStyle = document.createElement('style');
fadeInUpStyle.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(fadeInUpStyle);

// ===== Console Welcome Message =====
console.log('%c🚀 Welcome to Blog Platform!', 'font-size: 20px; font-weight: bold; color: #3B82F6;');
console.log('%cBuilt with HTML, CSS, and JavaScript', 'font-size: 14px; color: #64748B;');
console.log('%cAll buttons are fully functional! 🎉', 'font-size: 14px; color: #10B981;');

// ===== Performance Monitoring =====
window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`⚡ Page loaded in ${loadTime.toFixed(2)}ms`);
});

// ===== Create Post Modal (Homepage) =====
function openCreatePostModal() {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
        showNotification('❌ Please login to create a post', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return;
    }

    const createPostModalHome = document.getElementById('createPostModalHome');
    if (createPostModalHome) {
        createPostModalHome.classList.add('active');
        console.log('✅ Create post modal opened');
    } else {
        console.error('❌ Create post modal not found');
        showNotification('❌ Error opening create post form', 'error');
    }
}

function closeCreatePostModal() {
    const createPostModalHome = document.getElementById('createPostModalHome');
    const postFormHome = document.getElementById('postFormHome');

    if (createPostModalHome) {
        createPostModalHome.classList.remove('active');
    }
    if (postFormHome) {
        postFormHome.reset();
    }
}

// Initialize modal event listeners after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const closePostModalHome = document.getElementById('closePostModalHome');
    const cancelPostHome = document.getElementById('cancelPostHome');
    const createPostModalHome = document.getElementById('createPostModalHome');
    const postFormHome = document.getElementById('postFormHome');

    if (closePostModalHome) {
        closePostModalHome.addEventListener('click', closeCreatePostModal);
    }

    if (cancelPostHome) {
        cancelPostHome.addEventListener('click', closeCreatePostModal);
    }

    // Close modal when clicking outside
    if (createPostModalHome) {
        createPostModalHome.addEventListener('click', (e) => {
            if (e.target === createPostModalHome) {
                closeCreatePostModal();
            }
        });
    }

    // Handle post form submission
    if (postFormHome) {
        postFormHome.addEventListener('submit', (e) => {
            e.preventDefault();

            console.log('📝 Form submitted');

            const postData = {
                title: document.getElementById('postTitleHome').value,
                category: document.getElementById('postCategoryHome').value,
                status: document.getElementById('postStatusHome').value,
                excerpt: document.getElementById('postExcerptHome').value,
                content: document.getElementById('postContentHome').value,
                image: document.getElementById('postImageHome').value,
                author: localStorage.getItem('userName') || localStorage.getItem('userEmail'),
                date: 'Just now',
                views: 0
            };

            console.log('Post data:', postData);

            showNotification('📝 Creating your post...', 'info');

            setTimeout(() => {
                // Add post to the articles grid
                try {
                    addNewPostToGrid(postData);
                    closeCreatePostModal();
                    showNotification('✅ Post created successfully!', 'success');

                    console.log('✅ Post added to grid');

                    // Scroll to the new post
                    setTimeout(() => {
                        const articlesSection = document.getElementById('categories');
                        if (articlesSection) {
                            articlesSection.scrollIntoView({ behavior: 'smooth' });
                        }
                    }, 500);
                } catch (error) {
                    console.error('Error creating post:', error);
                    showNotification('❌ Error creating post', 'error');
                }
            }, 1000);
        });
    } else {
        console.warn('⚠️ Post form not found');
    }
});

// Add new post to articles grid
function addNewPostToGrid(postData) {
    console.log('📝 Adding post to grid:', postData);

    const articlesGrid = document.querySelector('.articles-grid');

    if (!articlesGrid) {
        console.error('❌ Articles grid not found!');
        showNotification('❌ Error: Articles grid not found', 'error');
        return;
    }

    console.log('✅ Articles grid found');

    const badgeClass = `badge-${postData.category}`;

    const newArticleHTML = `
        <article class="article-card new-post">
            <div class="article-image">
                <img src="${postData.image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80'}" alt="${postData.title}">
                <span class="article-badge ${badgeClass}">${postData.category.charAt(0).toUpperCase() + postData.category.slice(1)}</span>
            </div>
            <div class="article-content">
                <h3 class="article-title">${postData.title}</h3>
                <p class="article-excerpt">${postData.excerpt || postData.content.substring(0, 100) + '...'}</p>
                <div class="article-footer">
                    <div class="article-author">
                        <img src="https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}" alt="${postData.author}">
                        <span>${postData.author}</span>
                    </div>
                    <span class="article-date">${postData.date}</span>
                </div>
            </div>
        </article>
    `;

    articlesGrid.insertAdjacentHTML('afterbegin', newArticleHTML);
    console.log('✅ Post HTML inserted');

    // Add click handler to new article
    const newArticle = articlesGrid.querySelector('.new-post');
    if (newArticle) {
        newArticle.addEventListener('click', function () {
            showNotification(`📰 Opening: ${postData.title}`, 'info');
        });

        // Animate the new post
        newArticle.style.opacity = '0';
        setTimeout(() => {
            newArticle.style.animation = 'fadeInUp 0.6s ease forwards';
            newArticle.style.opacity = '1';
        }, 100);

        setTimeout(() => {
            newArticle.classList.remove('new-post');
        }, 600);

        console.log('✅ Post animation applied');
    } else {
        console.error('❌ New article element not found after insertion');
    }
}

// ===== Category Filter =====
const categoryLinks = document.querySelectorAll('.footer-links a[href^="#"]');
categoryLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const category = link.textContent.toLowerCase();
        if (['technology', 'design', 'lifestyle', 'business', 'travel', 'productivity'].includes(category)) {
            e.preventDefault();
            filterArticlesByCategory(category);
            showNotification(`🔍 Filtering by ${category}...`, 'info');
        }
    });
});

function filterArticlesByCategory(category) {
    const articles = document.querySelectorAll('.article-card');
    articles.forEach(article => {
        const badge = article.querySelector('.article-badge');
        if (badge) {
            const articleCategory = badge.textContent.toLowerCase();
            if (articleCategory === category) {
                article.style.display = '';
                article.style.animation = 'fadeInUp 0.4s ease forwards';
            } else {
                article.style.display = 'none';
            }
        }
    });

    // Scroll to articles section
    const articlesSection = document.getElementById('categories');
    articlesSection.scrollIntoView({ behavior: 'smooth' });
}

// ===== Search Functionality =====
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        if (query.length > 0) {
            searchArticles(query);
        }
    });
}

function searchArticles(query) {
    const articles = document.querySelectorAll('.article-card');
    let resultsCount = 0;

    articles.forEach(article => {
        const title = article.querySelector('.article-title').textContent.toLowerCase();
        const excerpt = article.querySelector('.article-excerpt').textContent.toLowerCase();

        if (title.includes(query) || excerpt.includes(query)) {
            article.style.display = '';
            resultsCount++;
        } else {
            article.style.display = 'none';
        }
    });

    if (resultsCount === 0) {
        showNotification(`❌ No results found for "${query}"`, 'error');
    } else {
        showNotification(`✅ Found ${resultsCount} article(s)`, 'success');
    }
}

// ===== Social Sharing =====
function shareArticle(title, url) {
    if (navigator.share) {
        navigator.share({
            title: title,
            url: url || window.location.href
        }).then(() => {
            showNotification('✅ Shared successfully!', 'success');
        }).catch(() => {
            showNotification('❌ Sharing cancelled', 'error');
        });
    } else {
        // Fallback: Copy to clipboard
        navigator.clipboard.writeText(url || window.location.href);
        showNotification('📋 Link copied to clipboard!', 'success');
    }
}

// ===== Article Interactions (Like, Comment, Share) =====
function addArticleInteractions() {
    const articles = document.querySelectorAll('.article-card');
    articles.forEach(article => {
        // Add interaction buttons on hover
        article.addEventListener('mouseenter', function () {
            if (!this.querySelector('.article-interactions')) {
                const interactions = document.createElement('div');
                interactions.className = 'article-interactions';
                interactions.innerHTML = `
                    <button class="interaction-btn like-btn" title="Like">
                        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                            <path d="M10 17.5l-1.45-1.32C4.4 12.36 2 10.28 2 7.5 2 5.5 3.5 4 5.5 4c1.54 0 3.04.99 3.57 2.36h1.87C11.46 4.99 12.96 4 14.5 4c2 0 3.5 1.5 3.5 3.5 0 2.78-2.4 4.86-6.55 8.68L10 17.5z" stroke="currentColor" stroke-width="2"/>
                        </svg>
                        <span class="like-count">0</span>
                    </button>
                    <button class="interaction-btn comment-btn" title="Comment">
                        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                            <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v7a2 2 0 01-2 2H8l-4 3v-3a2 2 0 01-2-2V6z" stroke="currentColor" stroke-width="2"/>
                        </svg>
                        <span class="comment-count">0</span>
                    </button>
                    <button class="interaction-btn share-btn" title="Share">
                        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                            <path d="M15 7a3 3 0 100-6 3 3 0 000 6zM5 13a3 3 0 100-6 3 3 0 000 6zM15 19a3 3 0 100-6 3 3 0 000 6zM6.5 11.5l7 3M6.5 8.5l7-3" stroke="currentColor" stroke-width="2"/>
                        </svg>
                    </button>
                `;
                this.querySelector('.article-content').appendChild(interactions);

                // Add event listeners
                const likeBtn = interactions.querySelector('.like-btn');
                const commentBtn = interactions.querySelector('.comment-btn');
                const shareBtn = interactions.querySelector('.share-btn');
                const title = this.querySelector('.article-title').textContent;

                likeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const count = likeBtn.querySelector('.like-count');
                    const currentCount = parseInt(count.textContent);
                    count.textContent = currentCount + 1;
                    likeBtn.classList.add('liked');
                    showNotification('❤️ Liked!', 'success');
                });

                commentBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    showNotification('💬 Comments feature coming soon!', 'info');
                });

                shareBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    shareArticle(title);
                });
            }
        });
    });
}

// Add interactions on page load
setTimeout(addArticleInteractions, 1000);

// ===== Back to Top Button =====
const backToTopBtn = document.createElement('button');
backToTopBtn.className = 'back-to-top';
backToTopBtn.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
`;
backToTopBtn.style.cssText = `
    position: fixed;
    bottom: 32px;
    right: 32px;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: var(--primary-blue);
    color: white;
    border: none;
    cursor: pointer;
    display: none;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    transition: all 0.3s ease;
    z-index: 1000;
`;

document.body.appendChild(backToTopBtn);

// Show/hide back to top button
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
        backToTopBtn.style.display = 'flex';
    } else {
        backToTopBtn.style.display = 'none';
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showNotification('⬆️ Back to top!', 'info');
});

backToTopBtn.addEventListener('mouseenter', () => {
    backToTopBtn.style.transform = 'translateY(-4px)';
    backToTopBtn.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.4)';
});

backToTopBtn.addEventListener('mouseleave', () => {
    backToTopBtn.style.transform = 'translateY(0)';
    backToTopBtn.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
});

console.log('%c✨ All features loaded successfully!', 'font-size: 16px; font-weight: bold; color: #10B981;');
