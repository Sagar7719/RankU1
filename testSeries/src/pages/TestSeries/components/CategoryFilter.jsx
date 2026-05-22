import React from "react";

const CategoryFilter = ({
  categories,
  filter,
  setFilter,
}) => {
  return (
    <div className="categoryRow">

      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setFilter(cat)}
          className={filter === cat ? "activeCat" : ""}
        >
          {cat}
        </button>
      ))}

    </div>
  );
};

export default CategoryFilter;