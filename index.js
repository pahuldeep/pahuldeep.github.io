document.addEventListener("DOMContentLoaded", function() {
    // Fetch and render "About Me" section from GitHub API
    fetch('https://api.github.com/users/pahuldeep')
      .then(response => response.json())
      .then(data => {
        const aboutSection = document.querySelector("#about");

        // Create dynamic content using GitHub API data
        const aboutContent = `
          <h2 class="h4 mb-4 text-custom">About Me</h2>
          <img src="${data.avatar_url}" alt="${data.name}" class="img-fluid rounded-circle mb-4" style="max-width: 150px;">
          <p class="lead mb-4">${data.bio || "No bio available"}</p>
          <p><strong>Public Repos:</strong> ${data.public_repos}</p>
          <p><strong>Followers:</strong> ${data.followers}</p>
          <p><strong>Following:</strong> ${data.following}</p>
          <a href="${data.html_url}" target="_blank" class="btn btn-custom">Visit GitHub Profile</a>
        `;

        // Insert content into the #about section
        aboutSection.innerHTML = aboutContent;
      })
      .catch(error => console.error('Error fetching GitHub profile:', error));

  // Fetch and render GitHub repositories, sorted by the most recently updated
  fetch('https://api.github.com/users/pahuldeep/repos')
  .then(response => response.json())
  .then(data => {
    const projectsSection = document.querySelector('#projects .row');

    // Sort repositories by the updated_at field, newest first
    const sortedRepos = data.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

    sortedRepos.forEach(repo => {
      const repoCard = `
        <div class="col-md-4 mb-4">
          <div class="card bg-dark text-light card-custom shadow-sm">
            <div class="card-body">
              <h5 class="card-title">${repo.name}</h5>
              <p class="card-text">${repo.description || 'No description provided'}</p>
              <a href="${repo.html_url}" class="btn btn-custom" target="_blank">View Repo</a>
            </div>
          </div>
        </div>
      `;
      projectsSection.innerHTML += repoCard;
    });
  })
  .catch(error => console.error('Error fetching repos:', error));
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
});
