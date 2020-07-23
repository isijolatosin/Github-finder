class GITHUB {
  constructor() {
    this.base = 'https://api.github.com/users/';
    this.client_id = '7a787f41303ac44395ac';
    this.client_secret = 'e97fdf7e8c94c87a7f3cfc46f20673d30cdb67fd';
  }

  //fetch data
  async fetchUser(userValue) {
    // user url
    const userURL = `${this.base}${userValue}?client_id='${this.client_id}'&client_secret='${this.client_secret}'`;

    //repos url
    const reposURL = `${this.base}${userValue}/repos?client_id='${this.client_id}'&client_secret='${this.client_secret}'`;

    //get user
    const userData = await fetch(userURL);
    const user = await userData.json();
    //get repos
    const reposData = await fetch(reposURL);
    const repos = await reposData.json();
    return { user, repos };
  }
}

class Display {
  showFeedback(text) {
    const feedback = document.querySelector('.feedback');
    feedback.classList.add('showItem');
    feedback.innerHTML = `<p>${text}</p>`;

    setTimeout(() => {
      feedback.classList.remove('showItem');
    }, 2000);
  }

  //clear input
  clearField() {
    const searchUser = document.getElementById('searchUser');
    searchUser.value = '';
  }

  //display user
  display(user) {
    const {
      avatar_url: image,
      html_url: link,
      name,
      login,
      public_repos: repos,
      message,
      blog,
    } = user;
    if (message === 'Not Found') {
      this.showFeedback(
        'user not available, Please enter a valid github user name'
      );
      this.clearField();
    } else {
      const usersList = document.getElementById('github-users');
      const div = document.createElement('div');
      div.classList.add('row', 'single-user', 'my-3');
      div.innerHTML = `<div class=" col-sm-6 col-md-4 user-photo my-2">
       <img src=${image} class="img-fluid" alt="">
      </div>
      <div class="col-sm-6 col-md-4 user-info text-capitalize my-2">
       <h6>name : <span>${name}</span></h6>
       <h6>blog : <a href="#" class="badge badge-primary">${blog}</a> </h6>
       <h6>github : <a href="${link}" class="badge badge-primary">link</a> </h6>
       <h6>public repos : <span class="badge badge-success">${repos}</span> </h6>
      </div>
      <div class=" col-sm-6 col-md-4 user-repos my-2">
       <button type="button" data-id="${login}" id="getRepos" class="btn reposBtn text-capitalize mt-3">
        get repos
       </button>
      </div>`;
      usersList.appendChild(div);
      this.clearField();
    }
  }
  //display repos
  displayRepos(userID, repos) {
    const reposBtn = document.querySelectorAll('[data-id]');
    reposBtn.forEach((repoBtn) => {
      if (repoBtn.dataset.id === userID) {
        const parent = repoBtn.parentNode;
        repos.forEach((repo) => {
          const p = document.createElement('p');
          p.innerHTML = `<p><a href="${repos.html_url}" target="_blank">${repo.name}</a></p>`;
          parent.appendChild(p);
        });
      }
    });
  }
}

(function () {
  const display = new Display();
  const github = new GITHUB();

  const searchForm = document.getElementById('searchForm');
  const searchUser = document.getElementById('searchUser');
  const userList = document.getElementById('github-users');

  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const textValue = searchUser.value;

    if (textValue === '') {
      display.showFeedback('Please enter github user name');
    } else {
      github
        .fetchUser(textValue)
        .then((data) => display.display(data.user))
        .catch((error) => console.log(error));
    }
  });
  userList.addEventListener('click', (e) => {
    // console.log(e.target);
    if (e.target.classList.contains('reposBtn')) {
      const userID = e.target.dataset.id;
      github
        .fetchUser(userID)
        .then((data) => display.displayRepos(userID, data.repos))
        .catch((error) => console.log(error));
    }
  });
})();
