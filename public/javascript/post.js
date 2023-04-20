
function saveData() {
    const payLoad = JSON.stringify({
      user: UserField.value,
      password: PasswordField.value
    });
    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
      result.innerText = xhr.responseText;
      main.style.display = 'none';
      endMessage.style.display = 'block';
    };
    xhr.open('POST', '/data');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(payLoad);
  }