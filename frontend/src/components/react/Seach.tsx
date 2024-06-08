import { useState } from 'react';
import { Highlight, Hits, InstantSearch, SearchBox } from 'react-instantsearch-hooks-web';
import algoliasearch from 'algoliasearch/lite';

function Search() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const searchClient = algoliasearch(
    `${import.meta.env.PUBLIC_ALGOLIA_PROVIDER_APPLICATION_ID}`,
    `${import.meta.env.PUBLIC_ALGOLIA_PROVIDER_ADMIN_API_KEY}`,
  );

  return (
    <>
      <div className="hidden lg:flex gap-16 self-stretch items-center">
        <button
          className="size-32 p8 flex flex-col justify-center items-center gap-8 shrink-0"
          onClick={() => setIsOpen(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
          >
            <path
              d="M21.0361 19.3864L26.033 24.3821L24.3821 26.0329L19.3865 21.0361C17.5277 22.5262 15.2156 23.3366 12.8333 23.3333C7.03731 23.3333 2.33331 18.6293 2.33331 12.8333C2.33331 7.03725 7.03731 2.33325 12.8333 2.33325C18.6293 2.33325 23.3333 7.03725 23.3333 12.8333C23.3367 15.2156 22.5262 17.5276 21.0361 19.3864ZM18.6958 18.5208C20.1764 16.9981 21.0033 14.9571 21 12.8333C21 8.32059 17.3448 4.66659 12.8333 4.66659C8.32065 4.66659 4.66665 8.32059 4.66665 12.8333C4.66665 17.3448 8.32065 20.9999 12.8333 20.9999C14.9571 21.0033 16.9982 20.1764 18.5208 18.6958L18.6958 18.5208Z"
              fill="#596066"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <>
          <div className="w-screen h-screen bg-gray-900 opacity-70 absolute top-0 left-0 "></div>
          <div
            className="w-screen h-screen absolute top-0 left-0 flex items-center justify-center gap-8 flex-col"
            // onClick={() => setIsOpen(false)}
          >
            <InstantSearch
              searchClient={searchClient}
              stalledSearchDelay={500}
              onStateChange={(e) => console.log(e)}
              indexName="production_blog_index"
            >
              <div
                className="max-w-[744px] w-full h-56 p-16 justify-between flex-col flex items-center rounded-md border border-border-sub bg-white"
                onClick={(e) => e.stopPropagation()}
              >
                <SearchBox
                  className="flex justify-stretch items-stretch focus:outline-none"
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                  placeholder="pesquisa"
                />
                <div className="flex gap-8 flex-col rounded-md border border-border-sub bg-white max-w-[744px] w-full justify-stretch p-16">
                  <Hits
                    hitComponent={(props) => (
                      <a
                        key={props.hit.objectID}
                        href={props.hit.url as string}
                        className="border-b border-border-soft flex justify-between items-center p-8 text-text-sub hover:text-text-main gap-16"
                      >
                        <div className="flex gap-4 flex-col">
                          <h4 className="text-md ">
                            <Highlight hit={props.hit} attribute={'title'} />
                          </h4>
                          <p className="text-sm text-text-sub break-all text-ellipsis h-[1.25rem] overflow-hidden w-full">
                            <Highlight hit={props.hit} attribute={'description'} />
                          </p>
                        </div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="32"
                          height="32"
                          viewBox="0 0 32 32"
                          fill="none"
                        >
                          <path
                            d="M6.74658 4.00003H10.2108C10.625 4.00003 10.9608 4.33582 10.9608 4.75003C10.9608 5.12972 10.6786 5.44352 10.3126 5.49318L10.2108 5.50003H6.74658C5.55572 5.50003 4.58094 6.42519 4.50177 7.59598L4.49658 7.75003V17.25C4.49658 18.4409 5.42174 19.4157 6.59253 19.4948L6.74658 19.5H16.2473C17.4382 19.5 18.413 18.5749 18.4921 17.4041L18.4973 17.25V16.7522C18.4973 16.338 18.8331 16.0022 19.2473 16.0022C19.627 16.0022 19.9408 16.2844 19.9905 16.6505L19.9973 16.7522V17.25C19.9973 19.2543 18.425 20.8913 16.4465 20.9948L16.2473 21H6.74658C4.74232 21 3.10531 19.4277 3.00178 17.4492L2.99658 17.25V7.75003C2.99658 5.74577 4.56894 4.10876 6.54742 4.00523L6.74658 4.00003H10.2108H6.74658ZM14.5006 6.51988V3.75003C14.5006 3.12606 15.2074 2.78998 15.6876 3.13983L15.7697 3.20877L21.7643 8.95877C22.0441 9.22712 22.0696 9.65814 21.8407 9.9561L21.7644 10.0412L15.7698 15.7931C15.3196 16.2251 14.5877 15.9477 14.5077 15.3589L14.5006 15.2519V12.5266L14.1571 12.5567C11.7574 12.807 9.45735 13.8879 7.24253 15.8174C6.72342 16.2696 5.92029 15.842 6.00567 15.1589C6.67046 9.83933 9.45233 6.90733 14.2012 6.53953L14.5006 6.51988V3.75003V6.51988ZM16.0006 5.50867V7.25003C16.0006 7.66424 15.6648 8.00003 15.2506 8.00003C11.3772 8.00003 8.97655 9.67616 7.93931 13.1572L7.86025 13.4358L8.21244 13.199C10.4489 11.7372 12.7983 11 15.2506 11C15.6303 11 15.9441 11.2822 15.9937 11.6483L16.0006 11.75V13.4928L20.1618 9.50012L16.0006 5.50867Z"
                            fill="currentColor"
                          ></path>
                        </svg>
                      </a>
                    )}
                  />
                </div>
                {/*  
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
              >
                <path
                  d="M21.0361 19.3864L26.033 24.3821L24.3821 26.0329L19.3865 21.0361C17.5277 22.5262 15.2156 23.3366 12.8333 23.3333C7.03731 23.3333 2.33331 18.6293 2.33331 12.8333C2.33331 7.03725 7.03731 2.33325 12.8333 2.33325C18.6293 2.33325 23.3333 7.03725 23.3333 12.8333C23.3367 15.2156 22.5262 17.5276 21.0361 19.3864ZM18.6958 18.5208C20.1764 16.9981 21.0033 14.9571 21 12.8333C21 8.32059 17.3448 4.66659 12.8333 4.66659C8.32065 4.66659 4.66665 8.32059 4.66665 12.8333C4.66665 17.3448 8.32065 20.9999 12.8333 20.9999C14.9571 21.0033 16.9982 20.1764 18.5208 18.6958L18.6958 18.5208Z"
                  fill="#596066"
                />
              </svg>
            </div>
            <div className="flex gap-8 flex-col rounded-md border border-border-sub bg-white max-w-[744px] w-full justify-stretch p-16">
              {[1, 2, 3].map((el) => (
                <a
                  key={el}
                  href="test"
                  className="border-b border-border-soft flex justify-between items-center p-8 text-text-sub hover:text-text-main gap-16"
                >
                  <div className="flex gap-4 flex-col">
                    <h4 className="text-md ">djdajsdlka</h4>
                    <p className="text-sm text-text-sub break-all text-ellipsis h-[1.25rem] overflow-hidden w-full">
                      dajkdjaskdjaskdjkshdjkas hkhkahdjkakasdhajk
                      dhajkdhdajkshdkjahdjkashdkjsahkjdhasjkdhasjkdhasjkhdaskjdashdkjash dkas
                      hkahdkahdkahkjdaskddajsdlkjsalkdjsaldda sdadja sjd bdas d ad a
                      <s> a sd as d zzz d</s>
                    </p>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                  >
                    <path
                      d="M6.74658 4.00003H10.2108C10.625 4.00003 10.9608 4.33582 10.9608 4.75003C10.9608 5.12972 10.6786 5.44352 10.3126 5.49318L10.2108 5.50003H6.74658C5.55572 5.50003 4.58094 6.42519 4.50177 7.59598L4.49658 7.75003V17.25C4.49658 18.4409 5.42174 19.4157 6.59253 19.4948L6.74658 19.5H16.2473C17.4382 19.5 18.413 18.5749 18.4921 17.4041L18.4973 17.25V16.7522C18.4973 16.338 18.8331 16.0022 19.2473 16.0022C19.627 16.0022 19.9408 16.2844 19.9905 16.6505L19.9973 16.7522V17.25C19.9973 19.2543 18.425 20.8913 16.4465 20.9948L16.2473 21H6.74658C4.74232 21 3.10531 19.4277 3.00178 17.4492L2.99658 17.25V7.75003C2.99658 5.74577 4.56894 4.10876 6.54742 4.00523L6.74658 4.00003H10.2108H6.74658ZM14.5006 6.51988V3.75003C14.5006 3.12606 15.2074 2.78998 15.6876 3.13983L15.7697 3.20877L21.7643 8.95877C22.0441 9.22712 22.0696 9.65814 21.8407 9.9561L21.7644 10.0412L15.7698 15.7931C15.3196 16.2251 14.5877 15.9477 14.5077 15.3589L14.5006 15.2519V12.5266L14.1571 12.5567C11.7574 12.807 9.45735 13.8879 7.24253 15.8174C6.72342 16.2696 5.92029 15.842 6.00567 15.1589C6.67046 9.83933 9.45233 6.90733 14.2012 6.53953L14.5006 6.51988V3.75003V6.51988ZM16.0006 5.50867V7.25003C16.0006 7.66424 15.6648 8.00003 15.2506 8.00003C11.3772 8.00003 8.97655 9.67616 7.93931 13.1572L7.86025 13.4358L8.21244 13.199C10.4489 11.7372 12.7983 11 15.2506 11C15.6303 11 15.9441 11.2822 15.9937 11.6483L16.0006 11.75V13.4928L20.1618 9.50012L16.0006 5.50867Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </a>
              ))}
            </div> */}
              </div>
            </InstantSearch>
          </div>
        </>
      )}
    </>
  );
}

export default Search;
