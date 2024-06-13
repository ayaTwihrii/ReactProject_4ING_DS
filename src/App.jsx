import React, { useEffect, useState } from "react";
import "./styles.css";

const App = () => {
  // State variables
  const [cats, setCats] = useState([]); // Holds array of cat images
  const [loading, setLoading] = useState(true); // Loading state indicator
  const [error, setError] = useState(null); // Error state indicator
  const [breed, setBreed] = useState("beng"); // Selected breed state

  // Fetch cat images when breed changes or on initial load
  useEffect(() => {
    fetchCats();
  }, [breed]);

  // Function to fetch cat images from API
  const fetchCats = () => {
    const apiUrl = `https://api.thecatapi.com/v1/images/search?limit=20&breed_ids=${breed}&api_key=REPLACE_ME`;

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setCats(data); // Update cats state with fetched data
        setLoading(false); // Set loading state to false
      })
      .catch((error) => {
        setError(error); // Set error state if fetch fails
        setLoading(false); // Set loading state to false
      });
  };

  // Handle breed selection change
  const handleBreedChange = (event) => {
    setBreed(event.target.value); // Update breed state based on selected option
  };

  // Function to fetch detailed information about a specific cat
  const fetchCatInfo = async (catId) => {
    const apiUrl = `https://api.thecatapi.com/v1/images/${catId}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data; // Return fetched cat information
    } catch (error) {
      console.error("Error fetching cat info:", error);
      return null; // Return null if fetch fails
    }
  };

  // Handle click on a cat image
  const handleCatClick = async (cat) => {
    const catInfo = await fetchCatInfo(cat.id); // Fetch detailed cat information

    if (catInfo) {
      // Construct alert message with cat details
      let message = `Cat ID: ${catInfo.id}\n`;
      message += `Width: ${catInfo.width}px\n`;
      message += `Height: ${catInfo.height}px\n`;

      const breedInfo =
        catInfo.breeds && catInfo.breeds.length > 0 ? catInfo.breeds[0] : null;

      if (breedInfo) {
        message += `\nBreed Information:\n`;
        message += `Name: ${breedInfo.name}\n`;
        message += `Temperament: ${breedInfo.temperament}\n`;
        message += `Origin: ${breedInfo.origin}\n`;
        message += `Life Span: ${breedInfo.life_span}\n`;
        message += `Wikipedia: ${breedInfo.wikipedia_url}\n`;
      }

      alert(message); // Display alert with cat information
    } else {
      alert(`Unable to fetch cat information for ID: ${cat.id}`);
    }
  };

  // Handle click on download button
  const handleDownloadClick = (cat) => {
    window.open(cat.url, "_blank"); // Open cat image URL in a new window/tab
  };

  // Render loading indicator while fetching data
  if (loading) {
    return <div>Loading...</div>;
  }

  // Render error message if fetch fails
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // Render main application content once data is loaded
  return (
    <div className="container">
      <h1>Cat Images</h1>
      {/* Select dropdown for choosing cat breed */}
      <div className="select-container">
        <select value={breed} onChange={handleBreedChange}>
          <option value="beng">Bengal</option>
          <option value="siam">Siamese</option>
          <option value="pers">Persian</option>
        </select>
      </div>
      {/* Grid layout to display cat images */}
      <div className="cat-grid">
        {cats.map((cat) => (
          <div key={cat.id} className="cat-card">
            {/* Cat image with click handler to show cat information */}
            <img
              src={cat.url}
              alt="Cat"
              className="cat-image"
              onClick={() => handleCatClick(cat)}
            />
            {/* Download button to download cat image */}
            <button
              className="download-button"
              onClick={() => handleDownloadClick(cat)}
            >
              Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
