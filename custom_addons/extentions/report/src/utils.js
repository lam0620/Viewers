var html2text = function (html) {
  var div = document.createElement('div');
  div.innerHTML = html;
  var text = div.innerText;
  div.remove();
  return text;
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
  isEmpty: isEmpty,
  isObjectEmpty: isObjectEmpty,
}
