document.addEventListener('DOMContentLoaded', function() {
    // Get modal elements
    const createProjectModal = document.getElementById('createProjectModal');
    const closeModalBtn = createProjectModal.querySelector('.close-modal');
    const createProjectBtn = document.getElementById('createProjectBtn');
    const cancelBtn = createProjectModal.querySelector('[data-action="cancel"]');
    const createProjectForm = document.getElementById('createProjectForm');

    // Show modal
    function showModal() {
        createProjectModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    // Hide modal
    function hideModal() {
        createProjectModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Event listeners
    createProjectBtn?.addEventListener('click', showModal);
    closeModalBtn?.addEventListener('click', hideModal);
    cancelBtn?.addEventListener('click', hideModal);

    // Close modal when clicking outside
    createProjectModal?.addEventListener('click', (e) => {
        if (e.target === createProjectModal) {
            hideModal();
        }
    });

    // Handle form submission
    createProjectForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(createProjectForm);
        
        try {
            // Show loading state
            const submitBtn = createProjectForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating...';
            submitBtn.disabled = true;

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Log form data (replace with actual API call)
            console.log('Creating project with data:', Object.fromEntries(formData));

            // Show success message
            alert('Project created successfully!');
            hideModal();
            createProjectForm.reset();

        } catch (error) {
            console.error('Error creating project:', error);
            alert('Failed to create project. Please try again.');
        } finally {
            // Reset button state
            const submitBtn = createProjectForm.querySelector('button[type="submit"]');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
});