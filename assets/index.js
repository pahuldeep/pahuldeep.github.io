document.addEventListener("DOMContentLoaded", function () {
    // Theme Toggle
    const themeToggle = document.getElementById("theme-toggle");
    const body = document.body;

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
        body.classList.remove("dark-mode");
        themeToggle.textContent = "Dark Mode";
    } else {
        body.classList.add("dark-mode");
        themeToggle.textContent = "Light Mode";
    }

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
        backToTopButton.style.display = window.scrollY > 300 ? "block" : "none";
    });

    backToTopButton.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // Fetch and render "About Me" section
    fetch("https://api.github.com/users/pahuldeep")
        .then((response) => response.json())
        .then((data) => {
            const aboutSection = document.querySelector("#about");
            aboutSection.innerHTML = `
                <h2 class="h4 text-custom">About Me</h2>
                <img src="${data.avatar_url}" alt="${data.name}" style="max-width: 150px; border-radius: 10px;">
                <p class="lead mb-4">${data.bio || "No bio available"}</p>
                <p><strong>Public Repos:</strong> ${data.public_repos}</p>
                <p><strong>Followers:</strong> ${data.followers}</p>
                <p><strong>Following:</strong> ${data.following}</p>
                <a href="${data.html_url}" target="_blank" class="btn btn-custom">Visit GitHub Profile</a>
            `;
        })
        .catch((error) => console.error("Error fetching GitHub profile:", error));

    // Fetch and render GitHub repositories
    fetch("https://api.github.com/users/pahuldeep/repos")
        .then((response) => response.json())
        .then((data) => {
            const projectsSection = document.querySelector("#projects .row");
            projectsSection.innerHTML = "";

            const excludedRepos = ["pahuldeep", "pahuldeep.github.io", "Yolo_Label"];
            const filteredRepos = data.filter(
                (repo) => !excludedRepos.includes(repo.name)
            );

            const sortedRepos = filteredRepos.sort(
                (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
            );

            const topRepos = sortedRepos.slice(0, 10);

            const fragment = document.createDocumentFragment();
            topRepos.forEach((repo) => {
                const div = document.createElement("div");
                div.className = "col";
                div.innerHTML = `
                    <div class="text-light card-custom">
                        <div class="card-custom">
                            <h5 class="card-title">${repo.name}</h5>
                            <p class="card-text">${repo.description || "No description provided"}</p>
                            <a href="${repo.html_url}" class="btn btn-custom" target="_blank">View Repo</a>
                        </div>
                    </div>
                `;
                fragment.appendChild(div);
            });

            projectsSection.appendChild(fragment);
        })
        .catch((error) => console.error("Error fetching repos:", error));

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute("href")).scrollIntoView({
                behavior: "smooth",
            });
        });
    });

    // Fetch and render Medium posts
    async function fetchMediumPosts() {
        try {
            const rssUrl = "https://medium.com/feed/@pahuldeep100";
            const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}&t=${new Date().getTime()}`;
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.status === "ok") {
                const posts = data.items;
                const postsContainer = document.getElementById("medium-posts");

                const fragment = document.createDocumentFragment();
                posts.forEach((post) => {
                    const tempDiv = document.createElement("div");
                    tempDiv.innerHTML = post.content;
                    const firstImage = tempDiv.querySelector("img");
                    const imageUrl = firstImage ? firstImage.src : "pahuldeep_new.jpg";

                    const postElement = document.createElement("article");
                    postElement.className = "row";
                    postElement.innerHTML = `
                        <div class="image-container"><img src="${imageUrl}" alt="${post.title}" class="post-image"></div>
                        <div class="post-content">
                            <h3 class="post-title">
                                <a href="${post.link}" target="_blank" rel="noopener noreferrer" class="title-link">${post.title}</a>
                            </h3>
                            <div class="post-date">${new Date(post.pubDate).toLocaleDateString()}</div>
                            <p class="post-description">${post.description.replace(/<[^>]*>/g, "").substring(0, 150)}...</p>
                            <a href="${post.link}" target="_blank" rel="noopener noreferrer" class="read-more"> Read More → </a>
                        </div>
                    `;
                    fragment.appendChild(postElement);
                });

                postsContainer.appendChild(fragment);
            }
        } catch (error) {
            console.error("Error fetching Medium posts:", error);
            document.getElementById("medium-posts").innerHTML = `
                <div class="col-span-full text-center text-gray-600">
                    Unable to load blog posts at the moment. Please try again later.
                </div>
            `;
        }
    }

    fetchMediumPosts();
});
