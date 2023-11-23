// Variables
let currentLanguage = "en";
let data;
let currenProduct = 0;
let currentPage = 1;
let originalPrice;
let originalDescription;
let originalTitle;
const productsPerPage = 10;
const baseUrl = "https://dummyjson.com/products";

// i18n Objects
const i18n = {
  en: {
    productTable: "Product Table",
    filter: "Filter",
    id: "Id",
    title: "Title",
    description: "Description",
    price: "Price",
    thumbnail: "Thumbnail",
    rating: "Rating",
    stock: "Stock",
    brand: "Brand",
    images: "Images",
    actions: "Actions",
    discountPercentage: "Discount %",
    previous: "Previous",
    next: "Next",
  },
  es: {
    productTable: "Tabla de productos",
    filter: "Filtrar",
    id: "Id",
    title: "Título",
    description: "Descripción",
    price: "Precio",
    thumbnail: "Miniatura",
    rating: "Valoración",
    stock: "Existencias",
    brand: "Marca",
    images: "Imágenes",
    actions: "Acciones",
    discountPercentage: "Descuento %",
    previous: "Anterior",
    next: "Siguiente",
  },
};

const i18nActions = {
  en: {
    showImages: "Show Images",
    update: "Update",
    delete: "Delete",
    cancel: "Cancel",
  },
  es: {
    showImages: "Mostrar Imágenes",
    update: "Actualizar",
    delete: "Eliminar",
    cancel: "Cancelar",
  },
};

const i18nPlaceholders = {
  en: {
    titleFilter: "Enter a title",
    descriptionFilter: "Enter a description",
    minPrice: "Min Price",
    maxPrice: "Max Price",
  },
  es: {
    titleFilter: "Ingresa un título",
    descriptionFilter: "Ingresa una descripción",
    minPrice: "Precio mínimo",
    maxPrice: "Precio máximo",
  },
};

// DOM Elements
const imageGallery = document.getElementById("imageGallery");
const galleryContent = document.getElementById("galleryContent");
const languageSelector = document.createElement("select");
const header = document.querySelector("header");

// Functions
function fetchData(limit = productsPerPage, skip = 0) {
  const url = `${baseUrl}?limit=${limit}&skip=${skip}`;

  fetch(url)
    .then(handleResponse)
    .then((responseData) => {
      data = responseData;
      populateTable();
    })
    .catch(handleError);
}

function handleResponse(response) {
  if (!response.ok) {
    throw new Error(`Network response was not ok: ${response.statusText}`);
  }
  return response.json();
}

function handleError(error) {
  console.error("Error:", error);
}

function populateTable() {
  const tableBody = document.querySelector("#productTable tbody");
  tableBody.innerHTML = "";

  if (!data.products || data.products.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="11">No data found</td></tr>`;

    return;
  }

  data.products.forEach((product) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.title}</td>
            <td>${product.description}</td>
            <td>${product.price}</td>
            <td class="not-essential">${product.discountPercentage || ""}%</td>
            <td>${product.rating}</td>
            <td class="not-essential">${product.stock || ""}</td>
            <td class="not-essential">${product.brand || ""}</td>
            <td class="thumbnail"><img src="${product.thumbnail}"  alt="${
      product.title
    } Thumbnail"></td>
            <td class="not-essential">
            <button class="btn-show-images" onclick="showImageGallery(${data.products.indexOf(
              product
            )})">${i18nActions[currentLanguage].showImages}</button>
            </td>
            <td>
                <button onclick="openEditModal(${data.products.indexOf(
                  product
                )})" class="actions__btn-update">${
      i18nActions[currentLanguage].update
    }</button>
                <button  class="actions__btn-delete btn-warning"onclick="deleteProduct(${data.products.indexOf(
                  product
                )})">${i18nActions[currentLanguage].delete}</button>
            </td>
        `;
    tableBody.appendChild(row);
  });
}

function updatePagination() {
  const initialPage = 1;
  const lastPage = 10;
  document.getElementById("currentPage").innerText = currentPage;
  const prevButton = document.getElementById("prevButton");
  const nextButton = document.getElementById("nextButton");

  prevButton.disabled = currentPage === initialPage;
  nextButton.disabled = currentPage === lastPage;

  prevButton.classList.toggle("disabled", prevButton.disabled);
  nextButton.classList.toggle("disabled", nextButton.disabled);
}

