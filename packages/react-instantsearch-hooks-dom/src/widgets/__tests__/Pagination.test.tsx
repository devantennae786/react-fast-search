import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import {
  createMultiSearchResponse,
  createSearchClient,
  createSingleSearchResponse,
} from '../../../../../test/mock';
import { InstantSearchHooksTestWrapper, wait } from '../../../../../test/utils';
import { Pagination } from '../Pagination';

describe('Pagination', () => {
  test('renders with default props', async () => {
    const { container } = render(
      <InstantSearchHooksTestWrapper>
        <Pagination />
      </InstantSearchHooksTestWrapper>
    );

    await wait(0);

    expect(container).toMatchInlineSnapshot(`
      <div>
        <div
          class="ais-Pagination ais-Pagination--noRefinement"
        >
          <ul
            class="ais-Pagination-list"
          >
            <li
              class="ais-Pagination-item ais-Pagination-item--disabled ais-Pagination-item--firstPage"
            >
              <span
                aria-label="First"
                class="ais-Pagination-link"
              >
                ‹‹
              </span>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--disabled ais-Pagination-item--previousPage"
            >
              <span
                aria-label="Previous"
                class="ais-Pagination-link"
              >
                ‹
              </span>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--page ais-Pagination-item--selected"
            >
              <a
                aria-label="1"
                class="ais-Pagination-link"
                href="#"
              >
                1
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--disabled ais-Pagination-item--nextPage"
            >
              <span
                aria-label="Next"
                class="ais-Pagination-link"
              >
                ›
              </span>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--disabled ais-Pagination-item--lastPage"
            >
              <span
                aria-label="Last"
                class="ais-Pagination-link"
              >
                ››
              </span>
            </li>
          </ul>
        </div>
      </div>
    `);
  });

  test('renders with items', async () => {
    const client = createSearchClient({
      search: (requests) =>
        Promise.resolve(
          createMultiSearchResponse(
            ...requests.map((request) =>
              createSingleSearchResponse({
                hits: Array.from({ length: 1000 }).map((_, index) => ({
                  objectID: String(index),
                })),
                index: request.indexName,
              })
            )
          )
        ),
    });

    const { container } = render(
      <InstantSearchHooksTestWrapper searchClient={client}>
        <Pagination />
      </InstantSearchHooksTestWrapper>
    );

    await wait(0);

    const pageItems = document.querySelectorAll('.ais-Pagination-item--page');

    expect(pageItems).toHaveLength(7);
    expect(pageItems[0]).toHaveClass('ais-Pagination-item--selected');
    expect(
      document.querySelector('.ais-Pagination-item--firstPage')
    ).toHaveClass('ais-Pagination-item--disabled');
    expect(
      document.querySelector('.ais-Pagination-item--previousPage')
    ).toHaveClass('ais-Pagination-item--disabled');
    expect(
      document.querySelector('.ais-Pagination-item--nextPage')
    ).not.toHaveClass('ais-Pagination-item--disabled');
    expect(
      document.querySelector('.ais-Pagination-item--lastPage')
    ).not.toHaveClass('ais-Pagination-item--disabled');
    expect(container).toMatchInlineSnapshot(`
      <div>
        <div
          class="ais-Pagination"
        >
          <ul
            class="ais-Pagination-list"
          >
            <li
              class="ais-Pagination-item ais-Pagination-item--disabled ais-Pagination-item--firstPage"
            >
              <span
                aria-label="First"
                class="ais-Pagination-link"
              >
                ‹‹
              </span>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--disabled ais-Pagination-item--previousPage"
            >
              <span
                aria-label="Previous"
                class="ais-Pagination-link"
              >
                ‹
              </span>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--page ais-Pagination-item--selected"
            >
              <a
                aria-label="1"
                class="ais-Pagination-link"
                href="#"
              >
                1
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--page"
            >
              <a
                aria-label="2"
                class="ais-Pagination-link"
                href="#"
              >
                2
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--page"
            >
              <a
                aria-label="3"
                class="ais-Pagination-link"
                href="#"
              >
                3
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--page"
            >
              <a
                aria-label="4"
                class="ais-Pagination-link"
                href="#"
              >
                4
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--page"
            >
              <a
                aria-label="5"
                class="ais-Pagination-link"
                href="#"
              >
                5
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--page"
            >
              <a
                aria-label="6"
                class="ais-Pagination-link"
                href="#"
              >
                6
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--page"
            >
              <a
                aria-label="7"
                class="ais-Pagination-link"
                href="#"
              >
                7
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--nextPage"
            >
              <a
                aria-label="Next"
                class="ais-Pagination-link"
                href="#"
              >
                ›
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--lastPage"
            >
              <a
                aria-label="Last"
                class="ais-Pagination-link"
                href="#"
              >
                ››
              </a>
            </li>
          </ul>
        </div>
      </div>
    `);
  });

  test('navigates between pages', async () => {
    const search = jest.fn((requests) =>
      Promise.resolve(
        createMultiSearchResponse(
          ...requests.map((request) =>
            createSingleSearchResponse({
              hits: Array.from({ length: 1000 }).map((_, index) => ({
                objectID: String(index),
              })),
              index: request.indexName,
            })
          )
        )
      )
    );
    const client = createSearchClient({ search });

    const { container, getByText } = render(
      <InstantSearchHooksTestWrapper searchClient={client}>
        <Pagination />
      </InstantSearchHooksTestWrapper>
    );

    await wait(0);

    search.mockClear();

    expect(
      document.querySelector('.ais-Pagination-item--selected')
    ).toHaveTextContent('1');
    expect(container).toMatchInlineSnapshot(`
      <div>
        <div
          class="ais-Pagination"
        >
          <ul
            class="ais-Pagination-list"
          >
            <li
              class="ais-Pagination-item ais-Pagination-item--disabled ais-Pagination-item--firstPage"
            >
              <span
                aria-label="First"
                class="ais-Pagination-link"
              >
                ‹‹
              </span>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--disabled ais-Pagination-item--previousPage"
            >
              <span
                aria-label="Previous"
                class="ais-Pagination-link"
              >
                ‹
              </span>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--page ais-Pagination-item--selected"
            >
              <a
                aria-label="1"
                class="ais-Pagination-link"
                href="#"
              >
                1
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--page"
            >
              <a
                aria-label="2"
                class="ais-Pagination-link"
                href="#"
              >
                2
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--page"
            >
              <a
                aria-label="3"
                class="ais-Pagination-link"
                href="#"
              >
                3
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--page"
            >
              <a
                aria-label="4"
                class="ais-Pagination-link"
                href="#"
              >
                4
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--page"
            >
              <a
                aria-label="5"
                class="ais-Pagination-link"
                href="#"
              >
                5
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--page"
            >
              <a
                aria-label="6"
                class="ais-Pagination-link"
                href="#"
              >
                6
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--page"
            >
              <a
                aria-label="7"
                class="ais-Pagination-link"
                href="#"
              >
                7
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--nextPage"
            >
              <a
                aria-label="Next"
                class="ais-Pagination-link"
                href="#"
              >
                ›
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--lastPage"
            >
              <a
                aria-label="Last"
                class="ais-Pagination-link"
                href="#"
              >
                ››
              </a>
            </li>
          </ul>
        </div>
      </div>
    `);

    const firstPageItem = document.querySelector(
      '.ais-Pagination-item--firstPage'
    );
    const previousPageItem = document.querySelector(
      '.ais-Pagination-item--previousPage'
    );
    const nextPageItem = document.querySelector(
      '.ais-Pagination-item--nextPage'
    );
    const lastPageItem = document.querySelector(
      '.ais-Pagination-item--lastPage'
    );

    // We're on page 1, "First" and "Previous" links are disabled
    expect(firstPageItem).toHaveClass('ais-Pagination-item--disabled');
    expect(previousPageItem).toHaveClass('ais-Pagination-item--disabled');

    userEvent.click(
      firstPageItem!.querySelector('.ais-Pagination-link') as HTMLAnchorElement
    );
    userEvent.click(
      previousPageItem!.querySelector(
        '.ais-Pagination-link'
      ) as HTMLAnchorElement
    );

    await wait(0);

    expect(search).not.toHaveBeenCalled();

    // We navigate to page 2
    userEvent.click(getByText('2'));

    await wait(0);

    expect(search).toHaveBeenLastCalledWith([
      expect.objectContaining({
        params: expect.objectContaining({ page: 1 }),
      }),
    ]);
    expect(
      document.querySelector('.ais-Pagination-item--selected')
    ).toHaveTextContent('2');
    expect(container).toMatchInlineSnapshot(`
      <div>
        <div
          class="ais-Pagination"
        >
          <ul
            class="ais-Pagination-list"
          >
            <li
              class="ais-Pagination-item ais-Pagination-item--firstPage"
            >
              <a
                aria-label="First"
                class="ais-Pagination-link"
                href="#"
              >
                ‹‹
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--previousPage"
            >
              <a
                aria-label="Previous"
                class="ais-Pagination-link"
                href="#"
              >
                ‹
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--page"
            >
              <a
                aria-label="1"
                class="ais-Pagination-link"
                href="#"
              >
                1
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--page ais-Pagination-item--selected"
            >
              <a
                aria-label="2"
                class="ais-Pagination-link"
                href="#"
              >
                2
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--page"
            >
              <a
                aria-label="3"
                class="ais-Pagination-link"
                href="#"
              >
                3
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--page"
            >
              <a
                aria-label="4"
                class="ais-Pagination-link"
                href="#"
              >
                4
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--page"
            >
              <a
                aria-label="5"
                class="ais-Pagination-link"
                href="#"
              >
                5
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--page"
            >
              <a
                aria-label="6"
                class="ais-Pagination-link"
                href="#"
              >
                6
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--page"
            >
              <a
                aria-label="7"
                class="ais-Pagination-link"
                href="#"
              >
                7
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--nextPage"
            >
              <a
                aria-label="Next"
                class="ais-Pagination-link"
                href="#"
              >
                ›
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--lastPage"
            >
              <a
                aria-label="Last"
                class="ais-Pagination-link"
                href="#"
              >
                ››
              </a>
            </li>
          </ul>
        </div>
      </div>
    `);

    // We click on "Next" link
    userEvent.click(getByText('›'));

    await wait(0);

    expect(search).toHaveBeenLastCalledWith([
      expect.objectContaining({
        params: expect.objectContaining({ page: 2 }),
      }),
    ]);
    expect(
      document.querySelector('.ais-Pagination-item--selected')
    ).toHaveTextContent('3');
    expect(container).toMatchInlineSnapshot(`
      <div>
        <div
          class="ais-Pagination"
        >
          <ul
            class="ais-Pagination-list"
          >
            <li
              class="ais-Pagination-item ais-Pagination-item--firstPage"
            >
              <a
                aria-label="First"
                class="ais-Pagination-link"
                href="#"
              >
                ‹‹
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--previousPage"
            >
              <a
                aria-label="Previous"
                class="ais-Pagination-link"
                href="#"
              >
                ‹
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--page"
            >
              <a
                aria-label="1"
                class="ais-Pagination-link"
                href="#"
              >
                1
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--page"
            >
              <a
                aria-label="2"
                class="ais-Pagination-link"
                href="#"
              >
                2
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--page ais-Pagination-item--selected"
            >
              <a
                aria-label="3"
                class="ais-Pagination-link"
                href="#"
              >
                3
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--page"
            >
              <a
                aria-label="4"
                class="ais-Pagination-link"
                href="#"
              >
                4
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--page"
            >
              <a
                aria-label="5"
                class="ais-Pagination-link"
                href="#"
              >
                5
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--page"
            >
              <a
                aria-label="6"
                class="ais-Pagination-link"
                href="#"
              >
                6
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--page"
            >
              <a
                aria-label="7"
                class="ais-Pagination-link"
                href="#"
              >
                7
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--nextPage"
            >
              <a
                aria-label="Next"
                class="ais-Pagination-link"
                href="#"
              >
                ›
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--lastPage"
            >
              <a
                aria-label="Last"
                class="ais-Pagination-link"
                href="#"
              >
                ››
              </a>
            </li>
          </ul>
        </div>
      </div>
    `);

    // We click on "Last" link
    userEvent.click(getByText('››'));

    await wait(0);

    expect(search).toHaveBeenLastCalledWith([
      expect.objectContaining({
        params: expect.objectContaining({ page: 49 }),
      }),
    ]);
    expect(
      document.querySelector('.ais-Pagination-item--selected')
    ).toHaveTextContent('50');
    expect(container).toMatchInlineSnapshot(`
      <div>
        <div
          class="ais-Pagination"
        >
          <ul
            class="ais-Pagination-list"
          >
            <li
              class="ais-Pagination-item ais-Pagination-item--firstPage"
            >
              <a
                aria-label="First"
                class="ais-Pagination-link"
                href="#"
              >
                ‹‹
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--previousPage"
            >
              <a
                aria-label="Previous"
                class="ais-Pagination-link"
                href="#"
              >
                ‹
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--page"
            >
              <a
                aria-label="44"
                class="ais-Pagination-link"
                href="#"
              >
                44
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--page"
            >
              <a
                aria-label="45"
                class="ais-Pagination-link"
                href="#"
              >
                45
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--page"
            >
              <a
                aria-label="46"
                class="ais-Pagination-link"
                href="#"
              >
                46
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--page"
            >
              <a
                aria-label="47"
                class="ais-Pagination-link"
                href="#"
              >
                47
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--page"
            >
              <a
                aria-label="48"
                class="ais-Pagination-link"
                href="#"
              >
                48
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--page"
            >
              <a
                aria-label="49"
                class="ais-Pagination-link"
                href="#"
              >
                49
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--page ais-Pagination-item--selected"
            >
              <a
                aria-label="50"
                class="ais-Pagination-link"
                href="#"
              >
                50
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--disabled ais-Pagination-item--nextPage"
            >
              <span
                aria-label="Next"
                class="ais-Pagination-link"
              >
                ›
              </span>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--disabled ais-Pagination-item--lastPage"
            >
              <span
                aria-label="Last"
                class="ais-Pagination-link"
              >
                ››
              </span>
            </li>
          </ul>
        </div>
      </div>
    `);

    search.mockClear();

    // We're on last page, "Next" and "Last" links are disabled
    expect(nextPageItem).toHaveClass('ais-Pagination-item--disabled');
    expect(lastPageItem).toHaveClass('ais-Pagination-item--disabled');

    userEvent.click(
      nextPageItem!.querySelector('.ais-Pagination-link') as HTMLAnchorElement
    );
    userEvent.click(
      lastPageItem!.querySelector('.ais-Pagination-link') as HTMLAnchorElement
    );

    await wait(0);

    expect(search).not.toHaveBeenCalled();

    // We click on "Previous" link
    userEvent.click(
      previousPageItem!.querySelector(
        '.ais-Pagination-link'
      ) as HTMLAnchorElement
    );

    await wait(0);

    expect(search).toHaveBeenLastCalledWith([
      expect.objectContaining({
        params: expect.objectContaining({ page: 48 }),
      }),
    ]);
    expect(
      document.querySelector('.ais-Pagination-item--selected')
    ).toHaveTextContent('49');
    expect(container).toMatchInlineSnapshot(`
      <div>
        <div
          class="ais-Pagination"
        >
          <ul
            class="ais-Pagination-list"
          >
            <li
              class="ais-Pagination-item ais-Pagination-item--firstPage"
            >
              <a
                aria-label="First"
                class="ais-Pagination-link"
                href="#"
              >
                ‹‹
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--previousPage"
            >
              <a
                aria-label="Previous"
                class="ais-Pagination-link"
                href="#"
              >
                ‹
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--page"
            >
              <a
                aria-label="44"
                class="ais-Pagination-link"
                href="#"
              >
                44
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--page"
            >
              <a
                aria-label="45"
                class="ais-Pagination-link"
                href="#"
              >
                45
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--page"
            >
              <a
                aria-label="46"
                class="ais-Pagination-link"
                href="#"
              >
                46
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--page"
            >
              <a
                aria-label="47"
                class="ais-Pagination-link"
                href="#"
              >
                47
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--page"
            >
              <a
                aria-label="48"
                class="ais-Pagination-link"
                href="#"
              >
                48
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--page ais-Pagination-item--selected"
            >
              <a
                aria-label="49"
                class="ais-Pagination-link"
                href="#"
              >
                49
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--page"
            >
              <a
                aria-label="50"
                class="ais-Pagination-link"
                href="#"
              >
                50
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--nextPage"
            >
              <a
                aria-label="Next"
                class="ais-Pagination-link"
                href="#"
              >
                ›
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--lastPage"
            >
              <a
                aria-label="Last"
                class="ais-Pagination-link"
                href="#"
              >
                ››
              </a>
            </li>
          </ul>
        </div>
      </div>
    `);

    // We click on "First" link
    userEvent.click(
      firstPageItem!.querySelector('.ais-Pagination-link') as HTMLAnchorElement
    );

    await wait(0);

    expect(search).toHaveBeenLastCalledWith([
      expect.objectContaining({
        params: expect.objectContaining({ page: 0 }),
      }),
    ]);
    expect(
      document.querySelector('.ais-Pagination-item--selected')
    ).toHaveTextContent('1');
    expect(container).toMatchInlineSnapshot(`
      <div>
        <div
          class="ais-Pagination"
        >
          <ul
            class="ais-Pagination-list"
          >
            <li
              class="ais-Pagination-item ais-Pagination-item--disabled ais-Pagination-item--firstPage"
            >
              <span
                aria-label="First"
                class="ais-Pagination-link"
              >
                ‹‹
              </span>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--disabled ais-Pagination-item--previousPage"
            >
              <span
                aria-label="Previous"
                class="ais-Pagination-link"
              >
                ‹
              </span>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--page ais-Pagination-item--selected"
            >
              <a
                aria-label="1"
                class="ais-Pagination-link"
                href="#"
              >
                1
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--page"
            >
              <a
                aria-label="2"
                class="ais-Pagination-link"
                href="#"
              >
                2
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--page"
            >
              <a
                aria-label="3"
                class="ais-Pagination-link"
                href="#"
              >
                3
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--page"
            >
              <a
                aria-label="4"
                class="ais-Pagination-link"
                href="#"
              >
                4
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--page"
            >
              <a
                aria-label="5"
                class="ais-Pagination-link"
                href="#"
              >
                5
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--page"
            >
              <a
                aria-label="6"
                class="ais-Pagination-link"
                href="#"
              >
                6
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--page"
            >
              <a
                aria-label="7"
                class="ais-Pagination-link"
                href="#"
              >
                7
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--nextPage"
            >
              <a
                aria-label="Next"
                class="ais-Pagination-link"
                href="#"
              >
                ›
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--lastPage"
            >
              <a
                aria-label="Last"
                class="ais-Pagination-link"
                href="#"
              >
                ››
              </a>
            </li>
          </ul>
        </div>
      </div>
    `);
  });

  test('does not navigate when pressing a modifier key', async () => {
    const search = jest.fn((requests) =>
      Promise.resolve(
        createMultiSearchResponse(
          ...requests.map((request) =>
            createSingleSearchResponse({
              hits: Array.from({ length: 1000 }).map((_, index) => ({
                objectID: String(index),
              })),
              index: request.indexName,
            })
          )
        )
      )
    );
    const client = createSearchClient({ search });

    const { getByText } = render(
      <InstantSearchHooksTestWrapper searchClient={client}>
        <Pagination />
      </InstantSearchHooksTestWrapper>
    );

    await wait(0);

    search.mockClear();

    const firstPageItem = document.querySelector(
      '.ais-Pagination-item--firstPage'
    );
    const firstPageLink = firstPageItem!.querySelector('.ais-Pagination-link');

    userEvent.click(firstPageLink as HTMLAnchorElement, { button: 1 });
    userEvent.click(firstPageLink as HTMLAnchorElement, { altKey: true });
    userEvent.click(firstPageLink as HTMLAnchorElement, { ctrlKey: true });
    userEvent.click(firstPageLink as HTMLAnchorElement, { metaKey: true });
    userEvent.click(firstPageLink as HTMLAnchorElement, { shiftKey: true });

    const previousPageItem = document.querySelector(
      '.ais-Pagination-item--previousPage'
    );
    const previousPageLink = previousPageItem!.querySelector(
      '.ais-Pagination-link'
    );

    userEvent.click(previousPageLink as HTMLAnchorElement, { button: 1 });
    userEvent.click(previousPageLink as HTMLAnchorElement, { altKey: true });
    userEvent.click(previousPageLink as HTMLAnchorElement, { ctrlKey: true });
    userEvent.click(previousPageLink as HTMLAnchorElement, { metaKey: true });
    userEvent.click(previousPageLink as HTMLAnchorElement, { shiftKey: true });

    const nextPageItem = document.querySelector(
      '.ais-Pagination-item--nextPage'
    );
    const nextPageLink = nextPageItem!.querySelector('.ais-Pagination-link');

    userEvent.click(nextPageLink as HTMLAnchorElement, { button: 1 });
    userEvent.click(nextPageLink as HTMLAnchorElement, { altKey: true });
    userEvent.click(nextPageLink as HTMLAnchorElement, { ctrlKey: true });
    userEvent.click(nextPageLink as HTMLAnchorElement, { metaKey: true });
    userEvent.click(nextPageLink as HTMLAnchorElement, { shiftKey: true });

    const lastPageItem = document.querySelector(
      '.ais-Pagination-item--lastPage'
    );
    const lastPageLink = lastPageItem!.querySelector('.ais-Pagination-link');

    userEvent.click(lastPageLink as HTMLAnchorElement, { button: 1 });
    userEvent.click(lastPageLink as HTMLAnchorElement, { altKey: true });
    userEvent.click(lastPageLink as HTMLAnchorElement, { ctrlKey: true });
    userEvent.click(lastPageLink as HTMLAnchorElement, { metaKey: true });
    userEvent.click(lastPageLink as HTMLAnchorElement, { shiftKey: true });

    const pageOneLink = getByText('1');

    userEvent.click(pageOneLink as HTMLAnchorElement, { button: 1 });
    userEvent.click(pageOneLink as HTMLAnchorElement, { altKey: true });
    userEvent.click(pageOneLink as HTMLAnchorElement, { ctrlKey: true });
    userEvent.click(pageOneLink as HTMLAnchorElement, { metaKey: true });
    userEvent.click(pageOneLink as HTMLAnchorElement, { shiftKey: true });

    expect(search).not.toHaveBeenCalled();
  });

  test('adds items around the current one', async () => {
    const search = jest.fn((requests) =>
      Promise.resolve(
        createMultiSearchResponse(
          ...requests.map((request) =>
            createSingleSearchResponse({
              hits: Array.from({ length: 1000 }).map((_, index) => ({
                objectID: String(index),
              })),
              index: request.indexName,
            })
          )
        )
      )
    );
    const client = createSearchClient({ search });

    const { container } = render(
      <InstantSearchHooksTestWrapper searchClient={client}>
        <Pagination padding={4} />
      </InstantSearchHooksTestWrapper>
    );

    await wait(0);

    expect(
      document.querySelectorAll('.ais-Pagination-item--page')
    ).toHaveLength(9);
    expect(container).toMatchInlineSnapshot(`
      <div>
        <div
          class="ais-Pagination"
        >
          <ul
            class="ais-Pagination-list"
          >
            <li
              class="ais-Pagination-item ais-Pagination-item--disabled ais-Pagination-item--firstPage"
            >
              <span
                aria-label="First"
                class="ais-Pagination-link"
              >
                ‹‹
              </span>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--disabled ais-Pagination-item--previousPage"
            >
              <span
                aria-label="Previous"
                class="ais-Pagination-link"
              >
                ‹
              </span>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--page ais-Pagination-item--selected"
            >
              <a
                aria-label="1"
                class="ais-Pagination-link"
                href="#"
              >
                1
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--page"
            >
              <a
                aria-label="2"
                class="ais-Pagination-link"
                href="#"
              >
                2
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--page"
            >
              <a
                aria-label="3"
                class="ais-Pagination-link"
                href="#"
              >
                3
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--page"
            >
              <a
                aria-label="4"
                class="ais-Pagination-link"
                href="#"
              >
                4
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--page"
            >
              <a
                aria-label="5"
                class="ais-Pagination-link"
                href="#"
              >
                5
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--page"
            >
              <a
                aria-label="6"
                class="ais-Pagination-link"
                href="#"
              >
                6
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--page"
            >
              <a
                aria-label="7"
                class="ais-Pagination-link"
                href="#"
              >
                7
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--page"
            >
              <a
                aria-label="8"
                class="ais-Pagination-link"
                href="#"
              >
                8
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--page"
            >
              <a
                aria-label="9"
                class="ais-Pagination-link"
                href="#"
              >
                9
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--nextPage"
            >
              <a
                aria-label="Next"
                class="ais-Pagination-link"
                href="#"
              >
                ›
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--lastPage"
            >
              <a
                aria-label="Last"
                class="ais-Pagination-link"
                href="#"
              >
                ››
              </a>
            </li>
          </ul>
        </div>
      </div>
    `);
  });

  test('does not add items around the current one when there are not enough pages', async () => {
    const search = jest.fn((requests) =>
      Promise.resolve(
        createMultiSearchResponse(
          ...requests.map((request) =>
            createSingleSearchResponse({
              hits: Array.from({ length: 120 }).map((_, index) => ({
                objectID: String(index),
              })),
              index: request.indexName,
            })
          )
        )
      )
    );
    const client = createSearchClient({ search });

    const { container } = render(
      <InstantSearchHooksTestWrapper searchClient={client}>
        <Pagination padding={4} />
      </InstantSearchHooksTestWrapper>
    );

    await wait(0);

    expect(
      document.querySelectorAll('.ais-Pagination-item--page')
    ).toHaveLength(6);
    expect(container).toMatchInlineSnapshot(`
      <div>
        <div
          class="ais-Pagination"
        >
          <ul
            class="ais-Pagination-list"
          >
            <li
              class="ais-Pagination-item ais-Pagination-item--disabled ais-Pagination-item--firstPage"
            >
              <span
                aria-label="First"
                class="ais-Pagination-link"
              >
                ‹‹
              </span>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--disabled ais-Pagination-item--previousPage"
            >
              <span
                aria-label="Previous"
                class="ais-Pagination-link"
              >
                ‹
              </span>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--page ais-Pagination-item--selected"
            >
              <a
                aria-label="1"
                class="ais-Pagination-link"
                href="#"
              >
                1
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--page"
            >
              <a
                aria-label="2"
                class="ais-Pagination-link"
                href="#"
              >
                2
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--page"
            >
              <a
                aria-label="3"
                class="ais-Pagination-link"
                href="#"
              >
                3
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--page"
            >
              <a
                aria-label="4"
                class="ais-Pagination-link"
                href="#"
              >
                4
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--page"
            >
              <a
                aria-label="5"
                class="ais-Pagination-link"
                href="#"
              >
                5
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--page"
            >
              <a
                aria-label="6"
                class="ais-Pagination-link"
                href="#"
              >
                6
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--nextPage"
            >
              <a
                aria-label="Next"
                class="ais-Pagination-link"
                href="#"
              >
                ›
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--lastPage"
            >
              <a
                aria-label="Last"
                class="ais-Pagination-link"
                href="#"
              >
                ››
              </a>
            </li>
          </ul>
        </div>
      </div>
    `);
  });

  test('limits the total pages to display', async () => {
    const search = jest.fn((requests) =>
      Promise.resolve(
        createMultiSearchResponse(
          ...requests.map((request) =>
            createSingleSearchResponse({
              hits: Array.from({ length: 1000 }).map((_, index) => ({
                objectID: String(index),
              })),
              index: request.indexName,
            })
          )
        )
      )
    );
    const client = createSearchClient({ search });

    const { container } = render(
      <InstantSearchHooksTestWrapper searchClient={client}>
        <Pagination totalPages={4} />
      </InstantSearchHooksTestWrapper>
    );

    await wait(0);

    expect(
      document.querySelectorAll('.ais-Pagination-item--page')
    ).toHaveLength(4);
    expect(container).toMatchInlineSnapshot(`
      <div>
        <div
          class="ais-Pagination"
        >
          <ul
            class="ais-Pagination-list"
          >
            <li
              class="ais-Pagination-item ais-Pagination-item--disabled ais-Pagination-item--firstPage"
            >
              <span
                aria-label="First"
                class="ais-Pagination-link"
              >
                ‹‹
              </span>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--disabled ais-Pagination-item--previousPage"
            >
              <span
                aria-label="Previous"
                class="ais-Pagination-link"
              >
                ‹
              </span>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--page ais-Pagination-item--selected"
            >
              <a
                aria-label="1"
                class="ais-Pagination-link"
                href="#"
              >
                1
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--page"
            >
              <a
                aria-label="2"
                class="ais-Pagination-link"
                href="#"
              >
                2
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--page"
            >
              <a
                aria-label="3"
                class="ais-Pagination-link"
                href="#"
              >
                3
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--page"
            >
              <a
                aria-label="4"
                class="ais-Pagination-link"
                href="#"
              >
                4
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--nextPage"
            >
              <a
                aria-label="Next"
                class="ais-Pagination-link"
                href="#"
              >
                ›
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--lastPage"
            >
              <a
                aria-label="Last"
                class="ais-Pagination-link"
                href="#"
              >
                ››
              </a>
            </li>
          </ul>
        </div>
      </div>
    `);
  });

  test('hides the "First" item when `showFirst` is `false`', async () => {
    const { container } = render(
      <InstantSearchHooksTestWrapper>
        <Pagination showFirst={false} />
      </InstantSearchHooksTestWrapper>
    );

    await wait(0);

    expect(
      document.querySelector('.ais-Pagination-item--firstPage')
    ).toBeNull();
    expect(container).toMatchInlineSnapshot(`
      <div>
        <div
          class="ais-Pagination ais-Pagination--noRefinement"
        >
          <ul
            class="ais-Pagination-list"
          >
            <li
              class="ais-Pagination-item ais-Pagination-item--disabled ais-Pagination-item--previousPage"
            >
              <span
                aria-label="Previous"
                class="ais-Pagination-link"
              >
                ‹
              </span>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--page ais-Pagination-item--selected"
            >
              <a
                aria-label="1"
                class="ais-Pagination-link"
                href="#"
              >
                1
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--disabled ais-Pagination-item--nextPage"
            >
              <span
                aria-label="Next"
                class="ais-Pagination-link"
              >
                ›
              </span>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--disabled ais-Pagination-item--lastPage"
            >
              <span
                aria-label="Last"
                class="ais-Pagination-link"
              >
                ››
              </span>
            </li>
          </ul>
        </div>
      </div>
    `);
  });

  test('hides the "Previous" item when `showPrevious` is `false`', async () => {
    const { container } = render(
      <InstantSearchHooksTestWrapper>
        <Pagination showPrevious={false} />
      </InstantSearchHooksTestWrapper>
    );

    await wait(0);

    expect(
      document.querySelector('.ais-Pagination-item--previousPage')
    ).toBeNull();
    expect(container).toMatchInlineSnapshot(`
      <div>
        <div
          class="ais-Pagination ais-Pagination--noRefinement"
        >
          <ul
            class="ais-Pagination-list"
          >
            <li
              class="ais-Pagination-item ais-Pagination-item--disabled ais-Pagination-item--firstPage"
            >
              <span
                aria-label="First"
                class="ais-Pagination-link"
              >
                ‹‹
              </span>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--page ais-Pagination-item--selected"
            >
              <a
                aria-label="1"
                class="ais-Pagination-link"
                href="#"
              >
                1
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--disabled ais-Pagination-item--nextPage"
            >
              <span
                aria-label="Next"
                class="ais-Pagination-link"
              >
                ›
              </span>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--disabled ais-Pagination-item--lastPage"
            >
              <span
                aria-label="Last"
                class="ais-Pagination-link"
              >
                ››
              </span>
            </li>
          </ul>
        </div>
      </div>
    `);
  });

  test('hides the "Next" item when `showNext` is `false`', async () => {
    const { container } = render(
      <InstantSearchHooksTestWrapper>
        <Pagination showNext={false} />
      </InstantSearchHooksTestWrapper>
    );

    await wait(0);

    expect(document.querySelector('.ais-Pagination-item--nextPage')).toBeNull();
    expect(container).toMatchInlineSnapshot(`
      <div>
        <div
          class="ais-Pagination ais-Pagination--noRefinement"
        >
          <ul
            class="ais-Pagination-list"
          >
            <li
              class="ais-Pagination-item ais-Pagination-item--disabled ais-Pagination-item--firstPage"
            >
              <span
                aria-label="First"
                class="ais-Pagination-link"
              >
                ‹‹
              </span>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--disabled ais-Pagination-item--previousPage"
            >
              <span
                aria-label="Previous"
                class="ais-Pagination-link"
              >
                ‹
              </span>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--page ais-Pagination-item--selected"
            >
              <a
                aria-label="1"
                class="ais-Pagination-link"
                href="#"
              >
                1
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--disabled ais-Pagination-item--lastPage"
            >
              <span
                aria-label="Last"
                class="ais-Pagination-link"
              >
                ››
              </span>
            </li>
          </ul>
        </div>
      </div>
    `);
  });

  test('hides the "Last" item when `showLast` is `false`', async () => {
    const { container } = render(
      <InstantSearchHooksTestWrapper>
        <Pagination showLast={false} />
      </InstantSearchHooksTestWrapper>
    );

    await wait(0);

    expect(document.querySelector('.ais-Pagination-item--lastPage')).toBeNull();
    expect(container).toMatchInlineSnapshot(`
      <div>
        <div
          class="ais-Pagination ais-Pagination--noRefinement"
        >
          <ul
            class="ais-Pagination-list"
          >
            <li
              class="ais-Pagination-item ais-Pagination-item--disabled ais-Pagination-item--firstPage"
            >
              <span
                aria-label="First"
                class="ais-Pagination-link"
              >
                ‹‹
              </span>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--disabled ais-Pagination-item--previousPage"
            >
              <span
                aria-label="Previous"
                class="ais-Pagination-link"
              >
                ‹
              </span>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--page ais-Pagination-item--selected"
            >
              <a
                aria-label="1"
                class="ais-Pagination-link"
                href="#"
              >
                1
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--disabled ais-Pagination-item--nextPage"
            >
              <span
                aria-label="Next"
                class="ais-Pagination-link"
              >
                ›
              </span>
            </li>
          </ul>
        </div>
      </div>
    `);
  });

  test('forwards `div` props to the root element', async () => {
    const { container } = render(
      <InstantSearchHooksTestWrapper>
        <Pagination className="MyPagination" title="Some custom title" />
      </InstantSearchHooksTestWrapper>
    );

    await wait(0);

    const root = document.querySelector('.ais-Pagination');

    expect(root).toHaveClass('MyPagination');
    expect(root).toHaveAttribute('title', 'Some custom title');
    expect(container).toMatchInlineSnapshot(`
      <div>
        <div
          class="ais-Pagination ais-Pagination--noRefinement MyPagination"
          title="Some custom title"
        >
          <ul
            class="ais-Pagination-list"
          >
            <li
              class="ais-Pagination-item ais-Pagination-item--disabled ais-Pagination-item--firstPage"
            >
              <span
                aria-label="First"
                class="ais-Pagination-link"
              >
                ‹‹
              </span>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--disabled ais-Pagination-item--previousPage"
            >
              <span
                aria-label="Previous"
                class="ais-Pagination-link"
              >
                ‹
              </span>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--page ais-Pagination-item--selected"
            >
              <a
                aria-label="1"
                class="ais-Pagination-link"
                href="#"
              >
                1
              </a>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--disabled ais-Pagination-item--nextPage"
            >
              <span
                aria-label="Next"
                class="ais-Pagination-link"
              >
                ›
              </span>
            </li>
            <li
              class="ais-Pagination-item ais-Pagination-item--disabled ais-Pagination-item--lastPage"
            >
              <span
                aria-label="Last"
                class="ais-Pagination-link"
              >
                ››
              </span>
            </li>
          </ul>
        </div>
      </div>
    `);
  });
});
