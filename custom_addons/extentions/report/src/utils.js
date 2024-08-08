var html2text = function (html) {
  var div = document.createElement('div');
  div.innerHTML = html;
  var text = div.innerText;
  div.remove();
  return text;
};
var fetchData = (url, data, method, callback) => {
  fetch(url, {
    method: method, //'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(response => {
      callback(response);
    });
};
var isEmpty = (str) => {
  //if (typeof str == 'undefined' || !str || str.length === 0 || str === "" || !/[^\s]/.test(str) || /^\s*$/.test(str) || str.replace(/\s/g,"") === "") {
  if (typeof str == 'undefined' || str === 'undefined' || !str || str == "" || str == null) {
    return true;
  } else {
    return false;
  }
};
var isObjectEmpty = (obj) => {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
};

export default {
  html2text: html2text,
  fetchData: fetchData,
  isEmpty: isEmpty,
  isObjectEmpty: isObjectEmpty,
}
