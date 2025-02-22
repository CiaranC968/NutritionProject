document.addEventListener('DOMContentLoaded', function () {
    const tableBody = document.getElementById('tableBody');

    // Fetch initial list of areas
    fetch('http://127.0.0.1:8000/areas/')
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(`HTTP error! Status: ${response.status}, Message: ${text}`);
                });
            }
            return response.json();
        })
        .then(data => {
            if (!Array.isArray(data.meals)) {  // Corrected to check `meals`
                throw new Error('Invalid data format: "meals" property is missing or not an array.');
            }

            data.meals.forEach(area => {
                const row = tableBody.insertRow();
                row.setAttribute('data-area', area.strArea); // Data attribute for area name

                const areaCell = row.insertCell();
                areaCell.textContent = area.strArea;
            });
        })
        .catch(error => {
            console.error('Error fetching or processing data:', error);
            const errorRow = tableBody.insertRow();
            const errorCell = errorRow.insertCell();
            errorCell.colSpan = 1;
            errorCell.textContent = "Error loading areas: " + error.message;
            errorCell.style.textAlign = "center";
        });

    // Event delegation for modal
    tableBody.addEventListener('click', function (event) {
        const clickedRow = event.target.closest('tr');
        if (!clickedRow) return;

        const areaName = clickedRow.getAttribute('data-area');
        if (!areaName) {
            console.error("Area name is undefined. Cannot fetch meals.");
            return;
        }

        // Fetch meals for the clicked area
        fetch(`http://127.0.0.1:8000/areas/${encodeURIComponent(areaName)}`)
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error(`HTTP error! Status: ${response.status}, Message: ${text}`);
                    });
                }
                return response.json();
            })
            .then(data => {
                if (!Array.isArray(data.meals) || data.meals.length === 0) {
                    throw new Error("Invalid or empty meal data.");
                }

                const modalTitle = document.getElementById('modalTitle');
                const modalImage = document.getElementById('modalImage');
                const modalDescription = document.getElementById('modalDescription');

                // Display the first meal in the modal
                const meal = data.meals[0];
                modalTitle.textContent = meal.strMeal || "Meal Name Not Available";
                modalImage.src = meal.strMealThumb || "";
                modalImage.alt = meal.strMeal || "Meal Image";
                modalDescription.textContent = meal.strMealDescription || "No description available";

                // Show the modal
                document.getElementById('mealModal').style.display = 'block';
            })
            .catch(error => {
                console.error(`Error fetching meals for ${areaName}:`, error);
                document.getElementById('modalTitle').textContent = "Error loading meals";
                document.getElementById('mealModal').style.display = 'block';
            });
    });

    // Function to close the modal
    function closeModal() {
        document.getElementById('mealModal').style.display = 'none';
    }

    // Close modal when the close button is clicked
    document.querySelector('.close').addEventListener('click', closeModal);

    // Close modal when clicking outside the modal content
    window.addEventListener('click', function (event) {
        const modal = document.getElementById('mealModal');
        if (event.target === modal) {
            closeModal();
        }
    });
});
