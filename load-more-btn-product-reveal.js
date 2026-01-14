document.addEventListener("DOMContentLoaded", function () {
  const loadMoreButtonWrapper = document.querySelector(
    ".load-more-btn-wrapper"
  );
  const loadMoreButton = loadMoreButtonWrapper?.querySelector("#load-more_btn");
  const loadingSpinner =
    loadMoreButtonWrapper?.querySelector(".loading__spinner");
  const productGrid = document.getElementById("product-grid");
  const totalPages = loadMoreButtonWrapper?.dataset.totalPages;
  const collectionHandle = loadMoreButtonWrapper?.dataset.collectionHandle;
  let currentPage = 1;

  if (loadMoreButton) {
    loadMoreButton.addEventListener("click", function () {
      currentPage++;

      if (currentPage <= totalPages) {
        loadMoreButton.style.visibility = "hidden";
        loadingSpinner.classList.remove("hidden");

        const xhr = new XMLHttpRequest();
        xhr.open(
          "GET",
          `/collections/${collectionHandle}?page=` + currentPage,
          true
        );
        xhr.onload = function () {
          if (xhr.status >= 200 && xhr.status < 400) {
            loadingSpinner.classList.add("hidden");
            loadMoreButton.style.visibility = "visible";

            const parser = new DOMParser();
            const doc = parser.parseFromString(xhr.responseText, "text/html");
            const newProducts = doc.querySelectorAll(
              "#product-grid .grid__item"
            );

            newProducts.forEach(function (product) {
              productGrid.appendChild(product);
            });

            if (currentPage >= totalPages) {
              loadMoreButtonWrapper.style.display = "none";
            }
          }
        };
        xhr.send();
      }
    });
  }
});
