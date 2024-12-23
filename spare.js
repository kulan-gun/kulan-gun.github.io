if (typingElement) {
    // Start the typing animation after a 1-second delay
    setTimeout(() => {
        typeAnimation();
    }, 1000);
}

   
/* NEW CODE */

const caseStudyCards = document.querySelectorAll('.case-study-card');
const correctPasswordHash = '0700f63ec526acd63624bb125e8173acf3ed77f0c41e52086aed902d6d5778ae';

// Attach click handlers
caseStudyCards.forEach(card => {
    card.addEventListener('click', function (e) {
        e.preventDefault();
        const caseStudyUrl = this.getAttribute('data-case-study');

        if (caseStudyUrl) {
            promptPassword(caseStudyUrl);
        } else if (this.classList.contains('coming-soon')) {
            alert('This case study is coming soon!');
        } else {
            window.location.href = this.href;
        }
    });
});

// Password prompt logic
async function promptPassword(url) {
    const password = prompt("Please enter the password to view this case study:");
    if (password) {
        const hashedPassword = await sha256(password);
        if (hashedPassword === correctPasswordHash) {
            window.location.href = url;
        } else {
            alert("Incorrect password. Please try again.");
        }
    }
}

// Password hashing function
async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}


async function promptPassword(url) {
    const password = prompt("Please enter the password to view this case study:");
    if (password) {
        const hashedPassword = await sha256(password);
        if (hashedPassword === correctPasswordHash) {
            window.location.href = url; // Redirect on successful password entry
        } else {
            alert("Incorrect password. Please try again."); // Inform user of incorrect password
        }
    }
}