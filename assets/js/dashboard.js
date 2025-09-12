document.addEventListener('DOMContentLoaded', function() {
    const menuItems = document.querySelectorAll('.menu-item');
    const submenuItems = document.querySelectorAll('.submenu-item');
    const sections = document.querySelectorAll('.section');
    const sectionTitle = document.getElementById('section-title');
    const dashboardMenu = document.getElementById('dashboard-menu');
    const submenu = document.getElementById('dashboard-submenu');
    
    const modalOverlay = document.getElementById('modal-overlay');
    const confirmLogoutBtn = document.getElementById('confirm-logout');
    const cancelLogoutBtn = document.getElementById('cancel-logout');
    const logoutBtn = document.getElementById('logout-btn');

    // Titles for header
    const titles = {
        'dashboard-main': 'Dashboard Overview',
        'members': 'Members',
        'payments': 'Payments',
        'trainers': 'Trainers',
        'reports': 'Reports',
        'add-blog': 'Add New Blog',
        'all-blogs': 'Blog Posts'
    };

    // Function to show section
    function showSection(id) {
        sections.forEach(s => s.classList.remove('active'));
        const target = document.getElementById(id);
        if (target) {
            target.classList.add('active');
        }
        sectionTitle.textContent = titles[id] || 'Dashboard';
        
        // Update URL without reloading page
        window.history.pushState({}, '', `#${id}`);
    }

    // Function to reset to dashboard overview
    function resetToDashboardOverview() {
        // Show dashboard overview section
        showSection('dashboard-main');
        
        // Update menu active states
        menuItems.forEach(item => item.classList.remove('active'));
        dashboardMenu.classList.add('active');
        
        // Update submenu active states
        submenuItems.forEach(item => item.classList.remove('active'));
        document.querySelector('.submenu-item[data-page="dashboard-main"]').classList.add('active');
        
        // Ensure submenu is open when dashboard is active
        submenu.classList.add('open');
        const chevron = dashboardMenu.querySelector('.fa-chevron-down');
        if (chevron) {
            chevron.classList.remove('fa-chevron-down');
            chevron.classList.add('fa-chevron-up');
        }
    }

    // On page load, reset to dashboard overview
    resetToDashboardOverview();

    // Dashboard dropdown handling
    dashboardMenu.addEventListener('click', function() {
        const isOpening = !submenu.classList.contains('open');
        submenu.classList.toggle('open');
        const chevron = this.querySelector('.fa-chevron-down, .fa-chevron-up');
        
        if (chevron) {
            chevron.classList.toggle('fa-chevron-down');
            chevron.classList.toggle('fa-chevron-up');
        }
        
        // If opening the dropdown, also show the overview
        if (isOpening) {
            resetToDashboardOverview();
        }
    });

    // Submenu clicks
    submenuItems.forEach(sub => {
        sub.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            
            submenuItems.forEach(s => s.classList.remove('active'));
            this.classList.add('active');
            
            menuItems.forEach(i => i.classList.remove('active'));
            dashboardMenu.classList.add('active');
            
            showSection(page);
        });
    });

    // Top-level menu clicks
    menuItems.forEach(item => {
        if (!item.classList.contains('has-dropdown')) {
            item.addEventListener('click', function() {
                const targetPage = this.getAttribute('data-page');
                
                if (targetPage === 'logout-top') {
                    openLogoutModal();
                    return;
                }
                
                menuItems.forEach(i => i.classList.remove('active'));
                this.classList.add('active');
                submenuItems.forEach(si => si.classList.remove('active'));
                
                // Close dashboard submenu when other menu items are clicked
                submenu.classList.remove('open');
                const chevron = dashboardMenu.querySelector('.fa-chevron-up');
                if (chevron) {
                    chevron.classList.remove('fa-chevron-up');
                    chevron.classList.add('fa-chevron-down');
                }
                
                showSection(targetPage);
            });
        }
    });

    // Logout button
    logoutBtn.addEventListener('click', openLogoutModal);

    // Logout modal handling
    function openLogoutModal() {
        modalOverlay.style.display = 'flex';
    }
    
    function closeLogoutModal() {
        modalOverlay.style.display = 'none';
    }
    
    confirmLogoutBtn.addEventListener('click', function() {
        closeLogoutModal();
        alert('Logged out successfully!');
    });
    
    cancelLogoutBtn.addEventListener('click', closeLogoutModal);
    
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) closeLogoutModal();
    });

    // Form submissions
    const blogForm = document.getElementById('blog-form');
    if (blogForm) {
        blogForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Blog saved successfully!');
            blogForm.reset();
        });
    }

    const memberForm = document.getElementById('member-form');
    if (memberForm) {
        memberForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Member added successfully!');
            memberForm.reset();
        });
    }

    const trainerForm = document.getElementById('trainer-form');
    if (trainerForm) {
        trainerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Trainer added successfully!');
            trainerForm.reset();
        });
    }

    // File upload functionality
    const fileUploadArea = document.getElementById('file-upload-area');
    const fileInput = document.getElementById('featured-image');
    if (fileUploadArea && fileInput) {
        fileUploadArea.addEventListener('click', function() {
            fileInput.click();
        });
        
        fileInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const fileName = this.files[0].name;
                fileUploadArea.innerHTML = `
                    <i class="fas fa-file-image"></i>
                    <p>${fileName}</p>
                    <p>Click to change</p>
                `;
            }
        });
    }

    // Tab functionality
    document.addEventListener('click', function(e) {
        const tab = e.target.closest('.tab');
        if (tab) {
            const tabName = tab.getAttribute('data-tab');
            const parentSection = tab.closest('.section');
            
            // Update active tab
            const allTabs = tab.parentElement.querySelectorAll('.tab');
            allTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Show corresponding content
            const tabContents = parentSection.querySelectorAll('.tab-content');
            tabContents.forEach(content => {
                content.style.display = 'none';
            });
            
            const activeContent = parentSection.querySelector(`#${tabName}`);
            if (activeContent) {
                activeContent.style.display = 'block';
            }
        }
    });

    // Check URL hash on load but prioritize dashboard overview
    // We'll ignore the hash and always show dashboard overview on page load
    // as per requirements
});