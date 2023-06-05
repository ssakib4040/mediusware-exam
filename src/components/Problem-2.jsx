import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";

import { Dialog } from "@reach/dialog";
import "@reach/dialog/styles.css";

const Problem2 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state;

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
  const [isEven, setIsEven] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMoreLists, setLoadingMoreLists] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredContacts, setFilteredContacts] = useState([]);

  useEffect(() => {
    fetchList();
  }, []);

  const filteredList = () => {
    return isEven ? lists.filter((list) => list.id % 2 === 0) : lists;
  };

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

  const submitSearch = async (e) => {
    e.preventDefault();

    clearTimeout(delayTimeoutRef.current);

    const formData = new FormData(e.target);
    const search = formData.get("search");

    if (search.length) {
      setLoading(true);

      setPage(1);
      const newData = await axios.get(
        `https://contact.mediusware.com/api/contacts/?search=${search}&page=1&page_size=10`
      );

      setLists(newData.data?.results);

      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const search = e.target.value;
    setSearchTerm(search);

    clearTimeout(delayTimeoutRef.current);

    if (search.length) {
      delayTimeoutRef.current = setTimeout(async () => {
        // Perform the search logic here
        // For example, you can make an API call to fetch filtered contacts
        // and update the filteredContacts state
        setPage(1);

        setLoading(true);
        const newData = await axios.get(
          `https://contact.mediusware.com/api/contacts/?search=${search}&page=1&page_size=10`
        );

        setLists(newData.data?.results);
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
            {filteredList().map((list, index) => {
              return (
                <li
                  onClick={() =>
                    navigate(location.pathname, {
                      state: { backgroundLocation: true },
                    })
                  }
                  key={index}
                >
                  Id: {list.id}, Phone: {list.phone}, Country:{" "}
                  {list.country?.name}
                </li>
              );
            })}

            {filteredList().length === 0 && <li>No data found</li>}

            {loadingMore && "Loading more....."}
          </ul>
        )}
      </div>

      <hr />

      <div style={{ display: "flex" }}>
        <div className="flex-fill d-flex align-items-center">
          <input
            type="checkbox"
            id="vehicle1"
            name="vehicle1"
            value={isEven}
            onChange={(e) => setIsEven(e.target.checked)}
          />
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

  const scrollableDivRef = useRef(null);
  const formSearchRef = useRef(null);
  const delayTimeoutRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [page, setPage] = useState(1);
  const [lists, setLists] = useState([]);
  const [isEven, setIsEven] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMoreLists, setLoadingMoreLists] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredContacts, setFilteredContacts] = useState([]);

  useEffect(() => {
    fetchList();
  }, []);

  const filteredList = () => {
    return isEven ? lists.filter((list) => list.id % 2 === 0) : lists;
  };

  const fetchList = async () => {
    if (page > 1) {
      setLoadingMore(true);
    }

    // https://contact.mediusware.com/api/country-contacts/united%20states/

    try {
      const data = await axios.get(
        `https://contact.mediusware.com/api/country-contacts/united%20states/?page=${page}&page_size=10`
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

  const submitSearch = async (e) => {
    e.preventDefault();

    clearTimeout(delayTimeoutRef.current);

    const formData = new FormData(e.target);
    const search = formData.get("search");

    if (search.length) {
      setLoading(true);

      setPage(1);
      const newData = await axios.get(
        `https://contact.mediusware.com/api/country-contacts/united%20states/?search=${search}&page=1&page_size=10`
      );

      setLists(newData.data?.results);

      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const search = e.target.value;
    setSearchTerm(search);

    clearTimeout(delayTimeoutRef.current);

    if (search.length) {
      delayTimeoutRef.current = setTimeout(async () => {
        // Perform the search logic here
        // For example, you can make an API call to fetch filtered contacts
        // and update the filteredContacts state
        setPage(1);

        setLoading(true);
        const newData = await axios.get(
          `https://contact.mediusware.com/api/country-contacts/united%20states/?search=${search}&page=1&page_size=10`
        );

        setLists(newData.data?.results);
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

    if (isBottom) {
      console.log("Reached the bottom of the scrollable div");

      fetchList();
    }
  };

  return (
    <Dialog>
      <h2>Model B</h2>
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
            {filteredList().map((list, index) => {
              return (
                <li
                  onClick={() =>
                    navigate(location.pathname, {
                      state: { backgroundLocation: true },
                    })
                  }
                  key={index}
                >
                  Id: {list.id}, Phone: {list.phone}, Country:{" "}
                  {list.country?.name}
                </li>
              );
            })}

            {filteredList().length === 0 && <li>No data found</li>}

            {loadingMore && "Loading more....."}
          </ul>
        )}
      </div>

      <hr />

      <div style={{ display: "flex" }}>
        <div className="flex-fill d-flex align-items-center">
          <input
            type="checkbox"
            id="vehicle1"
            name="vehicle1"
            value={isEven}
            onChange={(e) => setIsEven(e.target.checked)}
          />
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
