function Click(){
    alert("Online!");
}


const form = document.querySelector("#myForm");
const input = document.querySelector(".input");

form.addEventListener("submit", e => {
  e.preventDefault(); // stop page reload
  console.log(input.value);
});


window.nums = [1,2,3,4,5,6];
window.bool = true;

