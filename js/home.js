/**
 * Home page specific JavaScript functionality
 */

class ActivityFeed {
    constructor() {
        this.feedContainer = document.getElementById('activityFeed');
        this.page = 1;
        this.loading = false;
        this.init();
    }

    init() {
        this.loadInitialFeed();
        this.setupInfiniteScroll();
    }

    async loadInitialFeed() {
        try {
            const activities = await this.fetchActivities();
            this.renderActivities(activities);
        } catch (error) {
            console.error('Error loading feed:', error);
            this.showError();
        }
    }

    setupInfiniteScroll() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.loading) {
                    this.loadMoreActivities();
                }
            });
        }, options);

        // Add sentinel element
        const sentinel = document.createElement('div');
        sentinel.className = 'scroll-sentinel';
        this.feedContainer.appendChild(sentinel);
        observer.observe(sentinel);
    }

    async fetchActivities() {
        // Simulated API call - replace with actual API endpoint
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    {
                        id: 1,
                        author: 'Dr. Sarah Chen',
                        avatar: 'path/to/avatar1.jpg',
                        timestamp: '2025-03-19T14:30:00Z',
                        content: 'Posted a new research proposal on quantum computing applications in drug discovery.',
                        type: 'proposal'
                    },
                    {
                        id: 2,
                        author: 'Prof. James Wilson',
                        avatar: 'path/to/avatar2.jpg',
                        timestamp: '2025-03-19T12:15:00Z',
                        content: 'Looking for collaborators on a machine learning project in climate change prediction.',
                        type: 'collaboration'
                    },
                    // Add more mock data as needed
                ]);
            }, 1000);
        });
    }

    renderActivities(activities) {
        activities.forEach(activity => {
            const card = this.createActivityCard(activity);
            this.feedContainer.insertBefore(card, 
                this.feedContainer.querySelector('.scroll-sentinel'));
        });
    }

    createActivityCard(activity) {
        const card = document.createElement('div');
        card.className = 'activity-card';
        
        const timestamp = new Date(activity.timestamp);
        const timeAgo = this.getTimeAgo(timestamp);

        card.innerHTML = `
            <div class="activity-header">
                <div class="activity-avatar">
                    <img src="${activity.avatar}" alt="" 
                        onerror="this.src='assets/images/default-avatar.png'">
                </div>
                <div class="activity-meta">
                    <div class="activity-author">${activity.author}</div>
                    <div class="activity-timestamp" 
                        title="${timestamp.toLocaleString()}">${timeAgo}</div>
                </div>
            </div>
            <div class="activity-content">
                ${activity.content}
            </div>
        `;

        return card;
    }

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

    showError() {
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = 'Unable to load activities. Please try again later.';
        this.feedContainer.appendChild(errorMessage);
    }

    async loadMoreActivities() {
        this.loading = true;
        this.page++;

        try {
            const activities = await this.fetchActivities();
            this.renderActivities(activities);
        } catch (error) {
            console.error('Error loading more activities:', error);
        } finally {
            this.loading = false;
        }
    }
}

// Initialize activity feed when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const activityFeed = new ActivityFeed();
});