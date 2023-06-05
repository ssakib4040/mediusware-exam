import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";

import { Dialog } from "@reach/dialog";
import "@reach/dialog/styles.css";

const Problem2 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state;

  console.log(location);

  const [showModelC, setShowModelC] = useState(false);

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <h4 className="text-center text-uppercase mb-5">Problem-2</h4>

        <div className="d-flex justify-content-center gap-3">
          <button
            className="btn btn-lg btn-outline-primary"
            type="button"
            onClick={() => navigate("model-a")}
          >
            All Contacts
          </button>
          <button
            className="btn btn-lg btn-outline-warning"
            type="button"
            onClick={() => navigate("model-b")}
          >
            US Contacts
          </button>
        </div>

        <Routes>
          <Route path="/model-a" element={<ModelA />} />
          <Route path="/model-b" element={<ModelB />} />
        </Routes>

        {state?.backgroundLocation && <ModelC />}
      </div>
    </div>
  );
};

export default Problem2;

function ModelA() {
  const navigate = useNavigate();

  const scrollableDivRef = useRef(null);
  const formSearchRef = useRef(null);
  const delayTimeoutRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [page, setPage] = useState(1);
  const [lists, setLists] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMoreLists, setLoadingMoreLists] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredContacts, setFilteredContacts] = useState([]);

  // console.log(lists);

  useEffect(() => {
    fetchList();
  }, []);

  const filteredList = () => {
    return lists.filter((list) => list.country === "US");
  };

  // console.log(filteredList());

  const fetchList = async () => {
    if (page > 1) {
      setLoadingMore(true);
    }

    try {
      const data = await axios.get(
        `https://contact.mediusware.com/api/contacts/?&page=${page}&page_size=10`
      );

      setLists((prev) => [...prev, ...data.data.results]);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingMore(false);
      setLoading(false);
    }
  };

  const submitSearch = (e) => {
    e.preventDefault();

    clearTimeout(delayTimeoutRef.current);

    const formData = new FormData(e.target);
    const search = formData.get("search");

    if (search.length) {
      setLoading(true);

      setTimeout(() => {
        setLoading(false);
        console.log(search);
      }, 400);
    }
  };

  const handleInputChange = (e) => {
    const search = e.target.value;
    setSearchTerm(search);

    clearTimeout(delayTimeoutRef.current);

    if (search.length) {
      delayTimeoutRef.current = setTimeout(async () => {
        setLoading(true);

        // Perform the search logic here
        // For example, you can make an API call to fetch filtered contacts
        // and update the filteredContacts state
        const newData = await axios.get(
          `https://contact.mediusware.com/api/contacts/?search=${search}&page=1&page_size=2`
        );

        console.log(newData.data.results);

        setLoading(false);
      }, 500);
    } else {
      setFilteredContacts([]);
    }
  };

  const handleScroll = () => {
    const scrollableDiv = scrollableDivRef.current;

    const isBottom =
      Math.abs(
        scrollableDiv.scrollHeight -
          scrollableDiv.scrollTop -
          scrollableDiv.clientHeight
      ) <= 1;

    console.log("isBottom:", isBottom);

    if (isBottom) {
      console.log("Reached the bottom of the scrollable div");

      fetchList();
    }
  };

  return (
    <Dialog>
      <h2>Model A</h2>
      <hr />

      {/* content */}
      <form className="mb-3 d-flex" onSubmit={submitSearch}>
        <input
          type="text"
          name="search"
          className="form-control"
          placeholder="Search"
          ref={formSearchRef}
          onChange={handleInputChange}
        />
        <input type="submit" className="btn btn-primary ms-2" value="Search" />
      </form>

      <div
        style={{ maxHeight: "200px", overflowY: "scroll" }}
        ref={scrollableDivRef}
        onScroll={handleScroll}
      >
        {loading && "Loading....."}

        {!loading && (
          <ul>
            {lists.map((list, index) => {
              return (
                <li
                  onClick={() =>
                    navigate(location.pathname, {
                      state: { backgroundLocation: true },
                    })
                  }
                  key={index}
                >
                  Phone: {list.phone}, Country: {list.country?.name}
                </li>
              );
            })}

            {loadingMore && "Loading more....."}
          </ul>
        )}
      </div>

      <hr />

      <div style={{ display: "flex" }}>
        <div className="flex-fill d-flex align-items-center">
          <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike" />
          <label htmlFor="vehicle1" className="ms-1">
            Only even
          </label>
        </div>
        <button
          onClick={() => navigate("/problem-2/model-a")}
          className="btn btn-primary ms-2"
          style={{
            background: "#46139f",
          }}
        >
          All Contacts
        </button>
        <button
          onClick={() => navigate("/problem-2/model-b")}
          className="btn btn-primary ms-2"
          style={{
            background: "#ff7f50",
          }}
        >
          US Contacts
        </button>
        <button
          onClick={() => navigate("/problem-2")}
          className="btn btn-primary ms-2"
        >
          Cancel
        </button>
      </div>
    </Dialog>
  );
}

function ModelB() {
  const navigate = useNavigate();

  return (
    <Dialog>
      <h2>Model B</h2>
      <hr />

      <p>content</p>

      <hr />

      <div>
        <button
          onClick={() => navigate("/problem-2/model-a")}
          className="btn btn-primary me-2"
          style={{
            background: "#46139f",
          }}
        >
          All Contacts
        </button>
        <button
          onClick={() => navigate("/problem-2/model-b")}
          className="btn btn-primary me-2"
          style={{
            background: "#ff7f50",
          }}
        >
          US Contacts
        </button>
        <button
          onClick={() => navigate("/problem-2")}
          className="btn btn-primary me-2"
        >
          Cancel
        </button>
      </div>
    </Dialog>
  );
}

function ModelC() {
  const navigate = useNavigate();

  const location = useLocation();

  return (
    <Dialog>
      <h2>Model C</h2>
      <hr />

      <p>Some random infos</p>

      <hr />

      <div>
        <button
          onClick={() => navigate("/problem-2/model-a")}
          className="btn btn-primary me-2"
          style={{
            background: "#46139f",
          }}
        >
          All Contacts
        </button>
        <button
          onClick={() => navigate("/problem-2/model-b")}
          className="btn btn-primary me-2"
          style={{
            background: "#ff7f50",
          }}
        >
          US Contacts
        </button>
        <button
          onClick={() =>
            navigate(location.pathname, {
              state: { backgroundLocation: false },
            })
          }
          className="btn btn-primary me-2"
        >
          Cancel
        </button>
      </div>
    </Dialog>
  );
}
