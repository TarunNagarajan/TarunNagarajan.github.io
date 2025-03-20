/**
 * Profile Page Functionality
 * @author TarunNagarajan
 * @lastUpdated 2025-03-20 06:10:16
 */

class ProfileManager {
    constructor() {
        this.currentUser = 'TarunNagarajan';
        this.isOwnProfile = true; // Set based on viewing user
        this.activeFilter = 'all';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadProfileData();
        this.setupImageUploads();
        this.initializeEditButtons();
    }

    setupEventListeners() {
        // Activity Filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.setActiveFilter(btn.dataset.filter);
            });
        });

        // Edit Profile Button
        document.getElementById('editProfileBtn')?.addEventListener('click', 
            () => this.showEditProfileModal());

        // Share Profile Button
        document.getElementById('shareProfileBtn')?.addEventListener('click', 
            () => this.handleShareProfile());

        // Modal Close Buttons
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                const modal = btn.closest('.modal');
                if (modal) this.hideModal(modal.id);
            });
        });
    }

    async loadProfileData() {
        try {
            await Promise.all([
                this.loadActivityTimeline(),
                this.loadCollaborators(),
                this.loadSkills()
            ]);
        } catch (error) {
            console.error('Error loading profile data:', error);
            this.showError('Failed to load some profile components');
        }
    }

    setupImageUploads() {
        // Profile Avatar Upload
        const avatarBtn = document.getElementById('editAvatarBtn');
        const avatarInput = document.createElement('input');
        avatarInput.type = 'file';
        avatarInput.accept = 'image/*';
        avatarInput.style.display = 'none';
        
        avatarBtn?.addEventListener('click', () => avatarInput.click());
        avatarInput.addEventListener('change', (e) => this.handleAvatarUpload(e));

        // Cover Image Upload
        const coverBtn = document.getElementById('editCoverBtn');
        const coverInput = document.createElement('input');
        coverInput.type = 'file';
        coverInput.accept = 'image/*';
        coverInput.style.display = 'none';
        
        coverBtn?.addEventListener('click', () => coverInput.click());
        coverInput.addEventListener('change', (e) => this.handleCoverUpload(e));
    }

    initializeEditButtons() {
        if (!this.isOwnProfile) return;

        const editButtons = {
            editTitleBtn: this.editTitle,
            editAboutBtn: this.editAbout,
            editInterestsBtn: this.editInterests,
            editEducationBtn: this.editEducation,
            editSkillsBtn: this.editSkills
        };

        Object.entries(editButtons).forEach(([btnId, handler]) => {
            document.getElementById(btnId)?.addEventListener('click', 
                () => handler.call(this));
        });
    }

    async loadActivityTimeline() {
        const timelineContainer = document.getElementById('activityTimeline');
        if (!timelineContainer) return;

        try {
            const activities = await this.fetchActivities();
            timelineContainer.innerHTML = activities
                .map(activity => this.createTimelineItem(activity))
                .join('');
        } catch (error) {
            console.error('Error loading timeline:', error);
            timelineContainer.innerHTML = this.getErrorStateHTML();
        }
    }

    createTimelineItem(activity) {
        const timeAgo = this.getTimeAgo(new Date(activity.timestamp));
        
        return `
            <div class="timeline-item">
                <div class="timeline-icon">
                    <i class="fas ${this.getActivityIcon(activity.type)}"></i>
                </div>
                <div class="timeline-content">
                    <div class="timeline-header">
                        <span class="timeline-title">${activity.title}</span>
                        <span class="timeline-time">${timeAgo}</span>
                    </div>
                    <p>${activity.description}</p>
                    ${activity.link ? `
                        <a href="${activity.link}" class="timeline-link">
                            View ${activity.type}
                        </a>
                    ` : ''}
                </div>
            </div>
        `;
    }

    getActivityIcon(type) {
        const icons = {
            project: 'fa-project-diagram',
            discussion: 'fa-comments',
            publication: 'fa-file-alt',
            default: 'fa-circle'
        };
        return icons[type] || icons.default;
    }

    async loadCollaborators() {
        const collaboratorsContainer = document.getElementById('collaboratorsList');
        if (!collaboratorsContainer) return;

        try {
            const collaborators = await this.fetchCollaborators();
            collaboratorsContainer.innerHTML = collaborators
                .map(collaborator => this.createCollaboratorItem(collaborator))
                .join('');
        } catch (error) {
            console.error('Error loading collaborators:', error);
            collaboratorsContainer.innerHTML = this.getErrorStateHTML();
        }
    }

    createCollaboratorItem(collaborator) {
        return `
            <div class="collaborator-item">
                <img src="${collaborator.avatar}" alt="${collaborator.name}" 
                     class="collaborator-avatar"
                     onerror="this.src='assets/images/default-avatar.png'">
                <div class="collaborator-info">
                    <div class="collaborator-name">${collaborator.name}</div>
                    <div class="collaborator-title">${collaborator.title}</div>
                </div>
            </div>
        `;
    }

    // Edit Profile Methods
    editTitle() {
        const titleElement = document.querySelector('.profile-title');
        const currentTitle = titleElement.textContent.trim();
        
        this.showEditModal('Edit Title', `
            <div class="form-group">
                <label for="profileTitle">Professional Title</label>
                <input type="text" id="profileTitle" name="title" 
                       value="${currentTitle}" required>
            </div>
        `, async (formData) => {
            const newTitle = formData.get('title');
            titleElement.textContent = newTitle;
            await this.updateProfile({ title: newTitle });
        });
    }

    editAbout() {
        const aboutContent = document.getElementById('aboutContent');
        const currentAbout = aboutContent.querySelector('p').textContent.trim();
        
        this.showEditModal('Edit About', `
            <div class="form-group">
                <label for="aboutText">About Me</label>
                <textarea id="aboutText" name="about" rows="4" required>${currentAbout}</textarea>
            </div>
        `, async (formData) => {
            const newAbout = formData.get('about');
            aboutContent.querySelector('p').textContent = newAbout;
            await this.updateProfile({ about: newAbout });
        });
    }

    // Image Upload Handlers
    async handleAvatarUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        try {
            await this.uploadImage(file, 'avatar');
            const avatarImg = document.getElementById('profileAvatar');
            if (avatarImg) {
                avatarImg.src = URL.createObjectURL(file);
            }
        } catch (error) {
            console.error('Error uploading avatar:', error);
            this.showNotification('Failed to upload avatar', 'error');
        }
    }

    async handleCoverUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        try {
            await this.uploadImage(file, 'cover');
            const coverDiv = document.querySelector('.profile-cover');
            if (coverDiv) {
                coverDiv.style.backgroundImage = `url(${URL.createObjectURL(file)})`;
            }
        } catch (error) {
            console.error('Error uploading cover:', error);
            this.showNotification('Failed to upload cover image', 'error');
        }
    }

    // API Simulation Methods
    async fetchActivities() {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve([
                    {
                        type: 'project',
                        title: 'Started new research project',
                        description: 'Investigating quantum algorithms for optimization problems',
                        timestamp: '2025-03-20T05:30:00Z',
                        link: '#'
                    },
                    // Add more mock activities
                ]);
            }, 1000);
        });
    }

    async fetchCollaborators() {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve([
                    {
                        name: 'Dr. Sarah Chen',
                        title: 'Research Scientist at Stanford',
                        avatar: 'assets/images/avatar2.jpg'
                    },
                    // Add more mock collaborators
                ]);
            }, 1000);
        });
    }

    // Utility Methods
    showNotification(message, type = 'info') {
        console.log(`${type.toUpperCase()}: ${message}`);
        // Implement actual notification system
    }

        // Continuing ProfileManager class...

        async uploadImage(file, type) {
            // Simulate image upload
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    setTimeout(() => {
                        console.log(`Uploading ${type} image:`, file.name);
                        resolve({ url: reader.result });
                    }, 1500);
                };
                reader.onerror = () => reject(new Error('Failed to read file'));
                reader.readAsDataURL(file);
            });
        }
    
        async updateProfile(data) {
            // Simulate API call to update profile
            return new Promise(resolve => {
                setTimeout(() => {
                    console.log('Updating profile with:', data);
                    resolve({ success: true });
                    this.showNotification('Profile updated successfully', 'success');
                }, 1000);
            });
        }
    
        setActiveFilter(filter) {
            this.activeFilter = filter;
            
            // Update UI
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.filter === filter);
            });
    
            // Filter timeline items
            const items = document.querySelectorAll('.timeline-item');
            items.forEach(item => {
                const type = item.querySelector('.timeline-icon i').className
                    .split(' ')
                    .find(cls => cls.startsWith('fa-'))
                    .replace('fa-', '');
                
                item.style.display = 
                    (filter === 'all' || type === filter) ? 'flex' : 'none';
            });
        }
    
        handleShareProfile() {
            const shareUrl = window.location.href;
            const shareTitle = `${this.currentUser}'s Research Profile`;
    
            if (navigator.share) {
                navigator.share({
                    title: shareTitle,
                    url: shareUrl
                }).catch(console.error);
            } else {
                // Fallback to clipboard copy
                navigator.clipboard.writeText(shareUrl)
                    .then(() => this.showNotification('Profile URL copied to clipboard', 'success'))
                    .catch(() => this.showNotification('Failed to copy URL', 'error'));
            }
        }
    
        showEditModal(title, content, onSave) {
            const modal = document.getElementById('editProfileModal');
            const form = document.getElementById('editProfileForm');
            
            if (!modal || !form) return;
    
            // Update modal content
            modal.querySelector('.modal-header h2').textContent = title;
            form.innerHTML = `
                ${content}
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" data-action="cancel">
                        Cancel
                    </button>
                    <button type="submit" class="btn btn-primary">
                        Save Changes
                    </button>
                </div>
            `;
    
            // Setup form submission
            form.onsubmit = async (e) => {
                e.preventDefault();
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                
                try {
                    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
                    submitBtn.disabled = true;
                    
                    await onSave(new FormData(form));
                    this.hideModal('editProfileModal');
                } catch (error) {
                    console.error('Error saving changes:', error);
                    this.showNotification('Failed to save changes', 'error');
                } finally {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }
            };
    
            // Setup cancel button
            form.querySelector('[data-action="cancel"]').onclick = () => {
                this.hideModal('editProfileModal');
            };
    
            modal.style.display = 'block';
        }
    
        hideModal(modalId) {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.style.display = 'none';
            }
        }
    
        getErrorStateHTML() {
            return `
                <div class="error-state">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Failed to load content. Please try again later.</p>
                </div>
            `;
        }
    
        getLinkToProfile(username) {
            return `/profile/${username}`;
        }
    
        formatDate(date) {
            return new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
    
        validateImageFile(file) {
            const maxSize = 5 * 1024 * 1024; // 5MB
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    
            if (!allowedTypes.includes(file.type)) {
                throw new Error('Invalid file type. Please upload a JPEG, PNG, or GIF image.');
            }
    
            if (file.size > maxSize) {
                throw new Error('File size too large. Please upload an image under 5MB.');
            }
    
            return true;
        }
    
        // Analytics tracking
        trackProfileView() {
            // Implement analytics tracking
            console.log('Profile view tracked:', {
                viewer: this.currentUser,
                timestamp: new Date().toISOString(),
                location: window.location.href
            });
        }
    
        trackProfileAction(action, details = {}) {
            // Implement analytics tracking for profile actions
            console.log('Profile action tracked:', {
                user: this.currentUser,
                action,
                details,
                timestamp: new Date().toISOString()
            });
        }
    }
    
    // Initialize profile manager when DOM is loaded
    document.addEventListener('DOMContentLoaded', () => {
        const profileManager = new ProfileManager();
        
        // Track profile view
        profileManager.trackProfileView();
    });