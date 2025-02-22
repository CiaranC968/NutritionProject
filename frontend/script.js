document.addEventListener('DOMContentLoaded', function() {
    const tableBody = document.getElementById('tableBody');

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
                errorCell.colSpan = 4;
                errorCell.textContent = "Error: Invalid data format.";
                return;
            }

            data.categories.forEach(category => {
                const row = tableBody.insertRow();
                // Add data attributes for the modal
                row.setAttribute('data-title', category.strCategory);
                row.setAttribute('data-image', category.strCategoryThumb);
                row.setAttribute('data-description', category.strCategoryDescription);


                const idCell = row.insertCell();
                idCell.textContent = category.idCategory;

                const nameCell = row.insertCell();
                nameCell.textContent = category.strCategory;

                const thumbCell = row.insertCell();
                const img = document.createElement('img');
                img.src = category.strCategoryThumb;
                img.alt = category.strCategory;
                img.onerror = () => {
                    img.src = 'placeholder.jpg';
                };
                thumbCell.appendChild(img);

                const descCell = row.insertCell();
                descCell.textContent = category.strCategoryDescription || "No description available";

                tableBody.appendChild(row);
            });
        })
      .catch(error => {
            console.error('Error fetching or processing data:', error);
            const errorRow = tableBody.insertRow();
            const errorCell = errorRow.insertCell();
            errorCell.colSpan = 4;
            errorCell.textContent = "Error loading meal categories: " + error.message;
            errorCell.style.textAlign = "center";
        });

    // Event delegation: Attach a single event listener to the tbody
    tableBody.addEventListener('click', function(event) {
        // Check if the clicked element is a table row
        const clickedRow = event.target.closest('tr');
        if (clickedRow) {
            // Retrieve data attributes from the clicked row
            const title = clickedRow.getAttribute('data-title');
            const imageSrc = clickedRow.getAttribute('data-image');
            const description = clickedRow.getAttribute('data-description');

            // Populate modal content
            document.getElementById('modalTitle').textContent = title;
            const modalImage = document.getElementById('modalImage');
            modalImage.src = imageSrc;
            modalImage.alt = title;
            document.getElementById('modalDescription').textContent = description;

            // Display the modal
            const modal = document.getElementById('mealModal');
            modal.style.display = 'block';
        }
    });

    // Close modal when the close button is clicked
    document.querySelector('.close').addEventListener('click', function() {
        const modal = document.getElementById('mealModal');
        modal.style.display = 'none';
    });

    // Close modal when clicking outside the modal content
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('mealModal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});