/** @format */
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import "./App.css";
import InfiniteScroll from "react-infinite-scroll-component";

function App() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageno, setPageno] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const inputRef = useRef();

  const getData = async (page = 1, query = "trending") => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.unsplash.com/search/photos?client_id=ZdaAXwqh9UDYeHYZHs_3tO9CyndCJtRuSX02x6wAtr4&query=${query}&page=${page}`
      );
      if (response.data.results.length === 0) {
        setHasMore(false);
      } else {
        setPhotos((prevPhotos) => [...prevPhotos, ...response.data.results]);
        console.log(response.data.results);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
      setHasMore(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const fetchMoreData = () => {
    const nextPage = pageno + 1;
    setPageno(nextPage);
    const query = inputRef.current.value || "trending";
    getData(nextPage, query);
  };

  const handleSearch = () => {
    setPhotos([]);
    setPageno(1);
    setHasMore(true);
    getData(1, inputRef.current.value);
  };

  return (
    <div className='container min-w-full bg-yellow-100'>
      <nav className='flex py-4 px-6 w-full bg-gray-200 justify-between items-center'>
        <h2 className='font-medium text-2xl text-green-700'>GeekGallery</h2>
        <div className='flex gap-3 items-center'>
          <input
            placeholder='Search for Pictures.....'
            type='text'
            className='rounded border border-green-500 px-3 py-1 font-medium text-center'
            ref={inputRef}
          />
          <button
            className='rounded border border-green-500 px-3 py-1 font-medium text-green-500 hover:bg-yellow-100'
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </nav>
      <div className='py-8 pb-14'>
        {loading && pageno === 1 ? (
          <h1>Loading...</h1>
        ) : (
          <InfiniteScroll
            dataLength={photos.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={<h4>Loading more photos...</h4>}
            endMessage={
              <p className='text-center'>
                <b>You have seen it all</b>
              </p>
            }
          >
            <div className='flex flex-wrap items-center justify-around gap-4 '>
              {photos.map((photo, index) => (
                <div
                  className='border-2 border-gray-900 rounded w-fit relative overflow-clip'
                  key={index}
                >
                  <a
                    href={photo.links.download}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <img
                      src={photo.urls.small}
                      alt={photo.alt_description}
                      className=''
                    />
                  </a>
                  <div className='absolute top-4 left-6 font-medium text-white '>
                    <p>{photo.user.name ? photo.user.name : ""}</p>
                    <p>{photo.description ? photo.description : ""}</p>
                    <p>{photo.created_at ? photo.created_at : ""} </p>
                  </div>
                </div>
              ))}
            </div>
          </InfiniteScroll>
        )}
      </div>
      <footer className='fixed w-full bg-gray-600 bottom-0 py-2 pl-14'>
        <h2 className='text-white text-2xl '>
          Developed By-{" "}
          <a
            href='https://github.com/anurag090697'
            className='hover:text-green-400'
          >
            Anurag Shukla
          </a>
        </h2>
      </footer>
    </div>
  );
}

export default App;
