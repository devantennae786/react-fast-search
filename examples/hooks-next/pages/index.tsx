import Head from 'next/head';
import algoliasearch from 'algoliasearch/lite';
import { Hit as AlgoliaHit } from '@algolia/client-search';
import {
  DynamicWidgets,
  InstantSearch,
  Hits,
  SearchBox,
  InstantSearchServerState,
  InstantSearchSSRProvider,
} from 'react-instantsearch-hooks-dom';
import { getServerState } from 'react-instantsearch-hooks-server';
import { Highlight } from '../components/Highlight';
import { history } from 'instantsearch.js/es/lib/routers/index.js';
import { RefinementList } from '../components/RefinementList';
import { Panel } from '../components/Panel';

const client = algoliasearch('latency', '6be0576ff61c053d5f9a3225e2a90f76');

type HitProps = {
  hit: AlgoliaHit<{
    name: string;
    price: number;
  }>;
};

function Hit({ hit }: HitProps) {
  return (
    <>
      <Highlight hit={hit} attribute="name" className="Hit-label" />
      <span className="Hit-price">${hit.price}</span>
    </>
  );
}

type HomePageProps = {
  serverState?: InstantSearchServerState;
  url?: string;
};

export default function HomePage({ serverState, url }: HomePageProps) {
  return (
    <InstantSearchSSRProvider {...serverState}>
      <Head>
        <title>React InstantSearch - Next.js</title>
      </Head>

      <InstantSearch
        searchClient={client}
        indexName="instant_search"
        routing={{
          router: history({
            getLocation() {
              if (typeof window === 'undefined') {
                return new URL(url!) as unknown as Location;
              }

              return window.location;
            },
          }),
        }}
      >
        <div className="Container">
          <div>
            <DynamicWidgets fallbackComponent={FallbackComponent} />
          </div>
          <div>
            <SearchBox />
            <Hits hitComponent={Hit} />
          </div>
        </div>
      </InstantSearch>
    </InstantSearchSSRProvider>
  );
}

function FallbackComponent({ attribute }: { attribute: string }) {
  return (
    <Panel header={attribute}>
      <RefinementList attribute={attribute} />
    </Panel>
  );
}

export async function getServerSideProps({ req }) {
  const url = new URL(
    req.headers.referer || `https://${req.headers.host}${req.url}`
  ).toString();
  const serverState = await getServerState(<HomePage url={url} />);

  return {
    props: {
      serverState,
      url,
    },
  };
}
