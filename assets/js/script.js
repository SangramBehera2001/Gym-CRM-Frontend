document.addEventListener('DOMContentLoaded', function() {
    // Navigation
    const menuItems = document.querySelectorAll('.menu-item');
    
    // File upload
    const fileUploadArea = document.getElementById('file-upload-area');
    const fileInput = document.getElementById('featured-image');
    
    // Page titles for welcome message
    const pageTitles = {
        'dashboard': 'Welcome to Yara Admin Dashboard',
        'add-blog': 'Add New Blog',
        'all-blogs': 'Blog Posts'
    };
    
    // Navigation click event
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetPage = this.getAttribute('data-page');
            
            if (targetPage) {
                // Update active menu item
                menuItems.forEach(i => i.classList.remove('active'));
                this.classList.add('active');
                
                // Navigate to the page
                window.location.href = targetPage + '.html';
            }
        });
    });
    
    // File upload click event
    if (fileUploadArea) {
        fileUploadArea.addEventListener('click', function() {
            fileInput.click();
        });
    }
    
    // Form submission
    const blogForm = document.getElementById('blog-form');
    if (blogForm) {
        blogForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Blog saved successfully!');
            blogForm.reset();
        });
    }
    
    // File input change event
    if (fileInput) {
        fileInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const fileName = this.files[0].name;
                fileUploadArea.innerHTML = `
                    <i class="fas fa-file-image"></i>
                    <p>${fileName}</p>
                    <p>Click to change</p>
                `;
                
                // Re-add the event listener after changing innerHTML
                fileUploadArea.addEventListener('click', function() {
                    fileInput.click();
                });
            }
        });
    }
    
    // Set active page based on current URL
    function setActivePage() {
        const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
        const menuItems = document.querySelectorAll('.menu-item');
        
        menuItems.forEach(item => {
            const itemPage = item.getAttribute('data-page');
            if (itemPage === currentPage) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
    
    setActivePage();
});