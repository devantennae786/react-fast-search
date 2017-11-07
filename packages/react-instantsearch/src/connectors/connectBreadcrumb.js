import PropTypes from 'prop-types';
import createConnector from '../core/createConnector';
import { refineValue, getResults } from '../core/indexUtils';

export const getId = props => props.attributes[0];

const namespace = 'hierarchicalMenu';

function refine(props, searchState, nextRefinement, context) {
  const id = getId(props);
  const nextValue = { [id]: nextRefinement || '' };
  const resetPage = true;
  return refineValue(searchState, nextValue, context, resetPage, namespace);
}

function transformValue(values) {
  return values.reduce((acc, item) => {
    if (item.isRefined) {
      acc.push({
        label: item.name,
        // If dealing with a nested "items", "value" is equal to the previous value concatenated with the current label
        // If dealing with the first level, "value" is equal to the current label
        value: item.path,
      });
      // Create a variable in order to keep the same acc for the recursion, otherwise "reduce" returns a new one
      if (item.data) {
        acc = acc.concat(transformValue(item.data, acc));
      }
    }
    return acc;
  }, []);
}

/**
 * The breadcrumb component is s a type of secondary navigation scheme that
 * reveals the user’s location in a website or web application.
 *
 * @name connectBreadcrumb
 * @requirements To use this widget, your attributes must be formatted in a specific way.
 * If you want for example to have a Breadcrumb of categories, objects in your index
 * should be formatted this way:
 *
 * ```json
 * {
 *   "categories.lvl0": "products",
 *   "categories.lvl1": "products > fruits",
 *   "categories.lvl2": "products > fruits > citrus"
 * }
 * ```
 *
 * It's also possible to provide more than one path for each level:
 *
 * ```json
 * {
 *   "categories.lvl0": ["products", "goods"],
 *   "categories.lvl1": ["products > fruits", "goods > to eat"]
 * }
 * ```
 *
 * All attributes passed to the `attributes` prop must be present in "attributes for faceting"
 * on the Algolia dashboard or configured as `attributesForFaceting` via a set settings call to the Algolia API.
 *
 * @kind connector
 * @propType {string} attributes - List of attributes to use to generate the hierarchy of the menu. See the example for the convention to follow.
 * @propType {string} {React.Element} [separator=' > '] -  Specifies the level separator used in the data.
 * @propType {string} [rootURL=null] - The root element's URL (the originating page).
 * @propType {function} [transformItems] - Function to modify the items being displayed, e.g. for filtering or sorting them. Takes an items as parameter and expects it back in return.
 * @providedPropType {function} refine - a function to toggle a refinement
 * @providedPropType {function} createURL - a function to generate a URL for the corresponding search state
 * @providedPropType {array.<{items: object, count: number, isRefined: boolean, label: string, value: string}>} items - the list of items the Breadcrumb can display.
 */

export default createConnector({
  displayName: 'AlgoliaBreadcrumb',

  propTypes: {
    attributes: (props, propName, componentName) => {
      const isNotString = val => typeof val !== 'string';
      if (
        !Array.isArray(props[propName]) ||
        props[propName].some(isNotString) ||
        props[propName].length < 1
      ) {
        return new Error(
          `Invalid prop ${propName} supplied to ${
            componentName
          }. Expected an Array of Strings`
        );
      }
      return undefined;
    },
    rootURL: PropTypes.string,
    separator: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    transformItems: PropTypes.func,
  },

  defaultProps: {
    rootURL: null,
    separator: ' > ',
  },

  getProvidedProps(props, searchState, searchResults) {
    const id = getId(props);
    const results = getResults(searchResults, this.context);

    const isFacetPresent =
      Boolean(results) && Boolean(results.getFacetByName(id));

    if (!isFacetPresent) {
      return {
        items: [],
        canRefine: false,
      };
    }

    const values = results.getFacetValues(id);

    const items = values.data ? transformValue(values.data) : [];

    const transformedItems = props.transformItems
      ? props.transformItems(items)
      : items;

    return {
      canRefine: transformedItems.length > 0,
      items: transformedItems,
    };
  },

  refine(props, searchState, nextRefinement) {
    return refine(props, searchState, nextRefinement, this.context);
  },
});
