function filterProducts(products, query) {
    if (!query) {
        return products;
    }
    const lowerCaseQuery = query.toLowerCase();
    return products.filter(product => product.name.toLowerCase().includes(lowerCaseQuery));
}

export { filterProducts };