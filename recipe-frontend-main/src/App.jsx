import { useEffect, useState } from "react";
import { BASE_URL } from "../config.js";
import { Link } from "react-router-dom";
import "./App.scss";

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchRecipe = async () => {
    setLoading(true);
    const response = await fetch(BASE_URL, {
      cache: "no-store",
      method: "GET",
    }).then((response) => response.json());
    setData(response);
    setLoading(false);
  };
  useEffect(() => {
    fetchRecipe();
  }, []);
  return (
    <div className="App">
      <div className="container">
        <div className="heading">
          <h2>Recipes</h2>
          <Link to="/recipe">Add Recipe</Link>
        </div>
        {loading ? (
          <div>
            <h1>Loading...</h1>
          </div>
        ) : (
          <div className="card-container">
            {loading ? (
              <h1>Loading...</h1>
            ) : data.length ? (
              <>
                {data.map((item) => {
                  return (
                    <Link className="card" to={`recipe/${item._id}`}>
                      <img src={item.image} alt="" />
                      <div className="content">
                        <div className="title">{item.title}</div>
                        <div className="date">{item.date.slice(0, 10)}</div>
                      </div>
                    </Link>
                  );
                })}
              </>
            ) : (
              <h1>No Recipes Found</h1>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
