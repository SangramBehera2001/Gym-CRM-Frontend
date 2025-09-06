        // Initialize charts
        document.addEventListener('DOMContentLoaded', function() {
            // Members Chart
            const membersCtx = document.getElementById('membersChart').getContext('2d');
            const membersChart = new Chart(membersCtx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
                    datasets: [{
                        label: 'New Members',
                        data: [15, 22, 18, 25, 30, 28, 35, 42, 36, 45],
                        borderColor: '#3498db',
                        backgroundColor: 'rgba(52, 152, 219, 0.1)',
                        fill: true,
                        tension: 0.4
                    }, {
                        label: 'Renewed Members',
                        data: [10, 15, 20, 18, 22, 25, 30, 28, 32, 35],
                        borderColor: '#2ecc71',
                        backgroundColor: 'rgba(46, 204, 113, 0.1)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        }
                    }
                }
            });
            
            // Revenue Chart
            const revenueCtx = document.getElementById('revenueChart').getContext('2d');
            const revenueChart = new Chart(revenueCtx, {
                type: 'bar',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
                    datasets: [{
                        label: 'Revenue ($)',
                        data: [5200, 5800, 6100, 6500, 7200, 7800, 8100, 8500, 8900, 9250],
                        backgroundColor: 'rgba(155, 89, 182, 0.7)',
                        borderColor: 'rgba(155, 89, 182, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        }
                    }
                }
            });
            
            // Membership Report Chart
            const membershipReportCtx = document.getElementById('membershipReportChart').getContext('2d');
            const membershipReportChart = new Chart(membershipReportCtx, {
                type: 'bar',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
                    datasets: [{
                        label: 'New Members',
                        data: [15, 22, 18, 25, 30, 28, 35, 42, 36, 45],
                        backgroundColor: 'rgba(52, 152, 219, 0.7)',
                    }, {
                        label: 'Renewed Members',
                        data: [10, 15, 20, 18, 22, 25, 30, 28, 32, 35],
                        backgroundColor: 'rgba(46, 204, 113, 0.7)',
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        }
                    }
                }
            });
            
            // Revenue Report Chart
            const revenueReportCtx = document.getElementById('revenueReportChart').getContext('2d');
            const revenueReportChart = new Chart(revenueReportCtx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
                    datasets: [{
                        label: 'Revenue ($)',
                        data: [5200, 5800, 6100, 6500, 7200, 7800, 8100, 8500, 8900, 9250],
                        borderColor: '#9b59b6',
                        backgroundColor: 'rgba(155, 89, 182, 0.1)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        }
                    }
                }
            });
            
            // Trainer Report Chart
            const trainerReportCtx = document.getElementById('trainerReportChart').getContext('2d');
            const trainerReportChart = new Chart(trainerReportCtx, {
                type: 'radar',
                data: {
                    labels: ['Member Retention', 'Session Attendance', 'Client Satisfaction', 'Goal Achievement', 'Revenue Generated'],
                    datasets: [
                        {
                            label: 'Michael Roberts',
                            data: [88, 92, 90, 85, 95],
                            backgroundColor: 'rgba(52, 152, 219, 0.2)',
                            borderColor: 'rgba(52, 152, 219, 1)',
                            pointBackgroundColor: 'rgba(52, 152, 219, 1)'
                        },
                        {
                            label: 'Sarah Johnson',
                            data: [82, 85, 80, 78, 88],
                            backgroundColor: 'rgba(46, 204, 113, 0.2)',
                            borderColor: 'rgba(46, 204, 113, 1)',
                            pointBackgroundColor: 'rgba(46, 204, 113, 1)'
                        },
                        {
                            label: 'David Wilson',
                            data: [91, 95, 93, 90, 96],
                            backgroundColor: 'rgba(155, 89, 182, 0.2)',
                            borderColor: 'rgba(155, 89, 182, 1)',
                            pointBackgroundColor: 'rgba(155, 89, 182, 1)'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        }
                    }
                }
            });
            
            // Menu item click event
            const menuItems = document.querySelectorAll('.menu-item');
            menuItems.forEach(item => {
                item.addEventListener('click', function() {
                    if (this.dataset.section) {
                        // Update active menu item
                        menuItems.forEach(i => i.classList.remove('active'));
                        this.classList.add('active');
                        
                        // Show corresponding section
                        document.querySelectorAll('.section').forEach(section => {
                            section.classList.remove('active');
                        });
                        document.getElementById(this.dataset.section).classList.add('active');
                        
                        // Update section title
                        document.getElementById('section-title').textContent = this.querySelector('span').textContent;
                    }
                });
            });
            
            // Tab click event
            const tabs = document.querySelectorAll('.tab');
            tabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    const tabContainer = this.closest('.tabs');
                    const tabContentId = this.dataset.tab;
                    
                    // Update active tab
                    tabContainer.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Show corresponding tab content
                    const tabContents = tabContainer.parentElement.querySelectorAll('.tab-content');
                    tabContents.forEach(content => {
                        content.style.display = 'none';
                    });
                    document.getElementById(tabContentId).style.display = 'block';
                });
            });
            
            // Form submission
            document.getElementById('member-form').addEventListener('submit', function(e) {
                e.preventDefault();
                alert('Member added successfully! This would connect to your Spring Boot backend in production.');
            });
            
            document.getElementById('trainer-form').addEventListener('submit', function(e) {
                e.preventDefault();
                alert('Trainer added successfully! This would connect to your Spring Boot backend in production.');
            });
            
            document.getElementById('ticket-form').addEventListener('submit', function(e) {
                e.preventDefault();
                alert('Support ticket created successfully! This would connect to your Spring Boot backend in production.');
            });
            
            document.getElementById('business-form').addEventListener('submit', function(e) {
                e.preventDefault();
                alert('Business profile updated successfully! This would connect to your Spring Boot backend in production.');
            });
            
            document.getElementById('permissions-form').addEventListener('submit', function(e) {
                e.preventDefault();
                alert('Role permissions updated successfully! This would connect to your Spring Boot backend in production.');
            });
            
            document.getElementById('notifications-form').addEventListener('submit', function(e) {
                e.preventDefault();
                alert('Notification settings updated successfully! This would connect to your Spring Boot backend in production.');
            });
        });
  