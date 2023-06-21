class SearchByCategory {
    search = async (model, condition) => {
        var shop = await model.searchByCategory(condition);
        return shop;
    };
}

export default SearchByCategory;
