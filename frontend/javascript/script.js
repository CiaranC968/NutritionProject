document.addEventListener('DOMContentLoaded', function() {
    const tableBody = document.getElementById('tableBody');
    const modalContent = document.getElementById('modalContent'); // Correctly get modalContent
    const mealModal = document.getElementById('mealModal');

    fetch('http://127.0.0.1:8000/meals/')
      .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(`HTTP error! status: ${response.status}, message: ${text}`);
                });
            }
            return response.json();
        })
      .then(data => {
            if (!data.categories ||!Array.isArray(data.categories)) {
                console.error('Invalid data format: "categories" property is missing or not an array.');
                const errorRow = tableBody.insertRow();
                const errorCell = errorRow.insertCell();
                errorCell.colSpan = 3; // Corrected colSpan to 3
                errorCell.textContent = "Error: Invalid data format.";
                return;
            }

            window.mealData = data; // Store fetched data for later use

            data.categories.forEach(category => {
                const row = tableBody.insertRow();
                row.setAttribute('data-category', category.strCategory); // Store category name

                const idCell = row.insertCell();
                idCell.textContent = category.idCategory;

                const nameCell = row.insertCell();
                nameCell.textContent = category.strCategory;

                const thumbCell = row.insertCell();
                const img = document.createElement('img');
                img.src = category.strCategoryThumb;
                img.alt = category.strCategory;
                img.onerror = () => { img.src = 'placeholder.jpg'; }; // Handle image errors
                thumbCell.appendChild(img);
            });
        })
      .catch(error => {
            console.error('Error fetching or processing data:', error);
            const errorRow = tableBody.insertRow();
            const errorCell = errorRow.insertCell();
            errorCell.colSpan = 3; // Corrected colSpan to 3
            errorCell.textContent = "Error loading meal categories: " + error.message;
            errorCell.style.textAlign = "center";
        });

    // Event delegation: Attach a single event listener to the tbody
    tableBody.addEventListener('click', function(event) {
        const clickedRow = event.target.closest('tr');
        if (!clickedRow) return;

        const categoryName = clickedRow.getAttribute('data-category');
        if (!categoryName) {
            console.error("Category name is undefined.");
            return;
        }

        // Find the category data using the stored data
        const categoryData = window.mealData.categories.find(cat => cat.strCategory === categoryName);

        if (!categoryData) {
            console.error("Category data not found for:", categoryName);
            modalContent.innerHTML = `<p>Error: Category data not found.</p>`;
            mealModal.style.display = 'block';
            return;
        }

        // Clear previous content
        modalContent.innerHTML = '';

        // Create modal content dynamically
        const title = document.createElement('h2');
        title.textContent = categoryData.strCategory || "Category Name Not Available";
        modalContent.appendChild(title);

        const image = document.createElement('img');
        image.src = categoryData.strCategoryThumb;
        image.alt = categoryData.strCategory;
        image.onerror = () => { image.src = 'placeholder.jpg'; };
        modalContent.appendChild(image);

        const description = document.createElement('p');
        description.textContent = categoryData.strCategoryDescription || "No description available";
        modalContent.appendChild(description);

        mealModal.style.display = 'block';
    });


    // Close modal function (defined in the main scope)
    function closeModal() {
        mealModal.style.display = 'none';
    }

    // Close modal when the close button is clicked
    document.querySelector('.close').addEventListener('click', closeModal);

    // Close modal when clicking outside the modal content
    window.addEventListener('click', function(event) {
        if (event.target === mealModal) {
            closeModal();
        }
    });
});