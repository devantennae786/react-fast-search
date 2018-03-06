import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { has } from 'lodash';

import Link from './Link';

export default class LinkList extends Component {
  static propTypes = {
    cx: PropTypes.func.isRequired,
    createURL: PropTypes.func.isRequired,

    items: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number,
          PropTypes.object,
        ]).isRequired,

        key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

        label: PropTypes.node,

        modifier: PropTypes.string,
        ariaLabel: PropTypes.string,
        disabled: PropTypes.bool,
      })
    ),
    onSelect: PropTypes.func.isRequired,
    canRefine: PropTypes.bool.isRequired,
  };

  render() {
    const { cx, createURL, items, onSelect, canRefine } = this.props;
    return (
      <ul className={cx('list', !canRefine && 'list--noRefinement')}>
        {items.map(item => (
          <li
            key={has(item, 'key') ? item.key : item.value}
            className={cx(
              'item',
              item.selected && !item.disabled && 'item--selected',
              item.disabled && 'item--disabled',
              item.modifier
            )}
          >
            {item.disabled ? (
              <span className={cx('link')}>
                {has(item, 'label') ? item.label : item.value}
              </span>
            ) : (
              <Link
                className={cx('link', item.selected && 'link--selected')}
                aria-label={item.ariaLabel}
                href={createURL(item.value)}
                onClick={() => onSelect(item.value)}
              >
                {has(item, 'label') ? item.label : item.value}
              </Link>
            )}
          </li>
        ))}
      </ul>
    );
  }
}
