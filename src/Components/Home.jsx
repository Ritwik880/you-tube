import React, { useState, useEffect } from 'react'
import ReactPaginate from "react-paginate";
import { ColorRing } from "react-loader-spinner";

const Home = () => {

    // API KEY
    const apiKey = 'AIzaSyC1wdqIYSlEKlRGo8sn4klAx8Rw9tsI9Cc';

    const limit = 10;

    const [items, setItems] = useState([]);
    const [input, setInput] = useState('');
    const [pageCount, setPageCount] = useState(0);
    const [filteredResults, setFilteredResults] = useState([]);
    const [loading, setLoading] = useState(false);


    //Api URL
    const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&part=snippet&type=video&maxResults=${limit}`;


    // getting the list of you tube videos
    useEffect(() => {
        const getAllVideos = async (uri) => {
            setLoading(true);
            try {
                const res = await fetch(uri);
                const data = await res.json();
                const total = data.pageInfo.totalResults;
                setPageCount(Math.ceil(total / limit));
                setItems(data.items);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        getAllVideos(url);
    }, [limit]);

    // logic for getting search data
    const searchItems = (searchValue) => {
        setInput(searchValue)
        
        if (input !== '') {
            setLoading(true);
            const filteredData = items.filter((item) => {
                return Object.values(item.snippet).join('').toLowerCase().includes(input.toLowerCase())
            })
            setFilteredResults(filteredData);
            setLoading(false);
        }
        else {
            setFilteredResults(items);
            setLoading(false);
        }
    }


    // logic for getting next page videos
    const loadNextVideos = async (currentPage) => {
        try {
            const res = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${apiKey}&part=snippet&type=video&maxResults=${limit}&_page=${currentPage}`);
            const data = await res.json();
            return data.items;
        } catch (error) {
            console.error(error);
        }
    };


    const handlePageClick = async (data) => {
        const currentPage = data.selected + 1;
        const commentsFormServer = await loadNextVideos(currentPage);
        setItems(commentsFormServer);

    };


    return (
        <section className='landing-section'>
            <div className="row container">
                {
                    loading ? (
                        <div className='loader'>
                            <ColorRing
                                visible={true}
                                height="80"
                                width="80"
                                ariaLabel="blocks-loading"
                                wrapperStyle={{}}
                                wrapperClass="blocks-wrapper"
                                colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
                            />
                        </div>
                    ) : (
                        <div>
                            <h1 className='text-center'>List of Videos</h1>
                            <ReactPaginate
                                previousLabel={"previous"}
                                nextLabel={"next"}
                                breakLabel={"..."}
                                pageCount={pageCount}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={3}
                                onPageChange={handlePageClick}
                                containerClassName={"pagination justify-content-center"}
                                pageClassName={"page-item"}
                                pageLinkClassName={"page-link"}
                                previousClassName={"page-item"}
                                previousLinkClassName={"page-link"}
                                nextClassName={"page-item"}
                                nextLinkClassName={"page-link"}
                                breakClassName={"page-item"}
                                breakLinkClassName={"page-link"}
                                activeClassName={"active"}
                            />
                            <div className="input">
                                <input type="text" placeholder="Search.." value={input} onChange={(e) => searchItems(e.target.value)} />
                            </div>
                            <div className="row m-2">
                                {input.length > 1 ? (
                                    filteredResults && filteredResults.map((item, index) => {
                                        const date = item.snippet.publishedAt;
                                        const newDate = new Date(date);
                                        const year = newDate.getUTCFullYear();
                                        const month = (newDate.getUTCMonth() + 1).toString().padStart(2, '0');
                                        const day = newDate.getUTCDate().toString().padStart(2, '0');
                                        const convertedDate = `${year}-${month}-${day}`;
                                        return (
                                            <div key={index} className="col-sm-6 col-md-6 col-lg-4 v my-2">
                                                <div className="card shadow-sm w-100">
                                                    <div className='image'>
                                                        <img src={item.snippet.thumbnails.high.url} alt="image" />
                                                    </div>
                                                    <div className="card-body">
                                                        <h6 className="card-id">Id :{item.id.videoId}  </h6>
                                                        <h5 className="card-heading">Title :{item.snippet.channelTitle}  </h5>
                                                        <h5 className="card-para">Published At :{convertedDate} </h5>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    items && items.map((item, index) => {
                                        const date = item.snippet.publishedAt;
                                        const newDate = new Date(date);
                                        const year = newDate.getUTCFullYear().toString();
                                        const month = (newDate.getUTCMonth() + 1).toString().padStart(2, '0');
                                        const day = newDate.getUTCDate().toString().padStart(2, '0');
                                        const convertedDate = `${year}-${month}-${day}`;
                                        return (
                                            <div key={index} className="col-sm-6 col-md-6 col-lg-4 v my-2">
                                                <div className="card shadow-sm w-100">
                                                    <div className='image'>
                                                        <img src={item.snippet.thumbnails.high.url} alt="image" />
                                                    </div>
                                                    <div className="card-body">
                                                        <h6 className="card-id">Id :{item.id.videoId}  </h6>
                                                        <h5 className="card-heading">Title :{item.snippet.channelTitle}  </h5>
                                                        <h5 className="card-para">Published At :{convertedDate} </h5>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })

                                )}
                            </div>
                        </div>
                    )
                }
            </div>
        </section>
    )
}

export default Home