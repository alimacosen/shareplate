class SearchByName {
    search = async (model, condition) => {
        var shop = await model.searchByName(condition);
        return shop;
    };
}
export default SearchByName;
