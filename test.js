function send() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  fetch('http://localhost:3000/register', {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
}

function getUsers() {
  fetch('https://test-repository-34ze.onrender.com/users')
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
      document.getElementById("status").innerHTML = response.status
    })
}