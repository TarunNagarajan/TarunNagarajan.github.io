document.addEventListener('DOMContentLoaded', function() {
    const newProjectForm = document.getElementById('newProjectForm');
    const currentDate = new Date().toISOString();
    const currentUser = 'TarunNagarajan'; // Using the provided user login

    newProjectForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(newProjectForm);
        const submitBtn = newProjectForm.querySelector('button[type="submit"]');
        
        try {
            // Show loading state
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating...';
            submitBtn.disabled = true;

            // Prepare project data
            const projectData = {
                ...Object.fromEntries(formData),
                createdBy: currentUser,
                createdAt: currentDate,
                status: 'active'
            };

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            console.log('Creating project:', projectData);

            // Redirect to projects page on success
            window.location.href = 'projects.html';

        } catch (error) {
            console.error('Error creating project:', error);
            alert('Failed to create project. Please try again.');
            
            // Reset button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
});