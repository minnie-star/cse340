document.addEventListener("DOMContentLoaded", () => {
const pswBtn = document.getElementById("pswBtn");
const pword = document.getElementById("password");

if (pswBtn && pword) {
  pswBtn.addEventListener("click", () => {
    const isHidden = pword.type === "password";
    pword.type = isHidden ? "text" : "password";
    pswBtn.textContent = isHidden ? "Hide Password" : "Show Password";
  });
}
});
