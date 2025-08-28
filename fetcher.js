fetch("Partials/headerfile.html")
  .then(res => {
    if (!res.ok) throw new Error("HTTP error " + res.status);
    return res.text();
  })
  .then(data => {
    document.getElementById("main-header").innerHTML = data;
  })
  .catch(error => {
    console.error("Error loading header:", error);
  });