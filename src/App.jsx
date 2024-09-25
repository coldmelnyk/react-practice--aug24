/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import cn from 'classnames';

import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';
// import products from './api/products';

// const products = productsFromServer.map((product) => {
//   const category = null; // find by product.categoryId
//   const user = null; // find by category.ownerId

//   return null;
// });

const findCategoryById = product =>
  categoriesFromServer.find(category => category.id === product.categoryId);

const findUserById = product =>
  usersFromServer.find(user => user.id === findCategoryById(product).ownerId);

const getPreparedProducts = productsFromServer.map(product => {
  return {
    ...product,
    category: findCategoryById(product),
    user: findUserById(product),
  };
});

const FILTER_ALL = 'all';
const FILTER_ROMA = 'Roma';
const FILTER_ANNA = 'Anna';
const FILTER_MAX = 'Max';
const FILTER_JOHN = 'John';

function sortingAndFiltering(array, filter, query) {
  let arrayCopy = [...array];

  if (filter === FILTER_ROMA) {
    arrayCopy = arrayCopy.filter(element => element.user.name === FILTER_ROMA);
  }

  if (filter === FILTER_ANNA) {
    arrayCopy = arrayCopy.filter(element => element.user.name === FILTER_ANNA);
  }

  if (filter === FILTER_MAX) {
    arrayCopy = arrayCopy.filter(element => element.user.name === FILTER_MAX);
  }

  if (filter === FILTER_JOHN) {
    arrayCopy = arrayCopy.filter(element => element.user.name === FILTER_JOHN);
  }

  if (filter === FILTER_ALL) {
    arrayCopy = [...array];
  }

  if (query) {
    arrayCopy = arrayCopy.filter(
      element =>
        element.name.toLowerCase().trim().includes(query.toLowerCase().trim()),
      // eslint-disable-next-line function-paren-newline
      // linter doing something strange here with coma so IDK...
    );
  }

  return arrayCopy;
}

export function App() {
  const [filterByName, setFilterByName] = useState(FILTER_ALL);
  const [searchingByProductName, setSearchingByPorductName] = useState('');

  const handleResetButton = () => {
    setFilterByName(FILTER_ALL);
    setSearchingByPorductName('');
  };

  const visibleProducts = sortingAndFiltering(
    getPreparedProducts,
    filterByName,
    searchingByProductName,
  );

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                onClick={() => setFilterByName(FILTER_ALL)}
                className={cn({ 'is-active': filterByName === FILTER_ALL })}
                data-cy="FilterAllUsers"
                href="#/"
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  onClick={() => setFilterByName(user.name)}
                  data-cy="FilterUser"
                  href="#/"
                  className={cn({ 'is-active': filterByName === user.name })}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={searchingByProductName}
                  onChange={input =>
                    setSearchingByPorductName(input.target.value)
                  }
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {searchingByProductName && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      onClick={() => setSearchingByPorductName('')}
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <a
                  key={category.id}
                  data-cy="Category"
                  className="button mr-2 my-1 is-info"
                  href="#/"
                >
                  {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                onClick={handleResetButton}
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {visibleProducts.length > 0 ? (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-down" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-up" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {visibleProducts.map(product => (
                  <tr key={product.id} data-cy="Product">
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>

                    <td data-cy="ProductName">{product.name}</td>
                    <td data-cy="ProductCategory">{`${product.category.icon} - ${product.category.title}`}</td>

                    <td
                      data-cy="ProductUser"
                      className={cn({
                        'has-text-link': product.user.sex === 'm',
                        'has-text-danger': product.user.sex === 'f',
                      })}
                    >
                      {product.user.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
