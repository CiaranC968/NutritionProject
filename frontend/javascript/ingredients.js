document.addEventListener('DOMContentLoaded', function () {
    const tableBody = document.getElementById('tableBody');
    const modalContent = document.getElementById('modalContent');
    const ingredientModal = document.getElementById('ingredientModal');

    // Fetch initial list of ingredients
    fetch('http://127.0.0.1:8000/ingredients/')
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(`HTTP error! Status: ${response.status}, Message: ${text}`);
                });
            }
            return response.json();
        })
        .then(data => {
            if (!Array.isArray(data.meals)) {
                throw new Error('Invalid data format: "meals" property is missing or not an array.');
            }

            data.meals.forEach(ingredient => {
                const row = tableBody.insertRow();
                row.setAttribute('data-ingredient', ingredient.strIngredient);

                const ingredientCell = row.insertCell();
                ingredientCell.textContent = ingredient.strIngredient;
            });
        })
        .catch(error => {
            console.error('Error fetching or processing data:', error);
            const errorRow = tableBody.insertRow();
            const errorCell = errorRow.insertCell();
            errorCell.colSpan = 1;
            errorCell.textContent = "Error loading ingredients: " + error.message;
            errorCell.style.textAlign = "center";
        });

    // Event delegation for modal
    tableBody.addEventListener('click', function (event) {
        const clickedRow = event.target.closest('tr');
        if (!clickedRow) return;

        const ingredientName = clickedRow.getAttribute('data-ingredient');
        if (!ingredientName) {
            console.error("Ingredient name is undefined.");
            return;
        }
        console.log(ingredientName);

        fetch(`http://127.0.0.1:8000/ingredients/${encodeURIComponent(ingredientName)}`)
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error(`HTTP error! Status: ${response.status}, Message: ${text}`);
                    });
                }
                return response.json();
            })
            .then(data => {
                if (!data || !data.meals || data.meals.length === 0) {
                    throw new Error("Invalid or empty ingredient data.");
                }

                // Clear previous content
                modalContent.innerHTML = '';

                const ingredient = data.meals[0];

                const ingredientInfo = document.createElement('div');

                const title = document.createElement('h2');
                title.textContent = ingredient.strIngredient || "Ingredient Name Not Available";
                ingredientInfo.appendChild(title);

                if (ingredient.strDescription) {
                  const description = document.createElement('p');
                  description.textContent = ingredient.strDescription;
                  ingredientInfo.appendChild(description);
                } else {
                  const noDescription = document.createElement('p');
                  noDescription.textContent = "No description available.";
                  ingredientInfo.appendChild(noDescription);
                }

                modalContent.appendChild(ingredientInfo);

                //Display related meals
                const mealsList = document.createElement('ul');
                data.meals.forEach(meal => {
                  const listItem = document.createElement('li');
                  const link = document.createElement('a');
                  link.href = "#"; // Add a placeholder link
                  link.textContent = meal.strMeal;
                  link.addEventListener('click', (event) => {
                      event.preventDefault();
                      alert(`You clicked on ${meal.strMeal}`); // Replace with proper navigation if needed
                  });
                  listItem.appendChild(link);
                  mealsList.appendChild(listItem);
                });

                const mealsTitle = document.createElement('h3');
                mealsTitle.textContent = "Related Meals:";
                modalContent.appendChild(mealsTitle);
                modalContent.appendChild(mealsList);

                ingredientModal.style.display = 'block';
            })
            .catch(error => {
                console.error(`Error fetching details for ${ingredientName}:`, error);
                if (modalContent === null) {
                    console.error("modalContent is null! Check your HTML and getElementById.");
                } else {
                    modalContent.innerHTML = `<p>Error: ${error.message}</p>`;
                }
                ingredientModal.style.display = 'block';
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