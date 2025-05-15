function send() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;

  fetch('http://localhost:3000/register', {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify({ username, password, role })
  })
}

function getUsers() {
  console.log(localStorage.getItem("token"));
  
  fetch('http://localhost:3000/users', {
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("token")
    }
  })
    .then(req => req.json())
    .then(response => {
      document.getElementById('users').innerHTML = '';
      for (let index = 0; index < response.length; index++) {
        document.getElementById('users').innerHTML += response[index].username + ' / ' + response[index].password + '<br />'
      }
    });
}

function getAdminUsers() {
  console.log(localStorage.getItem("token"));
  
  fetch('http://localhost:3000/admin/users', {
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("token")
    }
  })
    .then(req => req.json())
    .then(response => {
      document.getElementById('users').innerHTML = '';
      for (let index = 0; index < response.length; index++) {
        document.getElementById('users').innerHTML += response[index].username + ' / ' + response[index].password + '<br />'
      }
    });
}

function login() {
  const username = document.getElementById("login_username").value;
  const password = document.getElementById("login_password").value;
  
  fetch('http://localhost:3000/login', {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
    .then(req => req.json())
    .then(response => {
      localStorage.setItem("token", response.token)
      document.getElementById("status").innerHTML = response.status
    })
}