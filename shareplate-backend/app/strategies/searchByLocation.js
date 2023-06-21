class SearchByLocation {
    search = async (model, condition) => {
        var shop = await model.searchByLocation(condition);
        return shop;
    };
}
export default SearchByLocation;
