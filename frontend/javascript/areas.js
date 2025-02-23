document.addEventListener('DOMContentLoaded', function () {
    const tableBody = document.getElementById('tableBody');
    const modalContent = document.getElementById('modalContent');
    const mealModal = document.getElementById('mealModal');

    // Fetch initial list of areas
    fetch('http://127.0.0.1:8000/areas/')
        .then(response => handleResponse(response)) // Use a helper function
        .then(data => populateAreasTable(data))
        .catch(error => displayError('Error loading areas', error));

    // Event delegation for modal
    tableBody.addEventListener('click', function (event) {
        const clickedRow = event.target.closest('tr');
        if (!clickedRow) return;

        const areaName = clickedRow.getAttribute('data-area');
        if (!areaName) {
            console.error("Area name is undefined. Cannot fetch meals.");
            return;
        }

        fetch(`http://127.0.0.1:8000/areas/${encodeURIComponent(areaName)}`)
            .then(response => handleResponse(response))
            .then(data => displayMealsInModal(data))
            .catch(error => displayError(`Error fetching meals for ${areaName}`, error));
    });

    function handleResponse(response) {
        if (!response.ok) {
            return response.text().then(text => {
                throw new Error(`HTTP error! Status: ${response.status}, Message: ${text}`);
            });
        }
        return response.json();
    }

    function populateAreasTable(data) {
        if (!Array.isArray(data.meals)) {
            throw new Error('Invalid data format: "meals" property is missing or not an array.');
        }

        data.meals.forEach(area => {
            const row = tableBody.insertRow();
            row.setAttribute('data-area', area.strArea);

            const areaCell = row.insertCell();
            areaCell.textContent = area.strArea;
        });
    }

    function displayMealsInModal(data) {
        if (!Array.isArray(data.meals) || data.meals.length === 0) {
            throw new Error("Invalid or empty meal data.");
        }

        modalContent.innerHTML = ''; // Clear previous content

        const mealsList = document.createElement('div'); // Use a div for grid layout
        mealsList.classList.add('modal-images'); // Add the CSS class

        data.meals.forEach(meal => {
            const listItem = document.createElement('div');  // Wrap each meal in a div

            const mealTitle = document.createElement('h3');
            mealTitle.textContent = meal.strMeal || "Meal Name Not Available";
            listItem.appendChild(mealTitle);

            const mealImage = document.createElement('img');
            mealImage.src = meal.strMealThumb || "";
            mealImage.alt = meal.strMeal || "Meal Image";
            mealImage.onerror = () => { mealImage.src = 'placeholder.jpg'; };
            listItem.appendChild(mealImage);

            mealsList.appendChild(listItem);
        });

        modalContent.appendChild(mealsList);
        mealModal.style.display = 'block';
    }


    function displayError(message, error) {
        console.error(message + ':', error);
        modalContent.innerHTML = `<p>Error: ${error.message}</p>`;
        mealModal.style.display = 'block';
    }

    function closeModal() {
        mealModal.style.display = 'none';
    }

    document.querySelector('.close').addEventListener('click', closeModal);

    window.addEventListener('click', function (event) {
        if (event.target === mealModal) {
            closeModal();
        }
    });
});