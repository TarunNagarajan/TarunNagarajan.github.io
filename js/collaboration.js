document.addEventListener('DOMContentLoaded', function() {
    // User and time configuration
    const currentUser = 'TarunNagarajan';
    let currentUTCTime = '2025-03-20 08:06:19';

    // Update current time
    function updateCurrentTime() {
        const now = new Date();
        currentUTCTime = now.toISOString().slice(0, 19).replace('T', ' ');
        document.getElementById('currentTime').textContent = currentUTCTime;
    }

    // Initialize time update
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000); // Update every second

    // Sample collaboration data
    const activeCollaborations = [
        {
            id: 1,
            type: 'research',
            title: 'Quantum Computing Research',
            description: 'Investigating quantum algorithms for machine learning optimization problems',
            members: [
                { name: currentUser, role: 'Lead Researcher' },
                { name: 'Alice Johnson', role: 'Quantum Physicist' },
                { name: 'Bob Smith', role: 'ML Engineer' }
            ],
            status: 'active',
            lastUpdated: '2025-03-19 15:30:00'
        },
        {
            id: 2,
            type: 'publication',
            title: 'Machine Learning Paper',
            description: 'Writing a comprehensive paper on novel neural network architectures',
            members: [
                { name: currentUser, role: 'Co-author' },
                { name: 'Carol Williams', role: 'Lead Author' }
            ],
            status: 'active',
            lastUpdated: '2025-03-20 07:45:00'
        }
    ];

    const collaborationOpportunities = [
        {
            id: 3,
            type: 'mentorship',
            title: 'AI Research Mentorship Program',
            description: 'Seeking experienced mentors for graduate students in AI research',
            neededRoles: ['Senior AI Researcher', 'ML Engineer'],
            status: 'seeking',
            postedBy: 'David Chen',
            postedDate: '2025-03-18 09:00:00'
        },
        {
            id: 4,
            type: 'research',
            title: 'Data Science Project',
            description: 'Looking for collaborators in advanced data analysis and visualization',
            neededRoles: ['Data Scientist', 'Visualization Expert'],
            status: 'seeking',
            postedBy: 'Emma Davis',
            postedDate: '2025-03-19 14:20:00'
        }
    ];

    // Render collaboration cards
    function renderCollaborationCard(item, type = 'active') {
        const isActive = type === 'active';
        return `
            <div class="collaboration-card">
                <span class="collaboration-type type-${item.type}">
                    ${item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                </span>
                <h3 class="card-title">${item.title}</h3>
                <p class="card-description">${item.description}</p>
                
                ${isActive ? renderActiveCollaborationDetails(item) : renderOpportunityDetails(item)}
                
                <div class="card-actions">
                    <button class="btn btn-secondary btn-sm" onclick="viewDetails(${item.id})">
                        <i class="fas fa-info-circle"></i> Details
                    </button>
                    ${isActive ? 
                        `<button class="btn btn-primary btn-sm" onclick="openChat(${item.id})">
                            <i class="fas fa-comments"></i> Chat
                        </button>` :
                        `<button class="btn btn-primary btn-sm" onclick="applyCollaboration(${item.id})">
                            <i class="fas fa-user-plus"></i> Apply
                        </button>`
                    }
                </div>
            </div>
        `;
    }

    function renderActiveCollaborationDetails(item) {
        return `
            <div class="members-section">
                <h4>Team Members (${item.members.length})</h4>
                <div class="members-list">
                    ${item.members.map(member => `
                        <div class="member-item">
                            <span class="member-name">${member.name}</span>
                            <span class="member-role">${member.role}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="card-meta">
                <span class="status-badge status-${item.status}">
                    <i class="fas fa-circle"></i> ${item.status}
                </span>
                <span class="last-updated">
                    <i class="fas fa-clock"></i> Updated ${formatTimeAgo(item.lastUpdated)}
                </span>
            </div>
        `;
    }

    function renderOpportunityDetails(item) {
        return `
            <div class="needed-roles">
                <h4>Roles Needed</h4>
                <div class="roles-list">
                    ${item.neededRoles.map(role => `
                        <span class="role-badge">${role}</span>
                    `).join('')}
                </div>
            </div>
            <div class="card-meta">
                <span class="posted-by">Posted by ${item.postedBy}</span>
                <span class="posted-date">
                    <i class="fas fa-calendar"></i> ${formatTimeAgo(item.postedDate)}
                </span>
            </div>
        `;
    }

    // Utility function to format time ago
    function formatTimeAgo(timestamp) {
        const date = new Date(timestamp.replace(' ', 'T') + 'Z');
        const now = new Date(currentUTCTime.replace(' ', 'T') + 'Z');
        const seconds = Math.floor((now - date) / 1000);

        if (seconds < 60) return 'just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    }

    // Initialize page content
    function initializePage() {
        // Render active collaborations
        const activeContainer = document.getElementById('activeCollaborations');
        if (activeContainer) {
            activeContainer.innerHTML = activeCollaborations
                .map(collab => renderCollaborationCard(collab, 'active'))
                .join('');
        }

        // Render opportunities
        const opportunitiesContainer = document.getElementById('collaborationOpportunities');
        if (opportunitiesContainer) {
            opportunitiesContainer.innerHTML = collaborationOpportunities
                .map(opp => renderCollaborationCard(opp, 'opportunity'))
                .join('');
        }

        // Initialize filters
        initializeFilters();
    }

    // Initialize filters
    function initializeFilters() {
        const filterBtn = document.getElementById('filterBtn');
        const searchInput = document.getElementById('collaborationSearch');

        filterBtn?.addEventListener('click', () => {
            // Toggle filter sidebar on mobile
            document.querySelector('.collaboration-sidebar').classList.toggle('active');
        });

        searchInput?.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            filterCollaborations(searchTerm);
        });

        // Add event listeners for checkbox filters
        document.querySelectorAll('.checkbox-group input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                applyFilters();
            });
        });
    }

    // Initialize the page
    initializePage();

    // Export functions for global use
    window.viewDetails = function(id) {
        console.log('Viewing details for collaboration:', id);
        // Implement view details functionality
    };

    window.openChat = function(id) {
        console.log('Opening chat for collaboration:', id);
        // Implement chat functionality
    };

    window.applyCollaboration = function(id) {
        console.log('Applying for collaboration:', id);
        // Implement apply functionality
    };
});