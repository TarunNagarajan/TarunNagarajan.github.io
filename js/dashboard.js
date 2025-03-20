/**
 * Dashboard functionality
 * Current User: TarunNagarajan
 * Last Updated: 2025-03-20 03:02:29 UTC
 */

class Dashboard {
    constructor() {
        this.currentUser = 'TarunNagarajan';
        this.lastLogin = '2025-03-20 03:02:29';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadDashboardData();
        this.initializeModals();
        this.setupMobileNavigation();
        this.setupActivityFilters();
        this.startAutoRefresh();
    }

    setupEventListeners() {
        // Quick Action Buttons
        document.getElementById('newProjectBtn')?.addEventListener('click', () => this.showModal('newProjectModal'));
        document.getElementById('newDiscussionBtn')?.addEventListener('click', () => this.handleNewDiscussion());
        document.getElementById('findCollaboratorsBtn')?.addEventListener('click', () => this.handleFindCollaborators());
        document.getElementById('scheduleMeetingBtn')?.addEventListener('click', () => this.handleScheduleMeeting());

        // Form Submissions
        document.getElementById('newProjectForm')?.addEventListener('submit', (e) => this.handleNewProject(e));

        // Logout
        document.getElementById('logoutBtn')?.addEventListener('click', (e) => this.handleLogout(e));
    }

    async loadDashboardData() {
        try {
            await Promise.all([
                this.loadActiveProjects(),
                this.loadRecentActivity(),
                this.loadSuggestedCollaborators(),
                this.loadNotifications(),
                this.loadUpcomingMeetings()
            ]);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            this.showError('Failed to load some dashboard components');
        }
    }

    async loadActiveProjects() {
        const projectsContainer = document.getElementById('activeProjects');
        if (!projectsContainer) return;

        try {
            // Simulate API call
            const projects = await this.fetchActiveProjects();
            projectsContainer.innerHTML = projects.map(project => this.createProjectCard(project)).join('');
        } catch (error) {
            console.error('Error loading projects:', error);
            projectsContainer.innerHTML = '<div class="error-message">Failed to load projects</div>';
        }
    }

    createProjectCard(project) {
        return `
            <div class="project-card">
                <div class="project-header">
                    <h3 class="project-title">${project.title}</h3>
                    <span class="project-status status-${project.status.toLowerCase()}">${project.status}</span>
                </div>
                <p>${project.description}</p>
                <div class="project-meta">
                    <div class="project-team">
                        ${this.createTeamAvatars(project.team)}
                    </div>
                    <div class="project-progress">
                        <div class="progress-bar">
                            <div class="progress" style="width: ${project.progress}%"></div>
                        </div>
                        <span>${project.progress}% Complete</span>
                    </div>
                </div>
            </div>
        `;
    }

    createTeamAvatars(team) {
        return team.map(member => `
            <div class="team-member" title="${member.name}">
                <img src="${member.avatar}" alt="${member.name}" 
                     onerror="this.src='assets/images/default-avatar.png'">
            </div>
        `).join('');
    }

    async loadRecentActivity() {
        const timelineContainer = document.getElementById('activityTimeline');
        if (!timelineContainer) return;

        try {
            const activities = await this.fetchRecentActivity();
            timelineContainer.innerHTML = activities.map(activity => this.createActivityItem(activity)).join('');
        } catch (error) {
            console.error('Error loading activity:', error);
            timelineContainer.innerHTML = '<div class="error-message">Failed to load recent activity</div>';
        }
    }

    createActivityItem(activity) {
        const timeAgo = this.getTimeAgo(new Date(activity.timestamp));
        return `
            <div class="activity-item" data-type="${activity.type}">
                <div class="activity-icon">
                    <i class="fas ${this.getActivityIcon(activity.type)}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-header">
                        <strong>${activity.user}</strong> ${activity.action}
                    </div>
                    <div class="activity-time">${timeAgo}</div>
                </div>
            </div>
        `;
    }

