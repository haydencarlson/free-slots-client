const socket = io("http://localhost:3000");

const round = (num) => Number(num).toFixed(8);

socket.on("balance", (balance) => {
  const balanceSpan = document.getElementById("balance");

  if (balanceSpan.innerText === "- - -") {
    return (balanceSpan.innerText = round(balance));
  }
  setTimeout(() => {
    balanceSpan.innerText = round(balance);
  }, 2500);
});

socket.on("disconnect", () => {
  const balanceSpan = document.getElementById("balance");
  balanceSpan.innerText = "- - -";
});
