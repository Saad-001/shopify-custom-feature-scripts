(async () => {
  const shop = window.Shopify?.shop;
  if (!shop) return;

  try {
    const res = await fetch(
      `https://shopify-stores-license-server.vercel.app/api/verify?shop=${shop}`
    );
    const data = await res.json();

    if (!data.valid) {
      console.warn("Unlicensed store. Feature disabled.");
      return;
    }

    initCustomFeature();
  } catch (err) {
    console.error("License check failed:", err);
    return;
  }
})();

function initCustomFeature() {
  document.addEventListener("DOMContentLoaded", function () {
    const infiniteScrollDiv = document.querySelector(
      ".onscroll-product-reveal--trigger"
    );
    const loadingSpinner =
      infiniteScrollDiv?.querySelector(".loading__spinner");
    const productGrid = document.getElementById("product-grid");
    const totalPages = infiniteScrollDiv?.dataset.totalPages;
    const collectionHandle = infiniteScrollDiv?.dataset.collectionHandle;
    let currentPage = 1;

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          currentPage++;
          if (currentPage <= totalPages) {
            infiniteScrollDiv.classList.remove("hide-visibility");
            loadingSpinner.classList.remove("hidden");

            const xhr = new XMLHttpRequest();
            xhr.open(
              "GET",
              `/collections/${collectionHandle}?page=` + currentPage,
              true
            );
            xhr.onload = function () {
              if (xhr.status >= 200 && xhr.status < 400) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(
                  xhr.responseText,
                  "text/html"
                );
                const newProducts = doc.querySelectorAll(
                  "#product-grid .grid__item"
                );

                newProducts.forEach(function (product) {
                  productGrid.appendChild(product);
                });

                if (currentPage >= totalPages) {
                  infiniteScrollDiv.classList.add("hide-visibility");
                  observer.unobserve(infiniteScrollDiv);
                }
              }
            };
            xhr.send();
          }
        }
      });
    });
    observer.observe(infiniteScrollDiv);
  });
}
