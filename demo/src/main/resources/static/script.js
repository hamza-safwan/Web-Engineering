document.addEventListener('DOMContentLoaded', function() {
    const createForm = document.getElementById('create-product-form');
    const updateForm = document.getElementById('update-product-form');
    const deleteForm = document.getElementById('delete-product-form');
    const productsTable = document.getElementById('products-table').getElementsByTagName('tbody')[0];
    const searchBar = document.getElementById('search-bar');

    let products = [];

    function fetchProducts() {
        fetch('http://localhost:8080/api/products')
            .then(response => response.json())
            .then(data => {
                products = data;
                displayProducts(products);
            });
    }

    function displayProducts(productsToDisplay) {
        productsTable.innerHTML = '';
        productsToDisplay.forEach(product => {
            const row = productsTable.insertRow();
            row.insertCell(0).innerText = product.id;
            row.insertCell(1).innerText = product.name;
            row.insertCell(2).innerText = product.description;
            row.insertCell(3).innerText = product.price;
            const actionsCell = row.insertCell(4);
            actionsCell.className = 'actions';
            actionsCell.innerHTML = `
                <button onclick="editProduct(${product.id})">Edit</button>
            `;
        });
    }

    searchBar.addEventListener('input', () => {
        const searchTerm = searchBar.value.toLowerCase();
        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm)
        );
        displayProducts(filteredProducts);
    });

    createForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(createForm);
        const product = Object.fromEntries(formData.entries());
        product.price = parseFloat(product.price);

        fetch('http://localhost:8080/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        })
        .then(response => response.json())
        .then(data => {
            alert('Product created successfully!');
            fetchProducts();
            createForm.reset();
        })
        .catch(error => {
            alert('Error creating product: ' + error);
        });
    });

    updateForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(updateForm);
        const product = Object.fromEntries(formData.entries());
        product.price = parseFloat(product.price);

        fetch(`http://localhost:8080/api/products/${product.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        })
        .then(response => response.json())
        .then(data => {
            alert('Product updated successfully!');
            fetchProducts();
            updateForm.reset();
        })
        .catch(error => {
            alert('Error updating product: ' + error);
        });
    });

    deleteForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const productId = document.getElementById('delete-id').value;

        fetch(`http://localhost:8080/api/products/${productId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                alert('Product deleted successfully!');
                fetchProducts();
                deleteForm.reset();
            } else {
                alert('Error deleting product');
            }
        })
        .catch(error => {
            alert('Error deleting product: ' + error);
        });
    });

    window.editProduct = function(id) {
        fetch(`http://localhost:8080/api/products/${id}`)
            .then(response => response.json())
            .then(product => {
                document.getElementById('update-id').value = product.id;
                document.getElementById('update-name').value = product.name;
                document.getElementById('update-description').value = product.description;
                document.getElementById('update-price').value = product.price;
            })
            .catch(error => {
                alert('Error fetching product: ' + error);
            });
    }

    window.deleteProduct = function(id) {
        fetch(`http://localhost:8080/api/products/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                alert('Product deleted successfully!');
                fetchProducts();
            } else {
                alert('Error deleting product');
        }
    })
    .catch(error => {
        alert('Error deleting product: ' + error);
    });
}

fetchProducts();
});