    getActivityIcon(type) {
        const icons = {
            project: 'fa-project-diagram',
            discussion: 'fa-comments',
            collaboration: 'fa-users',
            meeting: 'fa-calendar',
            default: 'fa-circle'
        };
        return icons[type] || icons.default;
    }

    setupActivityFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                button.classList.add('active');
                // Filter activities
                this.filterActivities(button.dataset.filter);
            });
        });
    }

    filterActivities(filter) {
        const activities = document.querySelectorAll('.activity-item');
        activities.forEach(activity => {
            if (filter === 'all' || activity.dataset.type === filter) {
                activity.style.display = 'flex';
            } else {
                activity.style.display = 'none';
            }
        });
    }

    initializeModals() {
        // Close modal when clicking outside
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.hideModal(modal.id);
            });
        });

        // Close modal when clicking close button
        document.querySelectorAll('.close-modal').forEach(button => {
            button.addEventListener('click', () => {
                const modal = button.closest('.modal');
                this.hideModal(modal.id);
            });
        });
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    setupMobileNavigation() {
        const sidebar = document.querySelector('.dashboard-sidebar');
        const notifications = document.querySelector('.dashboard-notifications');

        // Create mobile toggle buttons
        const sidebarToggle = document.createElement('button');
        sidebarToggle.className = 'mobile-sidebar-toggle';
        sidebarToggle.innerHTML = '<i class="fas fa-bars"></i>';

        const notificationsToggle = document.createElement('button');
        notificationsToggle.className = 'mobile-notifications-toggle';
        notificationsToggle.innerHTML = '<i class="fas fa-bell"></i>';

        document.body.appendChild(sidebarToggle);
        document.body.appendChild(notificationsToggle);

        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });

        notificationsToggle.addEventListener('click', () => {
            notifications.classList.toggle('active');
        });
    }

    // Simulated API calls
    async fetchActiveProjects() {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve([
                    {
                        title: 'Quantum Computing Research',
                        status: 'Active',
                        description: 'Investigating quantum algorithms for drug discovery',
                        team: [
                            { name: 'TarunNagarajan', avatar: 'assets/images/avatar1.jpg' },
                            { name: 'Sarah Chen', avatar: 'assets/images/avatar2.jpg' }
                        ],
                        progress: 65
                    },
                    // Add more mock projects
                ]);
            }, 1000);
        });
    }

    async fetchRecentActivity() {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve([
                    {
                        type: 'project',
                        user: 'TarunNagarajan',
                        action: 'updated the quantum computing research project',
                        timestamp: '2025-03-20T02:45:00Z'
                    },
                    // Add more mock activities
                ]);
            }, 1000);
        });
    }

    // Utility functions
    getTimeAgo(date) {
        const seconds = Math.floor((new Date() - date) / 1000);
        const intervals = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60
        };

        for (const [unit, secondsInUnit] of Object.entries(intervals)) {
            const interval = Math.floor(seconds / secondsInUnit);
            if (interval >= 1) {
                return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
            }
        }
        return 'Just now';
    }

    showError(message) {
        // Implement error notification
        console.error(message);
        // You could add a toast notification system here
    }

    startAutoRefresh() {
        // Refresh dashboard data every 5 minutes
        setInterval(() => this.loadDashboardData(), 300000);
    }

    // Event Handlers
    handleNewProject(e) {
        e.preventDefault();
        // Implement project creation logic
        const formData = new FormData(e.target);
        console.log('Creating new project:', Object.fromEntries(formData));
        this.hideModal('newProjectModal');
    }

    handleNewDiscussion() {
        // Implement discussion creation logic
        console.log('Opening new discussion dialog');
    }

    handleFindCollaborators() {
        // Implement collaborator search logic
        console.log('Opening collaborator search');
    }

    handleScheduleMeeting() {
        // Implement meeting scheduling logic
        console.log('Opening meeting scheduler');
    }

    handleLogout(e) {
        e.preventDefault();
        // Implement logout logic
        console.log('Logging out...');
        window.location.href = 'index.html';
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const dashboard = new Dashboard();
});