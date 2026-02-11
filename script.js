document.addEventListener('DOMContentLoaded', () => {
    // precise selection for sidebar links
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // If it's a real link, let it navigate
            if (item.getAttribute('href') !== '#' && item.getAttribute('href') !== '') {
                return;
            }
            
            e.preventDefault();
            
            // Remove active class from all
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked
            item.classList.add('active');

            // Optional: Show a toast/notification to simulate loading content
            // console.log(`Navigating to ${item.innerText.trim()}...`);
        });
    });

    // Add specific interaction for Quick Actions (User Dashboard)
    const quickActions = document.querySelectorAll('.action-card-btn');
    quickActions.forEach(btn => {
        btn.addEventListener('click', () => {
             // Visual feedback
             const originalText = btn.innerHTML;
             btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin" style="margin-right: 8px;"></i> Loading...';
             setTimeout(() => {
                 btn.innerHTML = originalText;
                 alert('Action triggered!');
             }, 800);
        });
    });
});
