
/* global items */

getData();

function getData() {
  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    let body = JSON.parse(xhr.responseText);
    let result = '';
 
    items.innerHTML = result;
  };
  xhr.open('GET', '/data');
  xhr.send();
}