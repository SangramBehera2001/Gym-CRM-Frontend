// document.addEventListener('DOMContentLoaded', function() {
//     // Toggle password visibility
//     const togglePassword = document.querySelector('.toggle-password');
//     if (togglePassword) {
//         togglePassword.addEventListener('click', function() {
//             const passwordInput = this.closest('.input-group').querySelector('input');
//             const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
//             passwordInput.setAttribute('type', type);
            
//             // Toggle eye icon
//             this.querySelector('i').classList.toggle('fa-eye');
//             this.querySelector('i').classList.toggle('fa-eye-slash');
//         });
//     }
    
//     // Form submission
//     const signupForm = document.getElementById('signupForm');
//     if (signupForm) {
//         signupForm.addEventListener('submit', function(e) {
//             e.preventDefault();
//             alert('Form submitted successfully!');
//             // Here you would typically process the form data
//         });
//     }
// });