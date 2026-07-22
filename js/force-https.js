(function () {
  try {
    var host = location.hostname;
    if (location.protocol === "http:" && (host === "dalucare.com.br" || host === "www.dalucare.com.br")) {
      location.replace("https://" + host + location.pathname + location.search + location.hash);
    }
  } catch (e) {}
})();
