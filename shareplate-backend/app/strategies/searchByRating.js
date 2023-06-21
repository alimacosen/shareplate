class SearchByRating {
    search = async (model, condition) => {
        var shop = await model.searchByRating(condition);
        return shop;
    };
}
export default SearchByRating;
