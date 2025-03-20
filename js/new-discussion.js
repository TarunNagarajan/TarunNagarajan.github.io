document.addEventListener('DOMContentLoaded', function() {
    // Initialize Rich Text Editor
    const quill = new Quill('#editor', {
        theme: 'snow',
        placeholder: 'Write your discussion content here...',
        modules: {
            toolbar: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                ['link', 'code-block'],
                ['clean']
            ]
        }
    });

    // Update current time
    function updateCurrentTime() {
        const now = new Date();
        const formatted = now.toISOString().replace('T', ' ').substring(0, 19);
        document.getElementById('currentTime').textContent = formatted;
    }

    // Initial time update
    updateCurrentTime();
    // Update time every minute
    setInterval(updateCurrentTime, 60000);

    // Tags handling
    const tagsInput = document.getElementById('discussionTags');
    const tagsContainer = document.querySelector('.tags-container');
    let tags = [];

    tagsInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const tag = this.value.trim();
            if (tag && !tags.includes(tag)) {
                tags.push(tag);
                renderTags();
                this.value = '';
            }
        }
    });

    function renderTags() {
        tagsContainer.innerHTML = tags.map(tag => `
            <span class="tag">
                ${tag}
                <button type="button" onclick="removeTag('${tag}')">&times;</button>
            </span>
        `).join('');
    }

    window.removeTag = function(tag) {
        tags = tags.filter(t => t !== tag);
        renderTags();
    };

    // Form submission
    const discussionForm = document.getElementById('newDiscussionForm');
    discussionForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(discussionForm);
        const submitBtn = discussionForm.querySelector('button[type="submit"]');
        
        // Get content from Quill editor
        const content = quill.root.innerHTML;
        document.getElementById('discussionContent').value = content;

        try {
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating...';
            submitBtn.disabled = true;

            // Create discussion object
            const discussion = {
                id: Date.now(),
                title: formData.get('title'),
                category: formData.get('category'),
                tags: tags,
                content: content,
                visibility: formData.get('visibility'),
                notifications: formData.get('notifications') === 'on',
                author: 'TarunNagarajan',
                created: new Date().toISOString(),
                replies: 0,
                views: 0
            };

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Store in localStorage for demo purposes
            const discussions = JSON.parse(localStorage.getItem('discussions') || '[]');
            discussions.unshift(discussion);
            localStorage.setItem('discussions', JSON.stringify(discussions));

            // Redirect back to forums page
            window.location.href = 'forums.html?new=true';

        } catch (error) {
            console.error('Error creating discussion:', error);
            alert('Failed to create discussion. Please try again.');
            
            submitBtn.innerHTML = 'Create Discussion';
            submitBtn.disabled = false;
        }
    });
});