function nextPage() {
  currentPage++;
  fetchData(productsPerPage, (currentPage - 1) * productsPerPage);
  updatePagination();
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    fetchData(productsPerPage, (currentPage - 1) * productsPerPage);
    updatePagination();
  }
}

let currentImageIndex = 0;

function showImageGallery(index) {
  product = data.products[index];
  galleryContent.innerHTML = "";
  currentImageIndex = 0;
  displayCurrentImage();
  updateGalleryButtons();
  imageGallery.style.display = "flex";
}

function updateGalleryButtons() {
  const prevButton = document.getElementById("prevImageButton");
  const nextButton = document.getElementById("nextImageButton");

  prevButton.disabled = currentImageIndex === 0;

  const totalImages = product.images.length;
  nextButton.disabled = currentImageIndex === totalImages - 1;
}

function changeImage(direction) {
  const totalImages = product.images.length;

  if (direction === "next" && currentImageIndex < totalImages - 1) {
    currentImageIndex++;
    updateGalleryButtons();
  } else if (direction === "prev" && currentImageIndex > 0) {
    currentImageIndex--;
    updateGalleryButtons();
  }
  displayCurrentImage(product);
}

function displayCurrentImage() {
  const imageUrl = product.images[currentImageIndex];
  const imgElement = document.createElement("img");
  imgElement.src = imageUrl;
  galleryContent.innerHTML = "";
  galleryContent.appendChild(imgElement);
}

function openEditModal(index) {
  product = data.products[index];
  originalTitle = product.title;
  originalPrice = product.price;
  originalDescription = product.description;

  document.getElementById("editTitle").value = originalTitle;
  document.getElementById("editPrice").value = originalPrice;
  document.getElementById("editDescription").value = originalDescription;

  const editModal = document.getElementById("editModal");
  editModal.style.display = "block";

  // Disable the "Update" button initially
  document.getElementById("updateButton").disabled = true;
}

function inputChange() {
  const updatedTitle = document.getElementById("editTitle").value;
  const updatedPrice = document.getElementById("editPrice").value;
  const updatedDescription = document.getElementById("editDescription").value;

  // Enable the "Update" button only if there are changes
  const isChanged =
    updatedTitle !== originalTitle ||
    updatedPrice !== originalPrice ||
    updatedDescription !== originalDescription;

  document.getElementById("updateButton").disabled = !isChanged;
}

function closeEditModal() {
  const editModal = document.getElementById("editModal");
  const editTitleInput = document.getElementById("editTitle");
  const editPriceInput = document.getElementById("editPrice");
  const editDescriptionTextarea = document.getElementById("editDescription");

  editTitleInput.value = "";
  editPriceInput.value = "";
  editDescriptionTextarea.value = "";

  editModal.style.display = "none";
}

function saveChanges() {
  const editedTitle = document.getElementById("editTitle").value;
  const editedPrice = document.getElementById("editPrice").value;
  const editedDescription = document.getElementById("editDescription").value;

  // Updates product locally
  data.products[currenProduct].title = editedTitle;
  data.products[currenProduct].price = editedPrice;
  data.products[currenProduct].description = editedDescription;

  closeEditModal();

  populateTable();
}

// Add the oninput event listeners to the input fields
document.getElementById("editTitle").addEventListener("input", inputChange);
document.getElementById("editPrice").addEventListener("input", inputChange);
document
  .getElementById("editDescription")
  .addEventListener("input", inputChange);

function deleteProduct(index) {
  product = data.products[index];

  fetch(`${baseUrl}/${product.id}`, {
    method: "DELETE",
  })
    .then(handleResponse)
    .then(() => {
      if (currentLanguage === "en") {
        alert("Product deleted successfully.");
      } else {
        alert("Producto eliminado correctamente.");
      }

      if (product.stock > 0) {
        product.stock--;

        if (product.stock === 0) {
          data.products = data.products.filter((p) => p.id !== product.id);
          alert("Product deleted!");
        }

        populateTable();
      }
    })
    .catch((error) => {
      console.error("Error simulating product deletion:", error);
    });
}

