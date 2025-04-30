// Admin Dashboard JavaScript

// News storage functions
function getStoredNews() {
    const news = localStorage.getItem('news');
    return news ? JSON.parse(news) : [];
}

function saveNews(news) {
    localStorage.setItem('news', JSON.stringify(news));
}

// Login functionality
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Verify credentials
    if (username === 'oumkelthoume' && password === 'VALL36271730') {
        // Store login status in sessionStorage
        sessionStorage.setItem('isLoggedIn', 'true');
        window.location.href = 'dashboard.html';
    } else {
        alert('اسم المستخدم أو كلمة المرور غير صحيحة');
    }
});

// Check if user is logged in when accessing dashboard
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded');
    
    // If we're on the dashboard page, check login status
    if (window.location.pathname.includes('dashboard.html')) {
        const isLoggedIn = sessionStorage.getItem('isLoggedIn');
        if (!isLoggedIn) {
            window.location.href = 'login.html';
            return;
        }
    }

    // Modal functionality
    const modal = document.getElementById('addNewsModal');
    const closeBtn = document.querySelector('.close');
    const addBtn = document.querySelector('.add-btn');
    
    console.log('Modal element:', modal);
    console.log('Add button:', addBtn);
    
    if (addBtn) {
        addBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Add button clicked');
            if (modal) {
                modal.style.display = 'block';
                console.log('Modal shown');
            } else {
                console.error('Modal not found');
            }
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            console.log('Close button clicked');
            if (modal) {
                modal.style.display = 'none';
                console.log('Modal hidden');
            }
        });
    }
    
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
    
    // News form submission
    const newsForm = document.getElementById('addNewsForm');
    if (newsForm) {
        newsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Form submitted');
            
            const newsData = {
                id: Date.now(), // Unique ID
                title: document.getElementById('newsTitle').value,
                content: document.getElementById('newsContent').value,
                date: new Date().toISOString().split('T')[0],
                image: document.getElementById('newsImage').files[0] ? 
                       URL.createObjectURL(document.getElementById('newsImage').files[0]) : null
            };
            
            console.log('News data:', newsData);
            
            // Save the news
            const news = getStoredNews();
            news.unshift(newsData); // Add to beginning of array
            saveNews(news);
            
            // Refresh the news list
            loadNews();
            
            // Close modal and reset form
            if (modal) {
                modal.style.display = 'none';
            }
            newsForm.reset();
            
            // Show success message
            alert('تم إضافة الخبر بنجاح');
        });
    }
    
    // Load existing news
    loadNews();
});

// Logout functionality
document.querySelector('.logout-btn')?.addEventListener('click', function(e) {
    e.preventDefault();
    sessionStorage.removeItem('isLoggedIn');
    window.location.href = 'login.html';
});

function loadNews() {
    console.log('Loading news');
    const newsList = document.querySelector('.news-list');
    if (!newsList) {
        console.error('News list element not found');
        return;
    }
    
    const news = getStoredNews();
    console.log('Loaded news:', news);
    
    newsList.innerHTML = news.map(item => `
        <div class="news-item">
            ${item.image ? `<img src="${item.image}" alt="${item.title}" class="news-image">` : ''}
            <h3>${item.title}</h3>
            <p>${item.content}</p>
            <p class="news-date">${item.date}</p>
            <div class="news-item-actions">
                <button class="edit-btn" onclick="editNews(${item.id})">تعديل</button>
                <button class="delete-btn" onclick="deleteNews(${item.id})">حذف</button>
            </div>
        </div>
    `).join('');
}

function editNews(id) {
    console.log('Editing news:', id);
    const news = getStoredNews();
    const newsItem = news.find(item => item.id === id);
    if (!newsItem) return;
    
    // Populate form with news item data
    document.getElementById('newsTitle').value = newsItem.title;
    document.getElementById('newsContent').value = newsItem.content;
    
    // Show modal
    const modal = document.getElementById('addNewsModal');
    if (modal) {
        modal.style.display = 'block';
    }
    
    // Update form submission to handle edit
    const form = document.getElementById('addNewsForm');
    if (form) {
        form.onsubmit = function(e) {
            e.preventDefault();
            
            const updatedNews = {
                ...newsItem,
                title: document.getElementById('newsTitle').value,
                content: document.getElementById('newsContent').value,
                image: document.getElementById('newsImage').files[0] ? 
                       URL.createObjectURL(document.getElementById('newsImage').files[0]) : newsItem.image
            };
            
            // Update news in storage
            const newsIndex = news.findIndex(item => item.id === id);
            news[newsIndex] = updatedNews;
            saveNews(news);
            
            // Refresh news list
            loadNews();
            
            // Close modal and reset form
            if (modal) {
                modal.style.display = 'none';
            }
            form.reset();
            
            // Show success message
            alert('تم تحديث الخبر بنجاح');
        };
    }
}

function deleteNews(id) {
    if (confirm('هل أنت متأكد من حذف هذا الخبر؟')) {
        const news = getStoredNews();
        const updatedNews = news.filter(item => item.id !== id);
        saveNews(updatedNews);
        loadNews();
        alert('تم حذف الخبر بنجاح');
    }
}

// Make showAddNewsModal available globally
window.showAddNewsModal = function() {
    console.log('showAddNewsModal called');
    const modal = document.getElementById('addNewsModal');
    if (modal) {
        modal.style.display = 'block';
    }
}; 