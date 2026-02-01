function Click(){
    alert("Online!");
}


const form = document.querySelector("#myForm");
const input = document.querySelector(".input");

form.addEventListener("submit", e => {
  e.preventDefault(); // stop page reload
  console.log(input.value);
});