function sortTable(columnIndex) {
  if (!data || !data.products || data.products.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="11">No data found</td></tr>`;

    return;
  }
  let fieldToSort;
  switch (columnIndex) {
    case 1:
      fieldToSort = "title";
      break;
    case 3:
      fieldToSort = "price";
      break;
    default:
      console.error("Invalid column index for sorting.");
      return;
  }

  const currentOrder = data.sortOrder || "asc";
  const newOrder = currentOrder === "asc" ? "desc" : "asc";
  data.sortOrder = newOrder;

  data.products.sort((a, b) => {
    let comparison;

    if (fieldToSort === "price") {
      const priceA = parseFloat(a[fieldToSort]);
      const priceB = parseFloat(b[fieldToSort]);
      comparison = priceA - priceB;
    } else {
      comparison = a[fieldToSort].localeCompare(b[fieldToSort]);
    }

    return currentOrder === "asc" ? comparison : -comparison;
  });

  populateTable();

  updatePagination();
}

function filterTable() {
  const titleFilter = document
    .getElementById("titleFilter")
    .value.toLowerCase();
  const descriptionFilter = document
    .getElementById("descriptionFilter")
    .value.toLowerCase();
  const minPrice = parseFloat(document.getElementById("minPrice").value) || 0;
  const maxPrice =
    parseFloat(document.getElementById("maxPrice").value) || Infinity;

  fetch(`${baseUrl}/search?q=${titleFilter}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      return response.json();
    })
    .then((filteredData) => {
      const filteredProducts = filteredData.products.filter(
        (product) =>
          product.title.toLowerCase().includes(titleFilter) &&
          product.description.toLowerCase().includes(descriptionFilter) &&
          product.price >= minPrice &&
          product.price <= maxPrice
      );

      data = { products: filteredProducts };

      document.getElementById("titleFilter").value = "";
      document.getElementById("descriptionFilter").value = "";
      document.getElementById("minPrice").value = "";
      document.getElementById("maxPrice").value = "";

      populateTable();
    })
    .catch((error) => {
      console.error("Error fetching filtered data:", error);
    });
}

function updateUI() {
  const tableCaption = document.querySelector(".table__caption");
  tableCaption.textContent = i18n[currentLanguage].productTable;

  const elements = document.querySelectorAll("[data-i18n]");
  elements.forEach((element) => {
    const key = element.getAttribute("data-i18n");
    if (
      element.tagName === "INPUT" &&
      (element.type === "text" || element.type === "number")
    ) {
      element.placeholder = i18nPlaceholders[currentLanguage][key];
    } else if (element.tagName === "BUTTON") {
      element.innerText = i18n[currentLanguage][key];
    } else {
      element.textContent = i18n[currentLanguage][key];
    }
  });

  const modalUpdateButton = document.querySelector("#updateButton");
  const cancelButton = document.querySelector("#cancelButton");
  const updateButtons = document.querySelectorAll(".actions__btn-update");
  const deleteButtons = document.querySelectorAll(".actions__btn-delete");
  const showImagesButtons = document.querySelectorAll(".btn-show-images");

  modalUpdateButton.innerText = i18nActions[currentLanguage].update;
  cancelButton.innerText = i18nActions[currentLanguage].cancel;
  updateButtons.forEach(
    (updateButton) =>
      (updateButton.innerText = i18nActions[currentLanguage].update)
  );
  deleteButtons.forEach(
    (deleteButton) =>
      (deleteButton.innerText = i18nActions[currentLanguage].delete)
  );
  showImagesButtons.forEach(
    (imageButton) =>
      (imageButton.innerText = i18nActions[currentLanguage].showImages)
  );

  document.getElementById("titleFilter").placeholder =
    i18nPlaceholders[currentLanguage].titleFilter;
  document.getElementById("descriptionFilter").placeholder =
    i18nPlaceholders[currentLanguage].descriptionFilter;
  document.getElementById("minPrice").placeholder =
    i18nPlaceholders[currentLanguage].minPrice;
  document.getElementById("maxPrice").placeholder =
    i18nPlaceholders[currentLanguage].maxPrice;
}

function setLanguage(language) {
  currentLanguage = language;
  updateUI();
}

// Event Listeners
document.getElementById("closeGallery").addEventListener("click", () => {
  imageGallery.style.display = "none";
});

window.addEventListener("click", (event) => {
  if (event.target === imageGallery) {
    imageGallery.style.display = "none";
  }
});

languageSelector.id = "languageSelector";
languageSelector.innerHTML = `
    <option value="en">English</option>
    <option value="es">Español</option>
`;
languageSelector.addEventListener("change", (event) => {
  setLanguage(event.target.value);
});

header.appendChild(languageSelector);

// Initialization
fetchData();
updatePagination();
