document.addEventListener('DOMContentLoaded', function () {
    const tableBody = document.getElementById('tableBody');
    const modalContent = document.getElementById('modalContent'); // Get modal content div
    const mealModal = document.getElementById('mealModal');

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
            if (!Array.isArray(data.meals)) {  // Correctly checks for 'meals'
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

                // Clear previous content
                modalContent.innerHTML = '';

                // Display meals in the modal (using a loop)
                const mealsList = document.createElement('ul');
                data.meals.forEach(meal => {
                    const listItem = document.createElement('li');

                    const mealTitle = document.createElement('h3'); // Use h3 for meal titles
                    mealTitle.textContent = meal.strMeal || "Meal Name Not Available";
                    listItem.appendChild(mealTitle);

                    const mealImage = document.createElement('img');
                    mealImage.src = meal.strMealThumb || "";  // Provide empty string as fallback
                    mealImage.alt = meal.strMeal || "Meal Image";
                    mealImage.onerror = () => { mealImage.src = 'placeholder.jpg'; }; // Handle image errors
                    listItem.appendChild(mealImage);

                    // No description available in the provided JSON structure
                    // You could add a placeholder, or fetch more details if needed.
                    // const mealDescription = document.createElement('p');
                    // mealDescription.textContent =  "No description available";
                    // listItem.appendChild(mealDescription);


                    mealsList.appendChild(listItem);
                });
                modalContent.appendChild(mealsList);

                // Show the modal
                mealModal.style.display = 'block';
            })
            .catch(error => {
                console.error(`Error fetching meals for ${areaName}:`, error);
                modalContent.innerHTML = `<p>Error: ${error.message}</p>`; // Display error in modal
                mealModal.style.display = 'block';
            });
    });

    function closeModal() {
        ingredientModal.style.display = 'none';
    }

     document.querySelector('.close').addEventListener('click', closeModal);


    window.addEventListener('click', function (event) {
        if (event.target === ingredientModal) {
            closeModal();
        }
    });
});