document.addEventListener("DOMContentLoaded", function () {
  // Theme Toggle
  const themeToggle = document.getElementById("theme-toggle");
  const body = document.body;

  // Check and apply the user's preferred theme from localStorage
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
      body.classList.remove("dark-mode");
      themeToggle.textContent = "Dark Mode";
  } else {
      body.classList.add("dark-mode");
      themeToggle.textContent = "Light Mode";
  }

  // Toggle theme on button click
  themeToggle.addEventListener("click", () => {
      body.classList.toggle("dark-mode");
      if (body.classList.contains("dark-mode")) {
          themeToggle.textContent = "Light Mode";
          localStorage.setItem("theme", "dark");
      } else {
          themeToggle.textContent = "Dark Mode";
          localStorage.setItem("theme", "light");
      }
  });

  // Back to Top Button
  const backToTopButton = document.getElementById("back-to-top");
  window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
          backToTopButton.style.display = "block";
      } else {
          backToTopButton.style.display = "none";
      }
  });

  backToTopButton.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Fetch and render "About Me" section from GitHub API
  fetch("https://api.github.com/users/pahuldeep")
      .then((response) => response.json())
      .then((data) => {
          const aboutSection = document.querySelector("#about");
          const aboutContent = `
              <h2 class="h4 text-custom">About Me</h2>
              <img src="${data.avatar_url}" alt="${data.name}" style="max-width: 150px; border-radius: 10px;">
              <p class="lead mb-4">${data.bio || "No bio available"}</p>
              <p><strong>Public Repos:</strong> ${data.public_repos}</p>
              <p><strong>Followers:</strong> ${data.followers}</p>
              <p><strong>Following:</strong> ${data.following}</p>
              <a href="${data.html_url}" target="_blank" class="btn btn-custom">Visit GitHub Profile</a>
          `;
          aboutSection.innerHTML = aboutContent;
      })
      .catch((error) => {
          console.error("Error fetching GitHub profile:", error);
      });

  // Fetch and render GitHub repositories
  fetch("https://api.github.com/users/pahuldeep/repos")
      .then((response) => response.json())
      .then((data) => {
          const projectsSection = document.querySelector("#projects .row");
          projectsSection.innerHTML = ""; // Clear spinner
          const sortedRepos = data.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

          sortedRepos.forEach((repo) => {
              const repoCard = `
                  <div class="col">
                      <div class="text-light card-custom">
                          <div class="card-body">
                              <h5 class="card-title">${repo.name}</h5>
                              <p class="card-text">${repo.description || "No description provided"}</p>
                              <a href="${repo.html_url}" class="btn btn-custom" target="_blank">View Repo</a>
                          </div>
                      </div>
                  </div>
              `;
              projectsSection.innerHTML += repoCard;
          });
      })
      .catch((error) => {
          console.error("Error fetching repos:", error);
      });

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
          e.preventDefault();
          document.querySelector(this.getAttribute("href")).scrollIntoView({
              behavior: "smooth",
          });
      });
  });
});
